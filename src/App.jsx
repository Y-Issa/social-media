import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./contexts/AuthContext";
import { useDarkMode } from "./contexts/DarkModeContext";
import { theme_dark, theme_light } from "./theme";
import Home from "./pages/Home";
import Login from "./pages/login";
import RootLayout from "./layout/RootLayout";
import Profile from "./pages/profile";
import Register from "./pages/register";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SavedPosts from "./pages/SavedPosts";
import Groups from "./pages/Groups";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="profile/:uid" element={<Profile />} />
        <Route path="saved" element={<SavedPosts />} />
        <Route path="groups" element={<Groups />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </>
  )
);

const queryClient = new QueryClient();

function App() {
  const { isDark } = useDarkMode();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={isDark ? theme_dark : theme_light}>
        <AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
