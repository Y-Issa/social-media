import { useColorMode } from "@chakra-ui/react";

// Thin wrapper over Chakra's color mode, kept so existing callers of
// useDarkMode() keep working. Chakra persists the choice itself.
function DarkModeProvider({ children }) {
  return children;
}

function useDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return { isDark: colorMode === "dark", toggleDarkMode: toggleColorMode };
}

export { DarkModeProvider, useDarkMode };
