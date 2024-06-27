import { makeRequest } from "../axios";
import { getAuthHeaders } from "../getAuthHeaders";

export async function fetchLikes(postId) {
  const res = await makeRequest.get(`/likes/${postId}`);
  return res.data;
}

export async function fetchSaved() {
  const res = await makeRequest.get(`/save/ids`, {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function fetchPosts(userId) {
  try {
    const res = await makeRequest.get(`/posts?userId=${userId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSavedPosts() {
  try {
    const res = await makeRequest.get("/save", {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId, liked) {
  if (!liked) {
    return makeRequest.post(
      `/likes/${postId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  }
  return makeRequest.delete(`/likes/${postId}`, {
    headers: getAuthHeaders(),
  });
}

export async function deletePost(postId) {
  await makeRequest.delete(`/posts/${postId}`, {
    headers: getAuthHeaders(),
  });
}

export async function savePost(postId, saved) {
  if (saved?.includes(postId)) {
    await makeRequest.delete(`/save/${postId}`, {
      headers: getAuthHeaders(),
    });
  } else {
    await makeRequest.post(
      `/save/${postId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  }
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

export async function createPost(newPost) {
  try {
    const res = await makeRequest.post("/posts", newPost, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Error creating post:", err);
    throw err;
  }
}
