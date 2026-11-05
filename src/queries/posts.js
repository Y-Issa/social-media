import { makeRequest } from "../axios";

export { uploadImage } from "./upload";

// Every post list is cursor-paginated and resolves to
//   { items: Post[], nextCursor: string | null }
// where a Post is
//   { postId, description, image, createdAt, userId, name, profileImage,
//     groupId, groupName, likeCount, commentCount, likedByMe, savedByMe }
// (saved posts also carry savedAt). Pass the previous page's nextCursor
// as `cursor` to get the next page.

export const PAGE_SIZE = 10;

async function fetchPage(url, { cursor, limit = PAGE_SIZE, params = {} } = {}) {
  const res = await makeRequest.get(url, {
    params: { ...params, limit, ...(cursor ? { cursor } : {}) },
  });
  return res.data;
}

// Own posts + posts of followed users (never group posts).
export function fetchFeed({ cursor } = {}) {
  return fetchPage("/posts", { cursor });
}

// One user's posts for their profile (never group posts).
export function fetchUserPosts(userId, { cursor } = {}) {
  return fetchPage("/posts", { cursor, params: { userId } });
}

// Members only.
export function fetchGroupPosts(groupId, { cursor } = {}) {
  return fetchPage(`/groups/${groupId}/posts`, { cursor });
}

// Ordered by when the post was saved; hides posts from groups you left.
export function fetchSavedPosts({ cursor } = {}) {
  return fetchPage("/save", { cursor });
}

export async function createPost(newPost) {
  const res = await makeRequest.post("/posts", newPost);
  return res.data;
}

// Regular and group posts (the author or the group's creator may delete).
export async function deletePost(postId) {
  await makeRequest.delete(`/posts/${postId}`);
}

// `liked` is the current state: true unlikes, false likes.
export async function toggleLike(postId, liked) {
  if (liked) {
    await makeRequest.delete(`/likes/${postId}`);
  } else {
    await makeRequest.post(`/likes/${postId}`, {});
  }
}

// `saved` is the current state: true unsaves, false saves.
export async function toggleSave(postId, saved) {
  if (saved) {
    await makeRequest.delete(`/save/${postId}`);
  } else {
    await makeRequest.post(`/save/${postId}`, {});
  }
}
