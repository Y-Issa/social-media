import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { toggleFollow } from "./profile";
import { joinGroup } from "./groups";

export const SEARCH_TYPES = ["all", "users", "posts", "groups"];

// Search results are cached under ["posts", "search", type, q] in the same
// { pages: [{ items }] } shape as the post lists, so PostCard's optimistic
// like/save updates (which patch every ["posts", ...] list) reach them too.
// The page also carries users and groups.
export const searchKey = (type, q) => ["posts", "search", type, q];

export async function search(q, type = "all", limit) {
  const res = await makeRequest.get("/search", { params: { q, type, limit } });
  const data = res.data || {};
  return {
    pages: [
      {
        items: data.posts ?? [],
        users: data.users ?? [],
        groups: data.groups ?? [],
        nextCursor: null,
      },
    ],
    pageParams: [undefined],
  };
}

export function useSearch(q, type) {
  const term = q.trim();
  return useQuery({
    queryKey: searchKey(type, term),
    queryFn: () => search(term, type),
    enabled: term.length > 0,
    keepPreviousData: true,
    select: (data) => data.pages[0],
    staleTime: 30000,
  });
}

function patchSearch(queryClient, field, idKey, id, patch) {
  queryClient.setQueriesData(["posts", "search"], (data) => {
    if (!data?.pages) return data;
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        [field]: page[field]?.map((row) => (row[idKey] === id ? { ...row, ...(typeof patch === "function" ? patch(row) : patch) } : row)),
      })),
    };
  });
}

// Follow / unfollow from a search result, optimistic.
export function useSearchFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isFollowing }) => toggleFollow(userId, isFollowing),
    onMutate: ({ userId, isFollowing }) => {
      patchSearch(queryClient, "users", "userId", userId, { isFollowing: !isFollowing });
    },
    onError: (_error, { userId, isFollowing }) => {
      patchSearch(queryClient, "users", "userId", userId, { isFollowing });
    },
    onSettled: (_data, _error, { userId }) => {
      queryClient.invalidateQueries(["suggestions"]);
      queryClient.invalidateQueries(["user", userId]);
      queryClient.invalidateQueries(["relationships", userId]);
      queryClient.invalidateQueries(["posts", "feed"]);
    },
  });
}

export function useSearchJoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId) => joinGroup(groupId),
    onSuccess: (_data, groupId) => {
      patchSearch(queryClient, "groups", "groupId", groupId, (g) => ({
        isMember: true,
        memberCount: g.isMember ? g.memberCount : (g.memberCount ?? 0) + 1,
      }));
      queryClient.invalidateQueries(["groups"]);
      queryClient.invalidateQueries(["joinedGroups"]);
      queryClient.invalidateQueries(["group", groupId]);
    },
  });
}
