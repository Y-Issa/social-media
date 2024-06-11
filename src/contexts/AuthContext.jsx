import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const TEMPUSER = {
    name: "user",
    email: "user@test.com",
    password: "password123",
    image:
      "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp",
  };

  function login() {
    setIsLoggedIn(true);
  }

  function logout() {
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, TEMPUSER }}>
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
