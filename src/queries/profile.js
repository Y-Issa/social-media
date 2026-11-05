import { makeRequest } from "../axios";

export { uploadImage } from "./upload";

export async function fetchUser(userId) {
  const res = await makeRequest.get(`users/find/${userId}`);
  return res.data;
}

export async function fetchRelationships(userId) {
  const res = await makeRequest.get(`relationships/${userId}`);
  return res.data;
}

export async function toggleFollow(userId, following) {
  if (following) {
    return makeRequest.delete(`relationships/${userId}`);
  } else {
    return makeRequest.post(`relationships/${userId}`, {});
  }
}

export async function updateProfile(newProfile) {
  const res = await makeRequest.put("/users", newProfile);
  return res.data;
}
