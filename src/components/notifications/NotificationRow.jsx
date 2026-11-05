import { Avatar, Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { getImageUrl } from "../../imageUrl";
import { fullTime, shortTime } from "../posts/time";
import { dayHeader, timeRange } from "../events/format";

const strong = (children) => (
  <Text as="span" fontWeight={600} color="text-primary">
    {children}
  </Text>
);

function sentence(n) {
  const actor = strong(n.actor?.name || "Someone");
  switch (n.type) {
    case "like":
      return <>{actor} liked your post</>;
    case "comment":
      return n.comment?.excerpt ? (
        <>
          {actor} commented: “{n.comment.excerpt}”
        </>
      ) : (
        <>{actor} commented on your post</>
      );
    case "follow":
      return <>{actor} started following you</>;
    case "group_join":
      return <>{actor} joined {strong(n.group?.name || "your group")}</>;
    case "event":
      return (
        <>
          {actor} scheduled {strong(n.event?.title || "an event")}
          {n.group?.name && <> in {n.group.name}</>}
        </>
      );
    default:
      return <>{actor} interacted with you</>;
  }
}

// Plain-text version for the row's accessible name.
function sentenceText(n) {
  const name = n.actor?.name || "Someone";
  switch (n.type) {
    case "like":
      return `${name} liked your post`;
    case "comment":
      return n.comment?.excerpt
        ? `${name} commented: ${n.comment.excerpt}`
        : `${name} commented on your post`;
    case "follow":
      return `${name} started following you`;
    case "group_join":
      return `${name} joined ${n.group?.name || "your group"}`;
    case "event":
      return `${name} scheduled ${n.event?.title || "an event"}${n.group?.name ? ` in ${n.group.name}` : ""}`;
    default:
      return `${name} interacted with you`;
  }
}

// Where a click on the notification goes.
export function notificationHref(n, currentUserId) {
  if (n.type === "follow") return `/profile/${n.actor?.userId}`;
  if (n.type === "event") return n.event?.eventId ? `/events/${n.event.eventId}` : "/events";
  if (n.type === "group_join") return n.group?.groupId ? `/groups/${n.group.groupId}` : "/groups";
  // like / comment: the post's permalink.
  if (n.post?.postId) return `/post/${n.post.postId}`;
  if (n.post?.groupId) return `/groups/${n.post.groupId}`;
  return `/profile/${currentUserId}`;
}

function NotificationRow({ notification: n, onOpen }) {
  const unread = !n.readAt;
  const label = `${sentenceText(n)}, ${shortTime(n.createdAt)}${unread ? ", unread" : ""}`;
  return (
    <Box as="li" listStyleType="none">
      <Flex
        as="button"
        type="button"
        onClick={() => onOpen(n)}
        aria-label={label}
        w="full"
        textAlign="left"
        gap={3}
        px={4}
        py={3}
        position="relative"
        bg={unread ? "surface-raised" : "transparent"}
        borderBottom="1px solid"
        borderColor="border"
        transition="background 120ms"
        _hover={{ bg: "surface-raised" }}
        _focusVisible={{ boxShadow: "inset 0 0 0 2px var(--chakra-colors-accent)", outline: "none" }}
        _before={
          unread
            ? { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, w: "2px", bg: "accent" }
            : undefined
        }
      >
        <Avatar size="md" flex="none" name={n.actor?.name} src={getImageUrl(n.actor?.profileImage)} />
        <Box flex="1" minW={0}>
          <Flex gap={2} align="baseline">
            <Text flex="1" minW={0} fontSize="15px" lineHeight="22px" color="text-secondary" noOfLines={2}>
              {sentence(n)}
            </Text>
            <Text as="time" dateTime={n.createdAt} title={fullTime(n.createdAt)} textStyle="meta" flex="none">
              {shortTime(n.createdAt)}
            </Text>
          </Flex>
          {n.post?.excerpt && (
            <Text mt={0.5} fontSize="14px" lineHeight="20px" color="text-muted" noOfLines={1}>
              {n.post.excerpt}
            </Text>
          )}
          {n.type === "event" && n.event?.startsAt && (
            <Text mt={0.5} textStyle="meta">
              {dayHeader(n.event.startsAt)} · {timeRange(n.event.startsAt)}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

export function NotificationRowSkeleton() {
  return (
    <Flex gap={3} px={4} py={3} borderBottom="1px solid" borderColor="border">
      <SkeletonCircle size="40px" flex="none" />
      <Box flex="1">
        <Flex justify="space-between" gap={4}>
          <Skeleton h="14px" w="65%" mt={1} />
          <Skeleton h="10px" w="24px" mt={1} />
        </Flex>
        <Skeleton h="12px" w="45%" mt={2.5} />
      </Box>
    </Flex>
  );
}

export default NotificationRow;
