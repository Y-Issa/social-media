import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { makeRequest } from "../../axios";
import Loading from "../Loading";
import PostCard from "./PostCard";
import { useAuth } from "../../contexts/AuthContext";

function Posts({ userId }) {
  const { logout } = useAuth();
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await makeRequest.get(`/posts?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
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
