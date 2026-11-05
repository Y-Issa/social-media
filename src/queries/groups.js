import { makeRequest } from "../axios";

export { uploadImage } from "./upload";

export async function fetchJoinedGroups() {
  const res = await makeRequest.get("/groups/joined");
  return res.data;
}

export async function fetchUnjoinedGroups() {
  const res = await makeRequest.get("/groups/unjoined");
  return res.data;
}

export async function createGroup(group) {
  const res = await makeRequest.post("/groups", group);
  return res.data;
}

export async function deleteGroup(groupId) {
  await makeRequest.delete(`/groups/${groupId}/delete`);
}

export async function joinGroup(groupId) {
  await makeRequest.post(`/groups/${groupId}`, {});
}

export async function leaveGroup(groupId) {
  await makeRequest.delete(`/groups/${groupId}`);
}

export async function fetchGroupMembers(groupId) {
  const res = await makeRequest.get(`/groups/${groupId}/members`);
  return res.data;
}

export async function createGroupPost({ groupId, post }) {
  const res = await makeRequest.post(`/groups/${groupId}/posts`, post);
  return res.data;
}

export async function fetchGroupPosts(groupId) {
  const res = await makeRequest.get(`/groups/${groupId}/posts`);
  return res.data;
}

export async function deleteGroupPost(postId) {
  await makeRequest.delete(`/groups/posts/${postId}`);
}

export async function fetchGroupComments(postId) {
  const res = await makeRequest.get(`/groups/${postId}/comments`);
  return res.data;
}

export async function addGroupComment({ postId, newComment }) {
  const res = await makeRequest.post(`/groups/${postId}/comments`, newComment);
  return res.data;
}

export async function fetchGroupPostLikes(postId) {
  const res = await makeRequest.get(`/groups/${postId}/likes`);
  return res.data;
}

export async function likeGroupPost(postId, liked) {
  if (!liked) {
    return makeRequest.post(`/groups/${postId}/likes`, {});
  }
  return makeRequest.delete(`/groups/${postId}/likes`);
}

export async function saveGroupPost(postId, saved) {
  if (saved?.includes(postId)) {
    await makeRequest.delete(`/groups/save/${postId}`);
  } else {
    await makeRequest.post(`/groups/save/${postId}`, {});
  }
}

export async function fetchSavedGroupPosts() {
  const res = await makeRequest.get("/groups/save");
  return res.data;
}

export async function fetchSavedGroupPostIds() {
  const res = await makeRequest.get("/groups/save/ids");
  return res.data;
}

// Group header: { groupId, name, description, image, createdBy, createdAt, memberCount, isMember }
export async function fetchGroup(groupId) {
  const res = await makeRequest.get(`/groups/${groupId}`);
  return res.data;
}
