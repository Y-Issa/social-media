import { Box, Button, Text } from "@chakra-ui/react";
import { LuCheckCheck } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { errorMessage } from "../axios";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useMarkRead, useNotifications, useUnreadCount } from "../queries/notifications";
import NotificationRow, {
  NotificationRowSkeleton,
  notificationHref,
} from "../components/notifications/NotificationRow";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

// Opening the page doesn't mark anything read; clicking a row or
// "Mark all read" does.
function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const list = useNotifications();
  const { data: unread = 0 } = useUnreadCount();
  const markRead = useMarkRead();

  const items = list.data?.pages.flatMap((page) => page.items) ?? [];
  const hasUnread = unread > 0 || items.some((n) => !n.readAt);

  const sentinel = useInfiniteScroll({
    hasMore: Boolean(list.hasNextPage),
    isLoading: list.isFetchingNextPage,
    onLoadMore: () => list.fetchNextPage(),
  });

  const open = (n) => {
    if (!n.readAt) markRead.mutate([n.notificationId]);
    navigate(notificationHref(n, user.userId));
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        action={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LuCheckCheck size={16} />}
            isDisabled={!hasUnread}
            onClick={() => markRead.mutate(undefined)}
          >
            Mark all read
          </Button>
        }
      />

      {list.isLoading ? (
        <Box aria-busy="true" aria-label="Loading notifications">
          {Array.from({ length: 6 }, (_, i) => (
            <NotificationRowSkeleton key={i} />
          ))}
        </Box>
      ) : list.isError ? (
        <EmptyState title="Couldn't load notifications.">{errorMessage(list.error)}</EmptyState>
      ) : items.length === 0 ? (
        <EmptyState title="Nothing new.">
          Likes, comments, new followers and group joins will show up here.
        </EmptyState>
      ) : (
        <Box as="ul" m={0} p={0}>
          {items.map((n) => (
            <NotificationRow key={n.notificationId} notification={n} onOpen={open} />
          ))}
        </Box>
      )}

      {list.isFetchingNextPage && (
        <>
          <NotificationRowSkeleton />
          <NotificationRowSkeleton />
        </>
      )}
      <div ref={sentinel} />
      {!list.isLoading && !list.hasNextPage && items.length > 12 && (
        <Text textStyle="meta" px={4} py={6}>
          That's everything.
        </Text>
      )}
    </>
  );
}

export default Notifications;
