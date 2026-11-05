import { makeRequest } from "../axios";
import { fetchSavedGroupPostIds, fetchSavedGroupPosts } from "./groups";

export { uploadImage } from "./upload";

export async function fetchLikes(postId) {
  const res = await makeRequest.get(`/likes/${postId}`);
  return res.data;
}

export async function fetchSaved() {
  const res = await makeRequest.get(`/save/ids`);
  return res.data;
}

// IDs of every post the user saved, regular and group posts combined.
// Shared by all PostCards via the ["saved"] query key.
export async function fetchAllSavedIds() {
  const [saved, savedGroupPosts] = await Promise.all([
    fetchSaved(),
    fetchSavedGroupPostIds(),
  ]);
  return [...saved, ...savedGroupPosts].filter(Boolean);
}

// Without a userId this returns the current user's feed.
export async function fetchPosts(userId) {
  const res = await makeRequest.get("/posts", {
    params: userId ? { userId } : {},
  });
  return res.data;
}

export async function fetchSavedPosts() {
  const res = await makeRequest.get("/save");
  return res.data;
}

// Regular and group saved posts combined; group posts are tagged so
// PostCard talks to the group endpoints for them.
export async function fetchAllSavedPosts() {
  const [saved, savedGroupPosts] = await Promise.all([
    fetchSavedPosts(),
    fetchSavedGroupPosts(),
  ]);
  return [
    ...saved,
    ...savedGroupPosts.map((post) => ({ ...post, isGroupPost: true })),
  ];
}

export async function likePost(postId, liked) {
  if (!liked) {
    return makeRequest.post(`/likes/${postId}`, {});
  }
  return makeRequest.delete(`/likes/${postId}`);
}

export async function deletePost(postId) {
  await makeRequest.delete(`/posts/${postId}`);
}

export async function savePost(postId, saved) {
  if (saved?.includes(postId)) {
    await makeRequest.delete(`/save/${postId}`);
  } else {
    await makeRequest.post(`/save/${postId}`, {});
  }
}

export async function createPost(newPost) {
  const res = await makeRequest.post("/posts", newPost);
  return res.data;
}
