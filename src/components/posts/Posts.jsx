import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import Loading from "../Loading";
import PostCard from "./PostCard";
import { fetchPosts } from "../../queries/posts";

function Posts({ userId }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => fetchPosts(userId),
  });

  return isLoading ? (
    <Loading />
  ) : error ? (
    <Text>Something Went Wrong!</Text>
  ) : (
    <Box>
      {data?.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
    </Box>
  );
}

export default Posts;
