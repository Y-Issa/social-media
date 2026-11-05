import { Avatar, Box, Flex, IconButton, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";
import { getImageUrl } from "../../imageUrl";
import { fullTime, shortTime } from "../posts/time";

// Bottom sheet inside the story frame listing who has seen your story.
// Uses semantic tokens; the viewer forces dark mode on its subtree.
function StoryViewers({ query, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => closeRef.current?.focus(), []);

  const viewers = query.data ?? [];

  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      maxH="60%"
      zIndex={3}
      bg="surface"
      color="text-primary"
      borderTop="1px solid"
      borderColor="border"
      borderTopRadius="md"
      display="flex"
      flexDirection="column"
      role="dialog"
      aria-label="Viewers"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <Flex align="center" px={4} py={2} borderBottom="1px solid" borderColor="border">
        <Text textStyle="label">
          {query.isLoading ? "Viewers" : `Seen by ${viewers.length}`}
        </Text>
        <Box flex="1" />
        <IconButton
          ref={closeRef}
          size="sm"
          variant="ghost"
          icon={<LuX size={18} />}
          aria-label="Close viewers"
          onClick={onClose}
        />
      </Flex>
      <Box overflowY="auto" flex="1">
        {query.isLoading &&
          [0, 1, 2].map((i) => (
            <Flex key={i} align="center" gap={3} px={4} py={2}>
              <SkeletonCircle size="7" />
              <Skeleton h="12px" w="40%" />
            </Flex>
          ))}
        {query.isError && (
          <Text px={4} py={3} fontSize="14px" color="text-muted">
            Couldn't load viewers.
          </Text>
        )}
        {query.isSuccess && viewers.length === 0 && (
          <Text px={4} py={3} fontSize="14px" color="text-muted">
            No one has seen this yet.
          </Text>
        )}
        {viewers.map((v) => (
          <Flex key={v.userId} align="center" gap={3} px={4} py={2}>
            <Avatar size="sm" name={v.name} src={getImageUrl(v.profileImage)} />
            <Text fontSize="14px" fontWeight={500} flex="1" noOfLines={1}>
              {v.name}
            </Text>
            <Text as="time" textStyle="meta" dateTime={v.viewedAt} title={fullTime(v.viewedAt)}>
              {shortTime(v.viewedAt)}
            </Text>
          </Flex>
        ))}
      </Box>
    </Box>
  );
}

export default StoryViewers;
