import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import { LuArrowLeft, LuRotateCw } from "react-icons/lu";
import { Link as RouterLink } from "react-router-dom";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";
import { useAuth } from "../../contexts/AuthContext";
import { useMarkConversationRead, useSendMessage, useThread } from "../../queries/messages";
import { fullTime } from "../posts/time";
import EmptyState from "../ui/EmptyState";
import { toHandle } from "../ui/format";
import MessageComposer from "./MessageComposer";
import { clockTime, dayLabel, layoutMessages } from "./format";

// Within this many px of the bottom counts as "at the bottom" for auto-scroll.
const STICK_PX = 80;

function ThreadHeader({ other, showBack }) {
  return (
    <Flex
      as="header"
      align="center"
      gap={3}
      px={{ base: 2, md: 4 }}
      h="72px"
      flex="none"
      borderBottom="1px solid"
      borderColor="border"
      bg="surface"
    >
      {showBack && (
        <IconButton
          as={RouterLink}
          to="/messages"
          variant="ghost"
          aria-label="Back to conversations"
          icon={<LuArrowLeft size={20} />}
          w="40px"
          h="40px"
        />
      )}
      {other ? (
        <Link
          as={RouterLink}
          to={`/profile/${other.userId}`}
          display="flex"
          alignItems="center"
          gap={3}
          minW={0}
          color="text-primary"
          _hover={{ textDecoration: "none", "& .name": { textDecoration: "underline" } }}
        >
          <Avatar size="md" flex="none" name={other.name} src={getImageUrl(other.profileImage)} />
          <Box minW={0}>
            <Text className="name" fontSize="15px" lineHeight="20px" fontWeight={600} noOfLines={1}>
              {other.name}
            </Text>
            <Text textStyle="meta" noOfLines={1}>
              {toHandle(other)}
            </Text>
          </Box>
        </Link>
      ) : (
        <Flex align="center" gap={3}>
          <SkeletonCircle size="40px" />
          <Box>
            <Skeleton h="12px" w="120px" mb={2} />
            <Skeleton h="10px" w="80px" />
          </Box>
        </Flex>
      )}
    </Flex>
  );
}

function MessageBubble({ message: m, mine, onRetry }) {
  const time = clockTime(m.createdAt);
  const failed = m.status === "failed";
  const sending = m.status === "sending";

  return (
    <Flex
      role="group"
      direction="column"
      align={mine ? "flex-end" : "flex-start"}
      mt={m.groupStart ? 3 : "2px"}
    >
      <Flex align="center" gap={2} direction={mine ? "row-reverse" : "row"} w="full">
        <Box
          maxW={{ base: "85%", md: "75%" }}
          px={3}
          py={2}
          borderRadius="6px"
          bg={mine ? "accent-subtle" : "surface-raised"}
          color="text-primary"
          fontSize="15px"
          lineHeight="21px"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          opacity={sending ? 0.6 : 1}
          boxShadow={failed ? "inset 0 0 0 1px var(--chakra-colors-danger)" : undefined}
          title={fullTime(m.createdAt)}
          transition="opacity 120ms"
        >
          {m.body}
        </Box>
        {!m.groupEnd && (
          <Text
            as="time"
            textStyle="meta"
            flex="none"
            opacity={0}
            transition="opacity 120ms"
            _groupHover={{ opacity: 1 }}
            aria-hidden
          >
            {time}
          </Text>
        )}
      </Flex>
      {m.groupEnd && !failed && (
        <Text as="time" textStyle="meta" mt={1} px={1}>
          {sending ? "Sending" : time}
        </Text>
      )}
      {failed && (
        <Flex align="center" gap={2} mt={1} px={1}>
          <Text textStyle="meta" color="danger">
            Not sent.
          </Text>
          <Button
            variant="ghost"
            size="xs"
            h="20px"
            px={1}
            fontFamily="mono"
            fontSize="12px"
            leftIcon={<LuRotateCw size={12} />}
            onClick={() => onRetry(m)}
          >
            Retry
          </Button>
        </Flex>
      )}
    </Flex>
  );
}

function ThreadSkeleton() {
  return (
    <Box px={4} py={4} aria-busy="true" aria-label="Loading messages">
      {[60, 40, 70, 35, 55].map((w, i) => (
        <Flex key={i} justify={i % 2 ? "flex-end" : "flex-start"} mt={3}>
          <Skeleton h="36px" w={`${w}%`} borderRadius="6px" />
        </Flex>
      ))}
    </Box>
  );
}

let tempCounter = 0;

