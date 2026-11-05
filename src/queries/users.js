import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toggleFollow } from "./profile";

export const suggestionKeys = { all: ["suggestions"] };

// [{ userId, name, profileImage, city, mutualCount, reason }]
export async function fetchSuggestions(limit = 4) {
  const res = await makeRequest.get("/users/suggestions", { params: { limit } });
  return res.data ?? [];
}

export function useSuggestions(limit = 4) {
  return useQuery({
    queryKey: [...suggestionKeys.all, limit],
    queryFn: () => fetchSuggestions(limit),
    staleTime: 60000,
  });
}

// Follow/unfollow a suggested account. The row keeps its place, flipped to
// "Following", until the list is next refetched (not invalidated here).
export function useSuggestionFollow(limit = 4) {
  const queryClient = useQueryClient();
  const key = [...suggestionKeys.all, limit];
  const setFollowing = (userId, isFollowing) =>
    queryClient.setQueryData(key, (rows) =>
      rows?.map((row) => (row.userId === userId ? { ...row, isFollowing } : row))
    );
  return useMutation({
    mutationFn: ({ userId, isFollowing }) => toggleFollow(userId, isFollowing),
    onMutate: ({ userId, isFollowing }) => setFollowing(userId, !isFollowing),
    onError: (_error, { userId, isFollowing }) => setFollowing(userId, isFollowing),
    onSettled: (_data, _error, { userId }) => {
      queryClient.invalidateQueries(["user", userId]);
      queryClient.invalidateQueries(["relationships", userId]);
      queryClient.invalidateQueries(["posts", "search"]);
      queryClient.invalidateQueries(["posts", "feed"]);
    },
  });
}
