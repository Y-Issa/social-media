import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import SearchBox from "../rightbar/SearchBox";
import WhoToFollow from "../rightbar/WhoToFollow";

function Rightbar() {
  return (
    <VStack
      as="aside"
      aria-label="Sidebar"
      position="sticky"
      top={0}
      align="stretch"
      spacing={4}
      py={4}
      px={6}
      maxH="100vh"
    >
      <SearchBox />
      <WhoToFollow />
      <Box as="footer" px={1}>
        <HStack spacing={3} wrap="wrap" textStyle="meta" fontSize="11px">
          <Text as="span">© {new Date().getFullYear()} Communet</Text>
          <Text as="span" aria-hidden>
            ·
          </Text>
          <Text as="span">v0.2</Text>
        </HStack>
      </Box>
    </VStack>
  );
}

export default Rightbar;
