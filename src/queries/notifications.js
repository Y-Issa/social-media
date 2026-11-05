import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useAuth } from "../contexts/AuthContext";

export const notificationKeys = {
  all: ["notifications"],
  list: ["notifications", "list"],
  unread: ["notifications", "unread"],
};

// { items: [{ notificationId, type, createdAt, readAt, actor, post, group, comment }], nextCursor }
export async function fetchNotifications({ cursor, limit = 20 } = {}) {
  const res = await makeRequest.get("/notifications", { params: { limit, cursor } });
  return res.data;
}

export async function fetchUnreadCount() {
  const res = await makeRequest.get("/notifications/unread-count");
  return res.data?.count ?? 0;
}

// ids omitted -> marks everything read.
export async function markNotificationsRead(ids) {
  await makeRequest.post("/notifications/read", ids ? { ids } : {});
}

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: notificationKeys.list,
    queryFn: ({ pageParam }) => fetchNotifications({ cursor: pageParam }),
    getNextPageParam: (last) => last?.nextCursor || undefined,
  });
}

// Polled every 30s (and on focus) while someone is logged in.
export function useUnreadCount() {
  const { user } = useAuth();
  return useQuery({
    queryKey: notificationKeys.unread,
    queryFn: fetchUnreadCount,
    enabled: Boolean(user),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}

function markInList(data, ids) {
  if (!data?.pages) return data;
  const now = new Date().toISOString();
  const match = ids ? new Set(ids) : null;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((n) =>
        !n.readAt && (!match || match.has(n.notificationId)) ? { ...n, readAt: now } : n
      ),
    })),
  };
}

// Optimistically marks rows read, then refreshes the unread count.
export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => markNotificationsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries(notificationKeys.list);
      const previous = queryClient.getQueryData(notificationKeys.list);
      queryClient.setQueryData(notificationKeys.list, (data) => markInList(data, ids));
      if (!ids) queryClient.setQueryData(notificationKeys.unread, 0);
      return { previous };
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(notificationKeys.list, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries(notificationKeys.unread),
  });
}
