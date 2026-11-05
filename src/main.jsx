import React from "react";
import ReactDOM from "react-dom/client";
import { ColorModeScript } from "@chakra-ui/react";
import App from "./App.jsx";
import theme from "./theme";

// One-time migration from the old custom "isDark" flag to Chakra's color mode.
try {
  const legacy = localStorage.getItem("isDark");
  if (legacy !== null) {
    if (!localStorage.getItem("chakra-ui-color-mode")) {
      localStorage.setItem(
        "chakra-ui-color-mode",
        JSON.parse(legacy) ? "dark" : "light"
      );
    }
    localStorage.removeItem("isDark");
  }
} catch {
  // storage unavailable — fall back to the default mode
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>
);
