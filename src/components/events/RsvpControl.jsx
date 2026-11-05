import { Box, useToast } from "@chakra-ui/react";
import { LuCheck, LuStar } from "react-icons/lu";
import { useRsvp } from "../../queries/events";
import { errorMessage } from "../../axios";

const OPTIONS = [
  { status: "going", label: "Going", icon: LuCheck },
  { status: "interested", label: "Interested", icon: LuStar },
];

// Going / Interested segmented control. Choosing the active option again
// clears the RSVP. Updates optimistically (see useRsvp).
function RsvpControl({ event, size = "sm", ...props }) {
  const toast = useToast();
  const rsvp = useRsvp();

  function choose(status) {
    const next = event.myRsvp === status ? null : status;
    rsvp.mutate(
      { eventId: event.eventId, status: next },
      {
        onError: (error) =>
          toast({ title: "Couldn't update your RSVP", description: errorMessage(error), status: "error" }),
      }
    );
  }

  const h = size === "md" ? "36px" : "30px";

  return (
    <Box
      role="group"
      aria-label={`RSVP to ${event.title}`}
      display="inline-flex"
      border="1px solid"
      borderColor="border-strong"
      borderRadius="sm"
      overflow="hidden"
      flex="none"
      {...props}
    >
      {OPTIONS.map(({ status, label, icon: Icon }, i) => {
        const active = event.myRsvp === status;
        return (
          <Box
            as="button"
            key={status}
            type="button"
            display="inline-flex"
            alignItems="center"
            gap={1.5}
            h={h}
            minW={0}
            px={size === "md" ? 4 : 3}
            borderRadius={0}
            borderLeft={i > 0 ? "1px solid" : undefined}
            borderColor="border-strong"
            fontSize="13px"
            fontWeight={600}
            bg={active ? "accent-subtle" : "transparent"}
            color={active ? "accent" : "text-secondary"}
            aria-pressed={active}
            transition="background 120ms, color 120ms"
            _hover={{ bg: active ? "accent-subtle" : "surface-raised", color: active ? "accent" : "text-primary" }}
            _focusVisible={{ boxShadow: "inset 0 0 0 2px var(--chakra-colors-accent)", outline: "none" }}
            onClick={() => choose(status)}
          >
            <Icon size={14} aria-hidden />
            {label}
          </Box>
        );
      })}
    </Box>
  );
}

export default RsvpControl;
