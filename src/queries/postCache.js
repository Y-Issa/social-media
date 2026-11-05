// Helpers for the cached post lists. Every list is an infinite query under
// a ["posts", ...] key:
//   ["posts", "feed"]              home feed
//   ["posts", "user", userId]      profile posts
//   ["posts", "group", groupId]    group posts
//   ["posts", "saved"]             saved posts
// Each cached value is { pages: [{ items, nextCursor }], pageParams }.

export const postKeys = {
  all: ["posts"],
  feed: ["posts", "feed"],
  user: (userId) => ["posts", "user", userId],
  group: (groupId) => ["posts", "group", groupId],
  saved: ["posts", "saved"],
};

// Applies fn(items) to every page of an infinite-list value.
function mapItems(data, fn) {
  if (!data?.pages) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({ ...page, items: fn(page.items) })),
  };
}

// Replaces the post with update(post) in every cached list.
export function updatePostInCaches(queryClient, postId, update) {
  queryClient.setQueriesData(postKeys.all, (data) =>
    mapItems(data, (items) =>
      items.map((post) => (post.postId === postId ? update(post) : post))
    )
  );
}

// Removes the post from every list matching queryKey (default: all lists).
export function removePostFromCaches(queryClient, postId, queryKey = postKeys.all) {
  queryClient.setQueriesData(queryKey, (data) =>
    mapItems(data, (items) => items.filter((post) => post.postId !== postId))
  );
}

// Snapshot of every cached list, for rolling back an optimistic update.
export async function snapshotPostCaches(queryClient) {
  await queryClient.cancelQueries(postKeys.all);
  return queryClient.getQueriesData(postKeys.all);
}

export function restorePostCaches(queryClient, snapshot) {
  snapshot?.forEach(([key, data]) => queryClient.setQueryData(key, data));
}
