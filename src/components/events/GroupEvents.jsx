import { Box, Button, Collapse, Flex, Link, Text, useDisclosure } from "@chakra-ui/react";
import { LuChevronDown, LuChevronRight, LuPlus } from "react-icons/lu";
import { Link as RouterLink } from "react-router-dom";
import { useGroupEvents } from "../../queries/events";
import { errorMessage } from "../../axios";
import EmptyState from "../ui/EmptyState";
import EventRow, { EventRowSkeleton } from "./EventRow";
import EventFormModal from "./EventFormModal";

// A group's Events tab (members only): upcoming list, "New event", and past
// events collapsed under "Past".
function GroupEvents({ groupId, groupName }) {
  const form = useDisclosure();
  const past = useDisclosure();
  const upcoming = useGroupEvents(groupId, "upcoming");
  const pastQuery = useGroupEvents(groupId, "past");

  return (
    <Box>
      <Flex
        align="center"
        justify="space-between"
        gap={3}
        px={4}
        py={3}
        borderBottom="1px solid"
        borderColor="border"
      >
        <Text textStyle="label">Upcoming</Text>
        <Flex align="center" gap={3}>
          <Link as={RouterLink} to="/events" fontSize="13px" fontWeight={500}>
            All your events
          </Link>
          <Button variant="secondary" size="sm" leftIcon={<LuPlus size={16} />} onClick={form.onOpen}>
            New event
          </Button>
        </Flex>
      </Flex>

      {upcoming.isLoading ? (
        <>
          <EventRowSkeleton />
          <EventRowSkeleton />
        </>
      ) : upcoming.error ? (
        <EmptyState title="Couldn't load events.">{errorMessage(upcoming.error)}</EmptyState>
      ) : upcoming.data.length === 0 ? (
        <EmptyState title="Nothing scheduled." borderBottom="1px solid" borderColor="border">
          Plan a meetup, a walk or a call — everyone in {groupName} will be notified.
        </EmptyState>
      ) : (
        upcoming.data.map((event) => <EventRow key={event.eventId} event={event} showGroup={false} />)
      )}

      {pastQuery.data?.length > 0 && (
        <Box>
          <Flex
            as="button"
            type="button"
            onClick={past.onToggle}
            aria-expanded={past.isOpen}
            w="full"
            align="center"
            gap={1.5}
            px={4}
            py={3}
            borderBottom="1px solid"
            borderColor="border"
            color="text-muted"
            _hover={{ color: "text-primary", bg: "surface-raised" }}
            _focusVisible={{ boxShadow: "inset 0 0 0 2px var(--chakra-colors-accent)", outline: "none" }}
          >
            {past.isOpen ? <LuChevronDown size={14} aria-hidden /> : <LuChevronRight size={14} aria-hidden />}
            <Text as="span" textStyle="label" color="inherit">
              Past · {pastQuery.data.length}
            </Text>
          </Flex>
          <Collapse in={past.isOpen} animateOpacity>
            {pastQuery.data.map((event) => (
              <EventRow key={event.eventId} event={event} showGroup={false} past />
            ))}
          </Collapse>
        </Box>
      )}

      {form.isOpen && <EventFormModal isOpen onClose={form.onClose} groupId={groupId} />}
    </Box>
  );
}

export default GroupEvents;
