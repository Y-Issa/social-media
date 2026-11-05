import { Box, Button, Text } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";

import Loading from "../Loading";
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
      empty: "You haven't saved any posts yet.",
    };
  }
  if (groupId) {
    return {
      queryKey: postKeys.group(groupId),
      queryFn: (opts) => fetchGroupPosts(groupId, opts),
      empty: "No posts yet. Start the conversation.",
    };
  }
  if (userId) {
    return {
      queryKey: postKeys.user(userId),
      queryFn: (opts) => fetchUserPosts(userId, opts),
      empty: "No posts yet.",
    };
  }
  return {
    queryKey: postKeys.feed,
    queryFn: (opts) => fetchFeed(opts),
    empty: "Nothing here yet. Follow people or write your first post.",
  };
}

function Posts({ userId, groupId, saved = false, emptyText }) {
  const list = listFor({ userId, groupId, saved });

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: list.queryKey,
    queryFn: ({ pageParam }) => list.queryFn({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const sentinelRef = useInfiniteScroll({
    hasMore: Boolean(hasNextPage),
    isLoading: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  if (isLoading) return <Loading />;
  if (error) {
    return (
      <Text px={10} color="red.500">
        {errorMessage(error, "Something went wrong.")}
      </Text>
    );
  }

  const posts = data.pages.flatMap((page) => page.items);

  if (posts.length === 0) {
    return (
      <Text px={10} color="textColor.300">
        {emptyText || list.empty}
      </Text>
    );
  }

  return (
    <Box>
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} showGroup={!groupId} />
      ))}

      <Box ref={sentinelRef} h="1px" />
      {isFetchingNextPage ? (
        <Loading />
      ) : hasNextPage ? (
        <Box textAlign="center" mb="30px">
          <Button variant="ghost" size="sm" onClick={() => fetchNextPage()}>
            Load more
          </Button>
        </Box>
      ) : (
        <Text textAlign="center" fontSize="sm" color="textColor.300" mb="30px">
          You&apos;re all caught up.
        </Text>
      )}
    </Box>
  );
}

export default Posts;
