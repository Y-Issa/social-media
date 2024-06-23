import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { makeRequest } from "../../axios";
import Loading from "../Loading";
import PostCard from "./PostCard";
import NewPost from "./NewPost";
import { useAuth } from "../../contexts/AuthContext";

function Posts() {
  const { logout } = useAuth();
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await makeRequest.get("/posts", {
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

  return isPending ? (
    <Loading />
  ) : error ? (
    <Text>Something Went Wrong!</Text>
  ) : (
    <Box>
      <NewPost />
      {data?.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
    </Box>
  );
}

export default Posts;
