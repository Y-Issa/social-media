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

// Group post lists live in ./posts (fetchGroupPosts); likes, comments,
// saves and deletes use the same endpoints as regular posts.

// Group header: { groupId, name, description, image, createdBy, createdAt, memberCount, isMember }
export async function fetchGroup(groupId) {
  const res = await makeRequest.get(`/groups/${groupId}`);
  return res.data;
}
