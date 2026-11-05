import { Box, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import EventRow, { DayHeader, EventRowSkeleton } from "../components/events/EventRow";
import { groupByDay } from "../components/events/format";
import { useMyEvents } from "../queries/events";
import { errorMessage } from "../axios";

// Upcoming events across every group the viewer belongs to, by day.
function Events() {
  const { data, isLoading, error } = useMyEvents("upcoming");

  let body;
  if (isLoading) {
    body = (
      <Box aria-busy="true" aria-label="Loading events">
        <DayHeader>&nbsp;</DayHeader>
        <EventRowSkeleton />
        <EventRowSkeleton />
        <EventRowSkeleton />
      </Box>
    );
  } else if (error) {
    body = <EmptyState title="Couldn't load events.">{errorMessage(error)}</EmptyState>;
  } else if (data.length === 0) {
    body = (
      <EmptyState
        title="Nothing on the calendar."
        action={
          <Button as={RouterLink} to="/groups" variant="secondary" size="sm">
            Browse groups
          </Button>
        }
      >
        Events from the groups you join show up here.
      </EmptyState>
    );
  } else {
    body = groupByDay(data).map((day) => (
      <Box as="section" key={day.key} aria-label={day.label}>
        <DayHeader>{day.label}</DayHeader>
        {day.events.map((event) => (
          <EventRow key={event.eventId} event={event} />
        ))}
      </Box>
    ));
  }

  return (
    <>
      <PageHeader title="Events" kicker="Your groups" />
      {body}
    </>
  );
}

export default Events;
