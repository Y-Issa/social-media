import { useEffect, useRef } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/posts/PostCard";
import Loading from "../components/Loading";
import EmptyState from "../components/ui/EmptyState";
import { fetchPost } from "../queries/posts";
import { findCachedPost, postKeys, replacePostInCaches } from "../queries/postCache";
import { errorMessage } from "../axios";

// Missing, deleted, or a group post you can't see: same message for all.
const UNAVAILABLE = [400, 403, 404];

const statusOf = (error) => error?.response?.status;

// Single-post permalink: /post/:postId. The post renders with its replies
// open. Its row lives under postKeys.detail(postId), so likes, saves and
// edits made here (or anywhere else) stay in step with the lists.
function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleted = useRef(false);

  const query = useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => fetchPost(postId),
    // Show the row from a cached list right away, then refetch it.
    initialData: () => findCachedPost(queryClient, postId),
    initialDataUpdatedAt: 0,
    retry: (count, error) => !UNAVAILABLE.includes(statusOf(error)) && count < 2,
    // Push the fresh row into any list that already shows this post.
    onSuccess: (row) => replacePostInCaches(queryClient, row),
  });

  // A deleted post's detail entry shouldn't linger for the back button.
  useEffect(
    () => () => {
      if (deleted.current) queryClient.removeQueries(postKeys.detail(postId));
    },
    [queryClient, postId]
  );

  // Back through history when we came from inside the app, else home.
  function goBack() {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
    else navigate("/");
  }

  function handleDeleted() {
    deleted.current = true;
    navigate("/", { replace: true });
  }

  const post = query.data;
  // Checked first: a cached row must not outlive a 404 / 403 refetch.
  const unavailable = query.isError && UNAVAILABLE.includes(statusOf(query.error));

  return (
    <>
      <Flex
        as="nav"
        aria-label="Post navigation"
        align="center"
        gap={3}
        px={2}
        h="52px"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Button variant="ghost" size="sm" leftIcon={<LuArrowLeft size={16} />} onClick={goBack}>
          Back
        </Button>
        <Text textStyle="label">Post</Text>
      </Flex>

      {unavailable ? (
        <EmptyState
          title="This post isn't available."
          action={
            <Button as={RouterLink} to="/" variant="outline" size="sm">
              Go to your feed
            </Button>
          }
        >
          It may have been deleted, or it&apos;s in a group you&apos;re not a member of.
        </EmptyState>
      ) : post ? (
        <PostCard post={post} defaultExpanded onDeleted={handleDeleted} />
      ) : query.isLoading ? (
        <Loading count={1} />
      ) : (
        <EmptyState
          title="Couldn't load this post."
          action={
            <Button variant="outline" size="sm" onClick={() => query.refetch()} isLoading={query.isRefetching}>
              Try again
            </Button>
          }
        >
          {errorMessage(query.error, "Something went wrong. Check your connection and try again.")}
        </EmptyState>
      )}
      <Box h={8} />
    </>
  );
}

export default Post;
