import { makeRequest } from "../axios";
import { getAuthHeaders } from "../getAuthHeaders";

export async function fetchComments(postId) {
  try {
    const res = await makeRequest.get(`/comments/${postId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export async function addComment({ postId, newComment }) {
  const res = await makeRequest.post(`/comments/${postId}`, newComment, {
    headers: getAuthHeaders(),
  });
  return res.data;
}
