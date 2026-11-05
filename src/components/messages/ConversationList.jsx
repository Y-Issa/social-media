import { Avatar, Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";
import { fullTime, isoTime, shortTime } from "../posts/time";
import EmptyState from "../ui/EmptyState";

function ConversationRow({ conversation: c, currentUserId }) {
  const unread = c.unreadCount > 0;
  const last = c.lastMessage;
  const preview = last
    ? `${last.senderId === currentUserId ? "You: " : ""}${last.body.replace(/\s+/g, " ")}`
    : "No messages yet";
  const time = last?.createdAt || c.lastMessageAt;
  const label = `${c.other.name}${unread ? `, ${c.unreadCount} unread` : ""}`;

  return (
    <Box as="li" listStyleType="none">
      <Flex
        as={NavLink}
        to={`/messages/${c.conversationId}`}
        aria-label={label}
        gap={3}
        px={4}
        py={3}
        position="relative"
        borderBottom="1px solid"
        borderColor="border"
        transition="background 120ms"
        _hover={{ bg: "surface-raised" }}
        _focusVisible={{ boxShadow: "inset 0 0 0 2px var(--chakra-colors-accent)", outline: "none" }}
        sx={{
          "&.active": { bg: "surface-raised" },
          "&.active::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            w: "2px",
            bg: "accent",
          },
        }}
      >
        <Avatar size="md" flex="none" name={c.other.name} src={getImageUrl(c.other.profileImage)} />
        <Box flex="1" minW={0}>
          <Flex align="baseline" gap={2}>
            <Text
              flex="1"
              minW={0}
              noOfLines={1}
              fontSize="15px"
              lineHeight="20px"
              fontWeight={unread ? 700 : 600}
              color="text-primary"
            >
              {c.other.name}
            </Text>
            {time && (
              <Text
                as="time"
                dateTime={isoTime(time)}
                title={fullTime(time)}
                textStyle="meta"
                flex="none"
                color={unread ? "accent" : "text-muted"}
              >
                {shortTime(time)}
              </Text>
            )}
          </Flex>
          <Flex align="center" gap={2} mt={0.5}>
            <Text
              flex="1"
              minW={0}
              noOfLines={1}
              fontSize="14px"
              lineHeight="20px"
              color={unread ? "text-primary" : "text-muted"}
              fontWeight={unread ? 600 : 400}
              fontStyle={last ? "normal" : "italic"}
            >
              {preview}
            </Text>
            {unread && (
              <Box aria-hidden flex="none" w="8px" h="8px" borderRadius="full" bg="accent" />
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export function ConversationRowSkeleton() {
  return (
    <Flex gap={3} px={4} py={3} borderBottom="1px solid" borderColor="border">
      <SkeletonCircle size="40px" flex="none" />
      <Box flex="1" pt={1}>
        <Skeleton h="12px" w="45%" mb={2.5} />
        <Skeleton h="10px" w="80%" />
      </Box>
    </Flex>
  );
}

function ConversationList({ query, currentUserId }) {
  if (query.isLoading) {
    return (
      <Box aria-busy="true" aria-label="Loading conversations">
        {Array.from({ length: 5 }, (_, i) => (
          <ConversationRowSkeleton key={i} />
        ))}
      </Box>
    );
  }
  if (query.isError) {
    return <EmptyState title="Couldn't load messages.">{errorMessage(query.error)}</EmptyState>;
  }
  if (!query.data?.length) {
    return (
      <EmptyState title="No conversations yet.">
        Open someone's profile and choose Message to start one.
      </EmptyState>
    );
  }
  return (
    <Box as="ul" m={0} p={0} aria-label="Conversations">
      {query.data.map((c) => (
        <ConversationRow key={c.conversationId} conversation={c} currentUserId={currentUserId} />
      ))}
    </Box>
  );
}

export default ConversationList;
