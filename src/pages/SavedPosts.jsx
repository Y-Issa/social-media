import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import { Box, Text, Heading, VStack } from "@chakra-ui/react";
import PostCard from "../components/posts/PostCard";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { fetchSavedPosts } from "../queries/posts";
import { fetchSavedGroupPosts } from "../queries/groups";

function SavedPosts() {
  const { user } = useAuth();
  const {
    isLoading,
    error,
    data: savedPosts,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: fetchCombinedData,
  });

  async function fetchCombinedData(postId) {
    const [saved, savedGroupPosts] = await Promise.all([
      fetchSavedPosts(postId),
      fetchSavedGroupPosts(postId),
    ]);
    return [...saved, ...savedGroupPosts].filter(
      (item) => item !== null && item !== undefined
    );
  }

  return user ? (
    <Box mx="auto" maxW="800px" p={4}>
      <Heading mb={4} textAlign="center">
        Your Saved Posts
      </Heading>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Text color="red.500" textAlign="center">
          Something Went Wrong!
        </Text>
      ) : (
        <VStack spacing={4}>
          {savedPosts?.length > 0 ? (
            savedPosts.map((post) => <PostCard key={post.postId} post={post} />)
          ) : (
            <Text textAlign="center">You haven't saved any posts yet.</Text>
          )}
        </VStack>
      )}
    </Box>
  ) : (
    <Navigate to="/login" />
  );
}

export default SavedPosts;
