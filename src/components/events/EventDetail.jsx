import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SkeletonCircle,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuCalendar, LuMapPin, LuMoreHorizontal, LuPencil, LuTrash2, LuUser, LuUsers } from "react-icons/lu";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { deleteEvent, eventKeys, useEvent, useEventGoing } from "../../queries/events";
import { fetchGroup } from "../../queries/groups";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ConfirmDialog";
import RsvpControl from "./RsvpControl";
import EventFormModal from "./EventFormModal";
import { longDate, timeRange } from "./format";

function MetaLine({ icon: Icon, children }) {
  return (
    <Flex align="flex-start" gap={2.5} fontSize="15px" lineHeight="22px" color="text-secondary">
      <Box as="span" mt="3px" color="text-muted" flex="none">
        <Icon size={16} aria-hidden />
      </Box>
      <Box minW={0} overflowWrap="anywhere">
        {children}
      </Box>
    </Flex>
  );
}

function DetailSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Loading event" px={4} pt={{ base: 5, md: 8 }} pb={4}>
      <Skeleton h="10px" w="90px" />
      <Skeleton h="32px" w="70%" mt={3} />
      <Skeleton h="14px" w="55%" mt={5} />
      <Skeleton h="14px" w="40%" mt={3} />
      <Skeleton h="14px" w="35%" mt={3} />
      <Flex gap={1} mt={6}>
        {[0, 1, 2].map((i) => (
          <SkeletonCircle key={i} size="28px" />
        ))}
      </Flex>
    </Box>
  );
}

// /events/:eventId
function EventDetail() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const edit = useDisclosure();
  const confirm = useDisclosure();

  const { data: event, isLoading, error } = useEvent(eventId);
  const going = useEventGoing(eventId, { enabled: Boolean(event) });
  // The group's owner may manage any of its events.
  const group = useQuery({
    queryKey: ["group", event?.groupId],
    queryFn: () => fetchGroup(event.groupId),
    enabled: Boolean(event?.groupId),
  });

  const remove = useMutation({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: () => {
      // Drop this event's queries instead of refetching them into a 404.
      queryClient.removeQueries(eventKeys.detail(eventId));
      queryClient.removeQueries(eventKeys.going(eventId));
      queryClient.invalidateQueries({
        queryKey: eventKeys.all,
        predicate: (query) => !query.queryKey.includes(eventId),
      });
      toast({ title: "Event deleted.", status: "success" });
      navigate(event?.groupId ? `/groups/${event.groupId}?tab=events` : "/events", { replace: true });
    },
    onError: (err) => toast({ title: "Couldn't delete the event", description: errorMessage(err), status: "error" }),
  });

  if (isLoading) return <DetailSkeleton />;
  if (error) {
    const status = error.response?.status;
    return (
      <EmptyState
        title={status === 404 || status === 400 ? "This event doesn't exist." : status === 403 ? "Members only." : "Couldn't load this event."}
        action={
          <Button as={RouterLink} to="/events" variant="secondary" size="sm">
            All events
          </Button>
        }
      >
        {status === 404 || status === 400
          ? "It may have been cancelled."
          : status === 403
          ? "Join the group to see its events."
          : errorMessage(error)}
      </EmptyState>
    );
  }

  const canManage = event.createdBy?.userId === user.userId || group.data?.createdBy === user.userId;
  const ended = new Date(event.endsAt ?? event.startsAt) < new Date();
  const goingPeople = going.data ?? [];

  return (
    <>
      <Box as="header" px={4} pt={{ base: 5, md: 8 }} pb={4} borderBottom="1px solid" borderColor="border">
        <Flex align="flex-start" gap={3}>
          <Box flex="1" minW={0}>
            <Text textStyle="label">{ended ? "Past event" : "Event"}</Text>
            <Heading
              as="h1"
              variant="display"
              mt={1}
              fontSize={{ base: "28px", md: "40px" }}
              lineHeight={{ base: "32px", md: "44px" }}
              overflowWrap="anywhere"
            >
              {event.title}
            </Heading>
          </Box>
          {canManage && (
            <Menu placement="bottom-end">
              <MenuButton
                as={IconButton}
                variant="ghost"
                size="sm"
                aria-label="Event options"
                icon={<LuMoreHorizontal size={18} />}
                mt={{ base: 0, md: 2 }}
              />
              <MenuList>
                <MenuItem icon={<LuPencil size={16} />} onClick={edit.onOpen}>
                  Edit event
                </MenuItem>
                <MenuItem icon={<LuTrash2 size={16} />} color="danger" onClick={confirm.onOpen}>
                  Delete event
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>

        <Flex direction="column" gap={2} mt={4}>
          <MetaLine icon={LuCalendar}>
            <time dateTime={event.startsAt}>
              {longDate(event.startsAt)}
              <Text as="span" fontFamily="mono" fontSize="13px" color="text-muted" ml={2}>
                {timeRange(event.startsAt, event.endsAt)}
              </Text>
            </time>
          </MetaLine>
          {event.location && <MetaLine icon={LuMapPin}>{event.location}</MetaLine>}
          <MetaLine icon={LuUsers}>
            <Link as={RouterLink} to={`/groups/${event.groupId}?tab=events`} color="text-primary" fontWeight={500}>
              {event.groupName}
            </Link>
          </MetaLine>
          {event.createdBy && (
            <MetaLine icon={LuUser}>
              Hosted by{" "}
              <Link as={RouterLink} to={`/profile/${event.createdBy.userId}`} color="text-primary" fontWeight={500}>
                {event.createdBy.name}
              </Link>
            </MetaLine>
          )}
        </Flex>

        {event.description && (
          <Text mt={4} maxW="560px" fontSize="15px" lineHeight="22px" whiteSpace="pre-wrap" overflowWrap="anywhere">
            {event.description}
          </Text>
        )}
      </Box>

      <Box as="section" aria-label="Attendees" px={4} py={4} borderBottom="1px solid" borderColor="border">
        <Text textStyle="label">Going</Text>
        <Flex mt={2.5} align="center" gap={3} wrap="wrap" minH="28px">
          {goingPeople.length > 0 ? (
            <AvatarGroup size="sm" max={8} spacing="-6px">
              {goingPeople.map((p) => (
                <Avatar
                    key={p.userId}
                    as={RouterLink}
                    to={`/profile/${p.userId}`}
                    name={p.name}
                    src={getImageUrl(p.profileImage)}
                    aria-label={p.name}
                    title={p.name}
                    borderColor="bg"
                  />
              ))}
            </AvatarGroup>
          ) : (
            <Text fontSize="14px" color="text-muted">
              {ended ? "Nobody marked themselves as going." : "No one yet — be the first."}
            </Text>
          )}
          <Text textStyle="meta">
            {event.goingCount} going · {event.interestedCount} interested
          </Text>
        </Flex>
        {!ended && <RsvpControl event={event} size="md" mt={4} />}
      </Box>

      {edit.isOpen && <EventFormModal isOpen onClose={edit.onClose} event={event} />}
      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.onClose}
        onConfirm={() => remove.mutate()}
        isLoading={remove.isLoading}
        title="Delete this event?"
        body="Its RSVPs go with it. This can't be undone."
        confirmLabel="Delete event"
      />
    </>
  );
}

export default EventDetail;
