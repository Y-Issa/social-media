import { Box } from "@chakra-ui/react";
import Stories from "../components/stories/Stories";
import Posts from "../components/posts/Posts";
import NewPost from "../components/posts/NewPost";

function Home() {
  return (
    <Box px={{ base: "20px", lg: "50px" }}>
      <Stories />
      <NewPost />
      <Posts />
    </Box>
  );
}

export default Home;
