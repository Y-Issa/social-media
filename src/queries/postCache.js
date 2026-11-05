// Helpers for the cached post lists. Every list is an infinite query under
// a ["posts", ...] key:
//   ["posts", "feed"]              home feed
//   ["posts", "user", userId]      profile posts
//   ["posts", "group", groupId]    group posts
//   ["posts", "saved"]             saved posts
// Each cached value is { pages: [{ items, nextCursor }], pageParams }.
// The single-post permalink lives under ["posts", "detail", postId] and
// holds one post row; the helpers below update it alongside the lists.

export const postKeys = {
  all: ["posts"],
  feed: ["posts", "feed"],
  user: (userId) => ["posts", "user", userId],
  group: (groupId) => ["posts", "group", groupId],
  saved: ["posts", "saved"],
  detail: (postId) => ["posts", "detail", postId],
};

// Applies fn(items) to every page of an infinite-list value. A single post
// row (the detail query) is treated as a one-item list; removing it keeps
// the row, since the permalink page handles a deleted post itself.
function mapItems(data, fn) {
  if (data?.postId && !data.pages) {
    const [row] = fn([data]);
    return row ?? data;
  }
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

// Merges a fresh post row from the server into every cached list.
export function replacePostInCaches(queryClient, row) {
  if (!row?.postId) return;
  updatePostInCaches(queryClient, row.postId, (post) => ({ ...post, ...row }));
}

// Adds delta to the post's commentCount in every cached list.
export function bumpCommentCount(queryClient, postId, delta) {
  updatePostInCaches(queryClient, postId, (post) => ({
    ...post,
    commentCount: Math.max(0, (post.commentCount ?? 0) + delta),
  }));
}

// Removes the post from every list matching queryKey (default: all lists).
export function removePostFromCaches(queryClient, postId, queryKey = postKeys.all) {
  queryClient.setQueriesData(queryKey, (data) =>
    mapItems(data, (items) => items.filter((post) => post.postId !== postId))
  );
}

// The post's row from any cached list (or the detail query), or undefined.
export function findCachedPost(queryClient, postId) {
  for (const [, data] of queryClient.getQueriesData(postKeys.all)) {
    if (data?.postId === postId) return data;
    for (const page of data?.pages ?? []) {
      const hit = page.items?.find((post) => post.postId === postId);
      if (hit) return hit;
    }
  }
  return undefined;
}

// Snapshot of every cached list, for rolling back an optimistic update.
export async function snapshotPostCaches(queryClient) {
  await queryClient.cancelQueries(postKeys.all);
  return queryClient.getQueriesData(postKeys.all);
}

export function restorePostCaches(queryClient, snapshot) {
  snapshot?.forEach(([key, data]) => queryClient.setQueryData(key, data));
}
