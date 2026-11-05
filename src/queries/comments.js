import { makeRequest } from "../axios";

export async function fetchComments(postId) {
  try {
    const res = await makeRequest.get(`/comments/${postId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export async function addComment({ postId, newComment }) {
  const res = await makeRequest.post(`/comments/${postId}`, newComment);
  return res.data;
}
