import axios from "axios";
import { API_ORIGIN } from "./imageUrl";

export const makeRequest = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

// Attach the JWT to every request.
makeRequest.interceptors.request.use((config) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore malformed storage
  }
  return config;
});

// An expired or invalid token logs the user out everywhere.
// AuthProvider listens for this event.
makeRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith("/auth/login");
    if (error.response?.status === 401 && !isAuthCall) {
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// Turn an axios error into a message fit for a toast.
export function errorMessage(error, fallback = "Something went wrong.") {
  if (!error?.response) return "Could not reach the server.";
  const data = error.response.data;
  return typeof data === "string" && data ? data : fallback;
}
