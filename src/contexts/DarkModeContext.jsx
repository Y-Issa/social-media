import { createContext, useContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const DarkModeContect = createContext();

function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useLocalStorageState(false, "isDark");

  function toggleDarkMode() {
    setIsDark((prev) => !prev);
  }

  return (
    <DarkModeContect.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContect.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContect);

  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }

  return context;
}

export { DarkModeProvider, useDarkMode };
