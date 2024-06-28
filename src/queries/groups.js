import { makeRequest } from "../axios";
import { getAuthHeaders } from "../getAuthHeaders";

export async function fetchJoinedGroups() {
  const res = await makeRequest.get("/groups/joined", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function fetchUnjoinedGroups() {
  const res = await makeRequest.get("/groups/unjoined", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function createGroup(group) {
  const res = await makeRequest.post("/groups", group, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function deleteGroup(groupId) {
  await makeRequest.delete(`/groups/${groupId}/delete`, {
    headers: getAuthHeaders(),
  });
}

export async function joinGroup(groupId) {
  await makeRequest.post(
    `/groups/${groupId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
}

export async function leaveGroup(groupId) {
  await makeRequest.delete(`/groups/${groupId}`, {
    headers: getAuthHeaders(),
  });
}

export async function fetchGroupMembers(groupId) {
  const res = await makeRequest.get(`/groups/${groupId}/members`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function createGroupPost({ groupId, post }) {
  const res = await makeRequest.post(`/groups/${groupId}/posts`, post, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await makeRequest.post("/upload", formData);
    return res.data;
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
}

export async function fetchGroupPosts(groupId) {
  const res = await makeRequest.get(`/groups/${groupId}/posts`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function deleteGroupPost(postId) {
  await makeRequest.delete(`/groups/posts/${postId}`, {
    headers: getAuthHeaders(),
  });
}

export async function fetchGroupPostLikes(postId) {
  const res = await makeRequest.get(`/groups/${postId}/likes`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function likeGroupPost(postId, liked) {
  if (!liked) {
    return makeRequest.post(
      `/groups/${postId}/likes`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  }
  return makeRequest.delete(`/groups/${postId}/likes`, {
    headers: getAuthHeaders(),
  });
}

export async function saveGroupPost(postId, saved) {
  if (saved?.includes(postId)) {
    await makeRequest.delete(`/groups/save/${postId}`, {
      headers: getAuthHeaders(),
    });
  } else {
    await makeRequest.post(
      `/groups/save/${postId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  }
}

export async function fetchSavedGroupPosts() {
  const res = await makeRequest.get("/groups/save", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function fetchSavedGroupPostIds() {
  const res = await makeRequest.get("/groups/save/ids", {
    headers: getAuthHeaders(),
  });
  return res.data;
}
