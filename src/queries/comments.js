import { makeRequest } from "../axios";

// A comment is
//   { commentId, userId, postId, name, profileImage, description, createdAt }
// cached under commentKeys.post(postId), oldest first.

export const commentKeys = {
  post: (postId) => ["comments", postId],
};

export async function fetchComments(postId) {
  const res = await makeRequest.get(`/comments/${postId}`);
  return res.data;
}

export async function addComment({ postId, newComment }) {
  const res = await makeRequest.post(`/comments/${postId}`, newComment);
  return res.data;
}

// Your own comment, or any comment on your own post.
export async function deleteComment(commentId) {
  await makeRequest.delete(`/comments/${commentId}`);
}
