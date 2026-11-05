import { makeRequest } from "../axios";

// Uploads an image file and returns the stored filename.
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await makeRequest.post("/upload", formData);
  return res.data;
}
