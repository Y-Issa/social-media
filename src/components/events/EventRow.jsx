import { Box, Flex, Link, Skeleton, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import RsvpControl from "./RsvpControl";
import { dateBlock, rsvpSummary, timeRange } from "./format";

const Dot = () => (
  <Text as="span" aria-hidden color="text-muted">
    ·
  </Text>
);

function DateBlock({ startsAt, muted }) {
  const { day, month } = dateBlock(startsAt);
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="48px"
      h="48px"
      flex="none"
      border="1px solid"
      borderColor="border"
      borderRadius="sm"
      bg="surface"
      aria-hidden
    >
      <Text fontFamily="mono" fontSize="18px" lineHeight="20px" fontWeight={500} color={muted ? "text-muted" : "text-primary"}>
        {day}
      </Text>
      <Text fontFamily="mono" fontSize="10px" lineHeight="12px" letterSpacing="0.06em" color={muted ? "text-muted" : "accent"}>
        {month}
      </Text>
    </Flex>
  );
}

// One event: date block, title, time · location, group, counts, RSVP.
function EventRow({ event, showGroup = true, past = false }) {
  const meta = [timeRange(event.startsAt, event.endsAt), event.location].filter(Boolean).join(" · ");
  return (
    <Flex
      as="article"
      aria-label={event.title}
      gap={3}
      px={4}
      py={3}
      borderBottom="1px solid"
      borderColor="border"
    >
      <DateBlock startsAt={event.startsAt} muted={past} />
      <Box flex="1" minW={0}>
        <Link
          as={RouterLink}
          to={`/events/${event.eventId}`}
          display="block"
          color="text-primary"
          fontSize="15px"
          lineHeight="20px"
          fontWeight={600}
          overflowWrap="anywhere"
          _hover={{ color: "text-primary", textDecoration: "underline" }}
        >
          {event.title}
        </Link>
        <Text textStyle="meta" mt={1} overflowWrap="anywhere">
          <time dateTime={event.startsAt}>{meta}</time>
        </Text>
        <Flex mt={1} gap={1.5} align="baseline" wrap="wrap" fontSize="13px" lineHeight="18px">
          {showGroup && (
            <>
              <Link as={RouterLink} to={`/groups/${event.groupId}`} color="text-secondary" fontWeight={500}>
                {event.groupName}
              </Link>
              <Dot />
            </>
          )}
          <Text as="span" textStyle="meta">
            {rsvpSummary(event)}
          </Text>
        </Flex>
        {!past && <RsvpControl event={event} mt={2.5} />}
      </Box>
    </Flex>
  );
}

export function EventRowSkeleton() {
  return (
    <Flex gap={3} px={4} py={3} borderBottom="1px solid" borderColor="border">
      <Skeleton w="48px" h="48px" flex="none" />
      <Box flex="1">
        <Skeleton h="14px" w="60%" mt={1} />
        <Skeleton h="10px" w="40%" mt={2.5} />
        <Skeleton h="10px" w="30%" mt={2.5} />
        <Skeleton h="30px" w="190px" mt={3} />
      </Box>
    </Flex>
  );
}

export function DayHeader({ children }) {
  return (
    <Text
      as="h2"
      textStyle="label"
      px={4}
      pt={4}
      pb={2}
      borderBottom="1px solid"
      borderColor="border"
      bg="bg"
    >
      {children}
    </Text>
  );
}

export default EventRow;
