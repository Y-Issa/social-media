import { Box, Flex } from "@chakra-ui/react";
import { Navigate, Outlet, useMatch } from "react-router-dom";
import Leftbar from "../components/navigation/Leftbar";
import Rightbar from "../components/navigation/Rightbar";
import { MobileHeader, MobileTabBar } from "../components/navigation/MobileNav";
import { useAuth } from "../contexts/AuthContext";

// Shell: max 1240px. Left rail (72px md–xl, 240px xl+), feed column up to
// 600px with side borders, right column 320px from lg. The window scrolls.
function RootLayout() {
  const { user } = useAuth();
  // Messages is a two-pane page: wider main column, no right column.
  const wide = Boolean(useMatch("/messages/*"));

  // Every page under the layout requires a logged-in user.
  if (!user) return <Navigate to="/login" />;

  return (
    <Box minH="100vh" bg="bg" color="text-primary">
      <MobileHeader />
      <Flex maxW="1240px" mx="auto" justify="center" align="flex-start">
        <Box
          display={{ base: "none", md: "block" }}
          flex="none"
          w={{ md: "72px", xl: "240px" }}
          alignSelf="stretch"
        >
          <Leftbar />
        </Box>

        <Box
          as="main"
          id="main"
          flex="1 1 600px"
          minW={0}
          maxW={wide ? "920px" : "600px"}
          minH={wide ? undefined : "100vh"}
          bg="surface"
          borderX={{ base: "none", sm: "1px solid" }}
          borderColor={{ sm: "border" }}
          pb={{ base: "calc(72px + env(safe-area-inset-bottom))", md: wide ? 0 : 10 }}
        >
          <Outlet />
        </Box>

        <Box
          display={{ base: "none", lg: wide ? "none" : "block" }}
          flex="none"
          w="320px"
          alignSelf="stretch"
        >
          <Rightbar />
        </Box>
      </Flex>
      <MobileTabBar />
    </Box>
  );
}

export default RootLayout;
