import { Box } from "@chakra-ui/react";
import Stories from "../components/stories/Stories";
import Posts from "../components/posts/Posts";

function Home() {
  return (
    <Box px={{ base: "20px", lg: "50px" }}>
      <Stories />
      <Posts />
    </Box>
  );
}

export default Home;
