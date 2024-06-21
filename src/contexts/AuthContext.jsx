import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  async function login({ email, password }) {
    const response = await axios.post(
      "http://localhost:8001/api/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      localStorage.setItem("token", JSON.stringify(response.data.token));
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ login, logout, user }}>
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
