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
import { DarkModeProvider } from "./contexts/DarkModeContext";
import theme from "./theme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RootLayout from "./layout/RootLayout";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SavedPosts from "./pages/SavedPosts";
import Groups from "./pages/Groups";
import Group from "./pages/Group";
import RouteError from "./components/ui/RouteError";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="login" element={<Login />} errorElement={<RouteError />} />
      <Route path="register" element={<Register />} errorElement={<RouteError />} />
      <Route path="/" element={<RootLayout />} errorElement={<RouteError />}>
        {/* Page errors render inside the shell so navigation stays usable. */}
        <Route errorElement={<RouteError inline />}>
          <Route index element={<Home />} />
          <Route path="profile/:uid" element={<Profile />} />
          <Route path="saved" element={<SavedPosts />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:groupId" element={<Group />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Route>
    </>
  )
);

const queryClient = new QueryClient();

const toastOptions = {
  defaultOptions: {
    position: "bottom-left",
    variant: "toast",
    duration: 4000,
    isClosable: true,
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} toastOptions={toastOptions}>
        <DarkModeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </DarkModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
