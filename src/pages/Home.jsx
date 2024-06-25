import { Box } from "@chakra-ui/react";
import Stories from "../components/stories/Stories";
import Posts from "../components/posts/Posts";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import NewPost from "../components/posts/NewPost";

function Home() {
  const { user } = useAuth();
  return user ? (
    <Box px={{ base: "20px", lg: "50px" }}>
      <Stories />
      <NewPost />
      <Posts />
    </Box>
  ) : (
    <Navigate to="/login" />
  );
}

export default Home;
