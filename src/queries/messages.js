import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useAuth } from "../contexts/AuthContext";

export const MESSAGE_MAX_LENGTH = 2000;
export const THREAD_PAGE_SIZE = 30;
const THREAD_POLL_MS = 4000;
const INBOX_POLL_MS = 15000;

export const messageKeys = {
  all: ["messages"],
  conversations: ["messages", "conversations"],
  unread: ["messages", "unread"],
  thread: (conversationId) => ["messages", "thread", conversationId],
};

// ---- API ----

// [{ conversationId, other: { userId, name, profileImage },
//    lastMessage: { body, senderId, createdAt } | null, unreadCount, lastMessageAt }]
export async function fetchConversations() {
  const res = await makeRequest.get("/messages/conversations");
  return res.data;
}

export async function fetchMessagesUnreadCount() {
  const res = await makeRequest.get("/messages/unread-count");
  return res.data?.count ?? 0;
}

// -> { conversationId }
export async function startConversation(userId) {
  const res = await makeRequest.post("/messages/conversations", { userId });
  return res.data;
}

// { before } / { after } are messageIds. -> { items (oldest -> newest), hasMore }
export async function fetchMessages(conversationId, { before, after, limit = THREAD_PAGE_SIZE } = {}) {
  const res = await makeRequest.get(`/messages/conversations/${conversationId}/messages`, {
    params: { before, after, limit },
  });
  return res.data;
}

export async function sendMessage(conversationId, body) {
  const res = await makeRequest.post(`/messages/conversations/${conversationId}/messages`, { body });
  return res.data;
}

export async function markConversationRead(conversationId) {
  await makeRequest.post(`/messages/conversations/${conversationId}/read`);
}

// ---- Cache helpers ----

// Appends messages to a thread, skipping ones already there, keeping order.
export function mergeMessages(items, incoming) {
  if (!incoming.length) return items;
  const seen = new Set(items.map((m) => m.messageId));
  const fresh = incoming.filter((m) => !seen.has(m.messageId));
  if (!fresh.length) return items;
  return [...items, ...fresh].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
}

function updateConversation(queryClient, conversationId, update) {
  queryClient.setQueryData(messageKeys.conversations, (list) =>
    Array.isArray(list)
      ? list.map((c) => (c.conversationId === conversationId ? update(c) : c))
      : list
  );
}

// ---- Hooks ----

// Inbox, polled every 15s while the tab is visible.
export function useConversations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: messageKeys.conversations,
    queryFn: fetchConversations,
    enabled: Boolean(user),
    refetchInterval: INBOX_POLL_MS,
    refetchIntervalInBackground: false,
  });
}

// Conversations with unread messages, for the rail badge.
export function useMessagesUnreadCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: messageKeys.unread,
    queryFn: fetchMessagesUnreadCount,
    enabled: Boolean(user),
    refetchInterval: INBOX_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => startConversation(userId),
    onSuccess: () => queryClient.invalidateQueries(messageKeys.conversations),
  });
}

// The open thread: the latest page first, then "load earlier" prepends and
// a 4s poll (?after=) appends. Polling pauses while the tab is hidden.
export function useThread(conversationId) {
  const queryClient = useQueryClient();
  const key = messageKeys.thread(conversationId);

  const query = useQuery({
    queryKey: key,
    queryFn: () => fetchMessages(conversationId),
    enabled: Boolean(conversationId),
    // The cache is kept current by polling; a refetch would drop older pages.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: (count, error) => ![400, 403, 404].includes(error?.response?.status) && count < 2,
  });

  const hasData = Boolean(query.data);

  useQuery({
    queryKey: [...key, "poll"],
    queryFn: async () => {
      const current = queryClient.getQueryData(key);
      const after = current?.items.at(-1)?.messageId;
      const page = after
        ? await fetchMessages(conversationId, { after, limit: 100 })
        : await fetchMessages(conversationId);
      queryClient.setQueryData(key, (data) =>
        data ? { ...data, items: mergeMessages(data.items, page.items) } : page
      );
      return page.items.length;
    },
    enabled: Boolean(conversationId) && hasData,
    refetchInterval: THREAD_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    staleTime: THREAD_POLL_MS - 500,
  });

  const loadEarlier = useMutation({
    mutationFn: async () => {
      const current = queryClient.getQueryData(key);
      const before = current?.items[0]?.messageId;
      if (!before) return null;
      return fetchMessages(conversationId, { before });
    },
    onSuccess: (page) => {
      if (!page) return;
      queryClient.setQueryData(key, (data) => {
        if (!data) return data;
        const seen = new Set(data.items.map((m) => m.messageId));
        return {
          items: [...page.items.filter((m) => !seen.has(m.messageId)), ...data.items],
          hasMore: page.hasMore,
        };
      });
    },
  });

  return { ...query, loadEarlier };
}

// Sends a message and appends the server copy to the thread cache. The
// optimistic bubble lives in the composer's caller (see Thread.jsx).
export function useSendMessage(conversationId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => sendMessage(conversationId, body),
    onSuccess: (message) => {
      queryClient.setQueryData(messageKeys.thread(conversationId), (data) =>
        data ? { ...data, items: mergeMessages(data.items, [message]) } : data
      );
      updateConversation(queryClient, conversationId, (c) => ({
        ...c,
        lastMessage: {
          body: message.body.slice(0, 120),
          senderId: message.senderId,
          createdAt: message.createdAt,
        },
        lastMessageAt: message.createdAt,
      }));
      queryClient.invalidateQueries(messageKeys.conversations);
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) => markConversationRead(conversationId),
    onMutate: (conversationId) => {
      updateConversation(queryClient, conversationId, (c) => ({ ...c, unreadCount: 0 }));
    },
    onSettled: () => queryClient.invalidateQueries(messageKeys.unread),
  });
}
