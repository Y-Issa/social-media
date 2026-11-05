import { Avatar, Box, Flex, IconButton, Link, Skeleton, SkeletonCircle, Text, Tooltip } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { Link as RouterLink } from "react-router-dom";
import { getImageUrl } from "../../imageUrl";
import { fullTime, isoTime, shortTime } from "./time";

// Left column of a comment row: 28px avatar with the thread line below it.
function ThreadGutter({ children }) {
  return (
    <Flex direction="column" align="center" flex="none" w="28px">
      {children}
      <Box w="1px" flex="1" minH={2} bg="border" mt={1} />
    </Flex>
  );
}

function Comment({ comment, canDelete, onDelete }) {
  const profile = `/profile/${comment.userId}`;
  return (
    <Flex
      gap={2.5}
      role="group"
      sx={{ "@media (hover: hover)": { "& .comment-delete": { opacity: 0 } } }}
      _hover={{ "& .comment-delete": { opacity: 1 } }}
      _focusWithin={{ "& .comment-delete": { opacity: 1 } }}
    >
      <ThreadGutter>
        <Avatar
          as={RouterLink}
          to={profile}
          size="sm"
          name={comment.name}
          src={getImageUrl(comment.profileImage)}
        />
      </ThreadGutter>
      <Box flex="1" minW={0} pb={3}>
        <Flex align="center" gap={1.5} minH="28px">
          <Link
            as={RouterLink}
            to={profile}
            color="text-primary"
            fontSize="14px"
            fontWeight={600}
            lineHeight="20px"
            noOfLines={1}
            _hover={{ textDecoration: "underline", color: "text-primary" }}
          >
            {comment.name}
          </Link>
          <Text textStyle="meta" aria-hidden>
            ·
          </Text>
          <Tooltip label={fullTime(comment.createdAt)} openDelay={400}>
            <Text as="time" dateTime={isoTime(comment.createdAt)} textStyle="meta" flex="none">
              {shortTime(comment.createdAt)}
            </Text>
          </Tooltip>
          {canDelete && (
            <IconButton
              className="comment-delete"
              ml="auto"
              size="xs"
              variant="ghost"
              w="24px"
              h="24px"
              transition="opacity 120ms, background 120ms, color 120ms"
              _hover={{ bg: "danger-subtle", color: "danger" }}
              icon={<LuTrash2 size={14} />}
              aria-label="Delete comment"
              onClick={() => onDelete(comment)}
            />
          )}
        </Flex>
        <Text fontSize="14px" lineHeight="20px" color="text-primary" whiteSpace="pre-wrap" overflowWrap="anywhere">
          {comment.description}
        </Text>
      </Box>
    </Flex>
  );
}

function CommentList({ comments, canDelete, onDelete }) {
  return comments.map((comment) => (
    <Comment
      key={comment.commentId}
      comment={comment}
      canDelete={canDelete(comment)}
      onDelete={onDelete}
    />
  ));
}

export function CommentSkeleton({ count = 2 }) {
  return (
    <Box aria-busy="true" aria-label="Loading comments">
      {Array.from({ length: count }, (_, i) => (
        <Flex key={i} gap={2.5}>
          <ThreadGutter>
            <SkeletonCircle size="7" />
          </ThreadGutter>
          <Box flex="1" pb={3} pt={1.5}>
            <Skeleton h="10px" w="96px" />
            <Skeleton h="10px" w={i % 2 ? "56%" : "82%"} mt={2.5} />
          </Box>
        </Flex>
      ))}
    </Box>
  );
}

export default CommentList;
