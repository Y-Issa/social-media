import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";

import Loading from "../Loading";
import EmptyState from "../ui/EmptyState";
import PostCard from "./PostCard";
import {
  fetchFeed,
  fetchGroupPosts,
  fetchSavedPosts,
  fetchUserPosts,
} from "../../queries/posts";
import { postKeys } from "../../queries/postCache";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { errorMessage } from "../../axios";

// Which list to show: the home feed (no props), a profile (userId),
// a group (groupId) or the saved posts (saved).
function listFor({ userId, groupId, saved }) {
  if (saved) {
    return {
      queryKey: postKeys.saved,
      queryFn: (opts) => fetchSavedPosts(opts),
      // Leaving a group elsewhere hides its posts here, so always refetch.
      options: { refetchOnMount: "always" },
      empty: (
        <EmptyState
          title="Nothing saved yet."
          action={
            <Button as={RouterLink} to="/" variant="secondary" size="sm">
              Back to Home
            </Button>
          }
        >
          Tap the bookmark on any post to keep it here.
        </EmptyState>
      ),
    };
  }
  if (groupId) {
    return {
      queryKey: postKeys.group(groupId),
      queryFn: (opts) => fetchGroupPosts(groupId, opts),
      empty: <EmptyState title="No posts yet.">Be the first to post in this group.</EmptyState>,
    };
  }
  if (userId) {
    return {
      queryKey: postKeys.user(userId),
      queryFn: (opts) => fetchUserPosts(userId, opts),
      empty: <EmptyState title="No posts yet." />,
    };
  }
  return {
    queryKey: postKeys.feed,
    queryFn: (opts) => fetchFeed(opts),
    empty: (
      <EmptyState
        title="Your feed is quiet."
        action={
          <Button as={RouterLink} to="/groups" variant="secondary" size="sm">
            Browse groups
          </Button>
        }
      >
        Follow people or join a group, and their posts will show up here.
      </EmptyState>
    ),
  };
}

function CaughtUp() {
  return (
    <Flex align="center" gap={3} px={4} py={8}>
      <Box flex="1" h="1px" bg="border" />
      <Text textStyle="meta" flex="none">
        You&apos;re all caught up.
      </Text>
      <Box flex="1" h="1px" bg="border" />
    </Flex>
  );
}

// canModerate: the viewer owns the group, so may delete any post in it.
function Posts({ userId, groupId, saved = false, empty, canModerate = false }) {
  const list = listFor({ userId, groupId, saved });

  const {
    data,
    error,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: list.queryKey,
    queryFn: ({ pageParam }) => list.queryFn({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    ...list.options,
  });

  const sentinelRef = useInfiniteScroll({
    hasMore: Boolean(hasNextPage),
    isLoading: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <Box px={4} py={8}>
        <Text color="danger" fontSize="14px">
          {errorMessage(error, "Couldn't load posts.")}
        </Text>
        <Button mt={3} size="sm" variant="secondary" onClick={() => refetch()} isLoading={isRefetching}>
          Try again
        </Button>
      </Box>
    );
  }

  const posts = data.pages.flatMap((page) => page.items);

  if (posts.length === 0) return empty ?? list.empty;

  return (
    <Box>
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          showGroup={!groupId}
          canModerate={canModerate}
        />
      ))}

      <Box ref={sentinelRef} h="1px" />
      {isFetchingNextPage ? (
        <Loading count={2} />
      ) : hasNextPage ? (
        <Box textAlign="center" py={6}>
          <Button variant="ghost" size="sm" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        </Box>
      ) : (
        <CaughtUp />
      )}
    </Box>
  );
}

export default Posts;
