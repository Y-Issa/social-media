import { Box, Flex, Heading, useBreakpointValue } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useConversations } from "../queries/messages";
import ConversationList from "../components/messages/ConversationList";
import Thread from "../components/messages/Thread";
import EmptyState from "../components/ui/EmptyState";

// The page fills the viewport so the thread scrolls inside its own pane:
// below md the shell has a 52px top bar and reserves 72px for the tab bar.
const paneHeight = {
  base: "calc(100dvh - 52px - 72px - env(safe-area-inset-bottom))",
  md: "100dvh",
};

function ListHeader() {
  return (
    <Flex
      as="header"
      align="center"
      h="72px"
      px={4}
      flex="none"
      borderBottom="1px solid"
      borderColor="border"
    >
      <Heading as="h1" variant="display" fontSize="28px" lineHeight="32px">
        Messages
      </Heading>
    </Flex>
  );
}

// Desktop: conversation list (280px) | thread. Mobile: /messages is the
// list, /messages/:conversationId is the thread with a back button.
function Messages() {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const isDesktop = useBreakpointValue({ base: false, md: true }, { ssr: false });
  const conversations = useConversations();
  const conversation = conversations.data?.find((c) => c.conversationId === conversationId);

  const showList = isDesktop || !conversationId;
  const showThread = isDesktop || Boolean(conversationId);

  return (
    <Flex h={paneHeight} minH="360px" overflow="hidden">
      {showList && (
        <Flex
          direction="column"
          w={{ base: "full", md: "280px" }}
          flex="none"
          borderRight={{ md: "1px solid" }}
          borderColor={{ md: "border" }}
          minH={0}
        >
          <ListHeader />
          <Box flex="1" minH={0} overflowY="auto">
            <ConversationList query={conversations} currentUserId={user.userId} />
          </Box>
        </Flex>
      )}

      {showThread &&
        (conversationId ? (
          <Thread
            key={conversationId}
            conversationId={conversationId}
            conversation={conversation}
            showBack={!isDesktop}
          />
        ) : (
          <Flex direction="column" flex="1" minW={0} bg="bg">
            <Box h="72px" flex="none" borderBottom="1px solid" borderColor="border" bg="surface" />
            <EmptyState title="Pick a conversation.">
              Choose one on the left, or start a new one from someone's profile.
            </EmptyState>
          </Flex>
        ))}
    </Flex>
  );
}

export default Messages;
