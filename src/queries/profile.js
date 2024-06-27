import { makeRequest } from "../axios";
import { getAuthHeaders } from "../getAuthHeaders";

export async function fetchUser(userId) {
  const res = await makeRequest.get(`users/find/${userId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function fetchRelationships(userId) {
  const res = await makeRequest.get(`relationships/${userId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function toggleFollow(userId, following) {
  if (following) {
    return makeRequest.delete(`relationships/${userId}`, {
      headers: getAuthHeaders(),
    });
  } else {
    return makeRequest.post(
      `relationships/${userId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  }
}

export async function updateProfile(newProfile) {
  const res = await makeRequest.put("/users", newProfile, {
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
  } catch (error) {
    console.log(error);
  }
}
