import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./pages/login";
import RootLayout from "./layout/RootLayout";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import { useDarkMode } from "./contexts/DarkModeContext";
import { theme_dark, theme_light } from "./theme";
import Home from "./pages/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="profile/" element={<Profile />} />
      </Route>
    </>
  )
);

function App() {
  const { isDark } = useDarkMode();

  return (
    <ChakraProvider theme={isDark ? theme_dark : theme_light}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
