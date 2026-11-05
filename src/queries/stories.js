import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { uploadImage } from "./upload";

export const STORY_CAPTION_MAX = 200;
export const STORY_DURATION_MS = 5000;

export const storyKeys = {
  all: ["stories"],
  feed: ["stories", "feed"],
  viewers: (storyId) => ["stories", "viewers", storyId],
};

// [{ user: { userId, name, profileImage },
//    stories: [{ storyId, image, caption, createdAt, expiresAt, viewed }],
//    hasUnseen }]
export async function fetchStoryFeed() {
  const res = await makeRequest.get("/stories/feed");
  return res.data;
}

export async function fetchStoryViewers(storyId) {
  const res = await makeRequest.get(`/stories/${storyId}/viewers`);
  return res.data;
}

export function useStoryFeed() {
  return useQuery({
    queryKey: storyKeys.feed,
    queryFn: fetchStoryFeed,
    // Stories expire; keep the strip reasonably fresh.
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useStoryViewers(storyId, enabled = true) {
  return useQuery({
    queryKey: storyKeys.viewers(storyId),
    queryFn: () => fetchStoryViewers(storyId),
    enabled: Boolean(storyId) && enabled,
  });
}

// Uploads the file, then creates the story.
export function useCreateStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, caption }) => {
      const image = await uploadImage(file);
      const res = await makeRequest.post("/stories", { image, caption });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(storyKeys.feed),
  });
}

// Marks a story seen. The cache is updated in place (without re-sorting, so
// the strip doesn't jump while the viewer is open); the next refetch orders it.
export function useViewStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storyId) => makeRequest.post(`/stories/${storyId}/view`),
    onMutate: (storyId) => {
      queryClient.setQueryData(storyKeys.feed, (feed) =>
        feed?.map((group) => {
          if (!group.stories.some((s) => s.storyId === storyId)) return group;
          const stories = group.stories.map((s) =>
            s.storyId === storyId ? { ...s, viewed: true } : s
          );
          return { ...group, stories, hasUnseen: stories.some((s) => !s.viewed) };
        })
      );
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storyId) => makeRequest.delete(`/stories/${storyId}`),
    onSuccess: (_, storyId) => {
      queryClient.setQueryData(storyKeys.feed, (feed) =>
        feed
          ?.map((group) => {
            const stories = group.stories.filter((s) => s.storyId !== storyId);
            return { ...group, stories, hasUnseen: stories.some((s) => !s.viewed) };
          })
          .filter((group) => group.stories.length > 0)
      );
      queryClient.invalidateQueries(storyKeys.feed);
    },
  });
}
