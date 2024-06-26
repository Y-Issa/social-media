import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import Loading from "../components/Loading";
import { Box, Text, Heading, VStack } from "@chakra-ui/react";
import PostCard from "../components/posts/PostCard";

function SavedPosts() {
  const {
    isLoading,
    error,
    data: savedPosts,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      try {
        const res = await makeRequest.get("/save", {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        });
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
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
  );
}

export default SavedPosts;
