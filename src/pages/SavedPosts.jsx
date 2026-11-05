import { Box, Heading } from "@chakra-ui/react";
import Posts from "../components/posts/Posts";

// Saved posts, newest save first. Group posts show which group they're from.
function SavedPosts() {
  return (
    <Box mx="auto" maxW="800px" p={4}>
      <Heading mb={4} textAlign="center">
        Your Saved Posts
      </Heading>
      <Posts saved />
    </Box>
  );
}

export default SavedPosts;
