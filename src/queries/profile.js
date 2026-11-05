import { makeRequest } from "../axios";

export { uploadImage } from "./upload";

// { userId, name, profileImage, coverImage, city, website, email (own only),
//   followerCount, followingCount, isFollowing }
export async function fetchUser(userId) {
  const res = await makeRequest.get(`users/find/${userId}`);
  return res.data;
}

export async function fetchRelationships(userId) {
  const res = await makeRequest.get(`relationships/${userId}`);
  return res.data;
}

// [{ userId, name, profileImage }] (up to 100)
export async function fetchFollowers(userId) {
  const res = await makeRequest.get(`users/${userId}/followers`);
  return res.data;
}

export async function fetchFollowing(userId) {
  const res = await makeRequest.get(`users/${userId}/following`);
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