function Thread({ conversationId, conversation, showBack }) {
  const { user } = useAuth();
  const thread = useThread(conversationId);
  const send = useSendMessage(conversationId);
  const { mutate: markRead } = useMarkConversationRead();
  const [pending, setPending] = useState([]);
  const scrollerRef = useRef(null);
  const atBottomRef = useRef(true);
  const prependRef = useRef(null);
  const initialScrollRef = useRef(false);
  const lastMarkedRef = useRef(null);
  const other = conversation?.other;

  const serverItems = useMemo(() => thread.data?.items ?? [], [thread.data]);
  const items = useMemo(
    () => layoutMessages([...serverItems, ...pending]),
    [serverItems, pending]
  );
  const firstId = serverItems[0]?.messageId;
  const lastKey = items.at(-1)?.messageId ?? items.at(-1)?.tempId;

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < STICK_PX;
  };

  // Keep the reading position when older messages are prepended.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    const saved = prependRef.current;
    if (!el || !saved) return;
    el.scrollTop = el.scrollHeight - saved.height + saved.top;
    prependRef.current = null;
  }, [firstId]);

  // Scroll to the bottom on open, and on new messages unless the reader has
  // scrolled up (their own sends always scroll).
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el || !lastKey) return;
    const last = items.at(-1);
    const mine = last?.senderId === user.userId;
    if (!initialScrollRef.current || atBottomRef.current || (mine && last?.status)) {
      el.scrollTop = el.scrollHeight;
      atBottomRef.current = true;
      initialScrollRef.current = true;
    }
    // items only matters through lastKey here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastKey, user.userId]);

  // Mark read when the thread is open and visible and someone else's message
  // is the newest one we haven't marked yet.
  const lastIncoming = useMemo(
    () => [...serverItems].reverse().find((m) => m.senderId !== user.userId)?.messageId,
    [serverItems, user.userId]
  );
  const markIfNeeded = useCallback(() => {
    if (document.hidden || !thread.data) return;
    const unread = conversation?.unreadCount > 0;
    if (lastIncoming && lastMarkedRef.current === lastIncoming && !unread) return;
    if (!lastIncoming && !unread) return;
    lastMarkedRef.current = lastIncoming;
    markRead(conversationId);
  }, [conversation?.unreadCount, conversationId, lastIncoming, markRead, thread.data]);

  useEffect(() => {
    markIfNeeded();
    document.addEventListener("visibilitychange", markIfNeeded);
    return () => document.removeEventListener("visibilitychange", markIfNeeded);
  }, [markIfNeeded]);

  // mutateAsync: per-call mutate() callbacks only fire for the latest call,
  // and several messages can be in flight at once.
  const deliver = (tempId, body) => {
    send
      .mutateAsync(body)
      .then(() => setPending((list) => list.filter((p) => p.tempId !== tempId)))
      .catch(() =>
        setPending((list) =>
          list.map((p) => (p.tempId === tempId ? { ...p, status: "failed" } : p))
        )
      );
  };

  const onSend = (body) => {
    tempCounter += 1;
    const tempId = `temp-${tempCounter}`;
    setPending((list) => [
      ...list,
      { tempId, body, senderId: user.userId, createdAt: new Date().toISOString(), status: "sending" },
    ]);
    atBottomRef.current = true;
    deliver(tempId, body);
  };

  const onRetry = (m) => {
    setPending((list) =>
      list.map((p) => (p.tempId === m.tempId ? { ...p, status: "sending" } : p))
    );
    deliver(m.tempId, m.body);
  };

  const loadEarlier = () => {
    const el = scrollerRef.current;
    if (el) prependRef.current = { height: el.scrollHeight, top: el.scrollTop };
    thread.loadEarlier.mutate();
  };

  const status = thread.error?.response?.status;

  return (
    <Flex direction="column" h="full" minH={0} minW={0} flex="1">
      <ThreadHeader other={other} showBack={showBack} />

      <Box
        ref={scrollerRef}
        onScroll={onScroll}
        flex="1"
        minH={0}
        overflowY="auto"
        bg="bg"
        px={{ base: 3, md: 4 }}
        pb={4}
        role="log"
        aria-live="polite"
        aria-label={other ? `Conversation with ${other.name}` : "Conversation"}
      >
        {thread.isLoading ? (
          <ThreadSkeleton />
        ) : thread.isError ? (
          <EmptyState
            px={1}
            title={status === 404 || status === 403 ? "Conversation not found." : "Couldn't load messages."}
          >
            {status === 404 || status === 403
              ? "It may have been removed, or it isn't yours."
              : errorMessage(thread.error)}
          </EmptyState>
        ) : items.length === 0 ? (
          <EmptyState px={1} title="Say hello.">
            {other ? `This is the start of your conversation with ${other.name}.` : "This is the start of your conversation."}
          </EmptyState>
        ) : (
          <>
            {thread.data?.hasMore && (
              <Flex justify="center" pt={4}>
                <Button
                  variant="ghost"
                  size="sm"
                  fontFamily="mono"
                  fontSize="12px"
                  onClick={loadEarlier}
                  isLoading={thread.loadEarlier.isLoading}
                >
                  Load earlier
                </Button>
              </Flex>
            )}
            {items.map((m) => (
              <Fragment key={m.messageId ?? m.tempId}>
                {m.newDay && (
                  <Text textStyle="label" textAlign="center" pt={6} pb={1}>
                    {dayLabel(m.createdAt)}
                  </Text>
                )}
                <MessageBubble message={m} mine={m.senderId === user.userId} onRetry={onRetry} />
              </Fragment>
            ))}
          </>
        )}
      </Box>

      {!thread.isError && (
        <MessageComposer
          key={conversationId}
          onSend={onSend}
          recipientName={other?.name}
          autoFocus={!showBack}
        />
      )}
    </Flex>
  );
}

export default Thread;
