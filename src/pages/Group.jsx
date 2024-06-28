import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchGroupPosts } from "../queries/groups";
import Loading from "../components/Loading";
import { Box, Text } from "@chakra-ui/react";
import PostCard from "../components/posts/PostCard";
import CreateGroupPost from "../components/group/CreateGroupPost";

function Group() {
  const { groupId } = useParams();

  const {
    isLoading: isLoadingPosts,
    error: errorPosts,
    data: posts,
  } = useQuery({
    queryKey: ["GroupPosts", groupId],
    queryFn: () => fetchGroupPosts(groupId),
  });

  return isLoadingPosts ? (
    <Loading />
  ) : errorPosts ? (
    <Text>Something Went Wrong!</Text>
  ) : (
    <Box>
      <CreateGroupPost groupId={groupId} />
      {posts?.map((post) => (
        <PostCard key={post.postId} post={post} groupPost={true} />
      ))}
    </Box>
  );
}

export default Group;
