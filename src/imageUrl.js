export const API_ORIGIN =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8001";

// Images are stored either as full URLs (pasted links) or as filenames
// returned by the /api/upload endpoint. Resolve both to something <img> can load.
export function getImageUrl(image) {
  if (!image) return undefined;
  if (image.startsWith("http") || image.startsWith("blob:")) return image;
  return `${API_ORIGIN}/public/upload/${image}`;
}
