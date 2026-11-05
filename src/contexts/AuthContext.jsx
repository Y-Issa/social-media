import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";

const AuthContext = createContext();

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(readStoredUser);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Don't let the next account see the previous one's cached data.
    queryClient.clear();
  }, [queryClient]);

  // Any 401 from the API (expired/invalid token) logs out.
  useEffect(() => {
    window.addEventListener("auth:logout", logout);
    return () => window.removeEventListener("auth:logout", logout);
  }, [logout]);

  // Validate a stored token on startup; the interceptor handles the 401.
  useEffect(() => {
    if (localStorage.getItem("token")) {
      makeRequest.get("/auth/check").catch(() => {});
    }
  }, []);

  async function login({ email, password }) {
    const response = await makeRequest.post("/auth/login", { email, password });
    queryClient.clear();
    localStorage.setItem("token", JSON.stringify(response.data.token));
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  }

  // Replace the stored user after a profile update.
  function updateUser(nextUser) {
    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);
  }

  return (
    <AuthContext.Provider value={{ login, logout, updateUser, user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
