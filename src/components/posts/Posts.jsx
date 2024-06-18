import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { makeRequest } from "../../axios";
import Loading from "../Loading";
import PostCard from "./PostCard";

function Posts() {
  const { isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest
        .get("/posts", {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        })
        .then((res) => {
          return res.data;
        }),
  });

  return isPending ? (
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
