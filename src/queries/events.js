import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";

// Event row: { eventId, groupId, groupName, title, description, location,
// startsAt, endsAt, createdBy: {userId,name,profileImage}|null,
// goingCount, interestedCount, myRsvp: 'going'|'interested'|null }
export const eventKeys = {
  all: ["events"],
  mine: (scope = "upcoming") => ["events", "mine", scope],
  group: (groupId, scope = "upcoming") => ["events", "group", groupId, scope],
  groupAll: (groupId) => ["events", "group", groupId],
  detail: (eventId) => ["events", "detail", eventId],
  going: (eventId) => ["events", "going", eventId],
};

export async function fetchMyEvents(scope = "upcoming") {
  const res = await makeRequest.get("/events", { params: { scope } });
  return res.data;
}

export async function fetchGroupEvents(groupId, scope = "upcoming") {
  const res = await makeRequest.get(`/groups/${groupId}/events`, { params: { scope } });
  return res.data;
}

export async function fetchEvent(eventId) {
  const res = await makeRequest.get(`/events/${eventId}`);
  return res.data;
}

export async function fetchEventGoing(eventId) {
  const res = await makeRequest.get(`/events/${eventId}/going`);
  return res.data;
}

export async function createEvent({ groupId, event }) {
  const res = await makeRequest.post(`/groups/${groupId}/events`, event);
  return res.data;
}

export async function updateEvent({ eventId, event }) {
  const res = await makeRequest.patch(`/events/${eventId}`, event);
  return res.data;
}

export async function deleteEvent(eventId) {
  await makeRequest.delete(`/events/${eventId}`);
}

// status null clears the RSVP.
export async function setRsvp({ eventId, status }) {
  const res = status
    ? await makeRequest.put(`/events/${eventId}/rsvp`, { status })
    : await makeRequest.delete(`/events/${eventId}/rsvp`);
  return res.data;
}

export function useMyEvents(scope = "upcoming") {
  return useQuery({ queryKey: eventKeys.mine(scope), queryFn: () => fetchMyEvents(scope) });
}

export function useGroupEvents(groupId, scope = "upcoming", options = {}) {
  return useQuery({
    queryKey: eventKeys.group(groupId, scope),
    queryFn: () => fetchGroupEvents(groupId, scope),
    ...options,
  });
}

export function useEvent(eventId) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => fetchEvent(eventId),
    retry: (count, error) => ![403, 404, 400].includes(error?.response?.status) && count < 2,
  });
}

export function useEventGoing(eventId, options = {}) {
  return useQuery({
    queryKey: eventKeys.going(eventId),
    queryFn: () => fetchEventGoing(eventId),
    ...options,
  });
}

// The event as it looks after the viewer switches to `status`.
export function withRsvp(event, status) {
  const next = { ...event, myRsvp: status };
  const delta = (s) => (status === s ? 1 : 0) - (event.myRsvp === s ? 1 : 0);
  next.goingCount = Math.max(0, event.goingCount + delta("going"));
  next.interestedCount = Math.max(0, event.interestedCount + delta("interested"));
  return next;
}

// Replaces one event wherever it's cached (lists and detail).
function patchCachedEvent(queryClient, eventId, update) {
  queryClient.setQueriesData(eventKeys.all, (data) => {
    if (Array.isArray(data)) {
      return data.map((e) => (e?.eventId === eventId ? update(e) : e));
    }
    if (data?.eventId === eventId) return update(data);
    return data;
  });
}

// Optimistic RSVP: counts and myRsvp flip immediately, roll back on error.
export function useRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setRsvp,
    onMutate: async ({ eventId, status }) => {
      await queryClient.cancelQueries(eventKeys.all);
      const snapshot = queryClient.getQueriesData(eventKeys.all);
      patchCachedEvent(queryClient, eventId, (e) => withRsvp(e, status));
      return { snapshot };
    },
    onError: (_error, _vars, context) => {
      context?.snapshot?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: (event) => {
      if (event?.eventId) patchCachedEvent(queryClient, event.eventId, () => event);
    },
    onSettled: (_data, _error, { eventId }) => {
      queryClient.invalidateQueries(eventKeys.going(eventId));
    },
  });
}
