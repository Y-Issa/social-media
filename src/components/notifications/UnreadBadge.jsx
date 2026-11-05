import { Box } from "@chakra-ui/react";

export function badgeText(count) {
  return count > 9 ? "9+" : String(count);
}

// Unread marker. "count": small mono pill; "dot": 8px accent dot.
// Both are absolutely positioned or sit in reserved space, so nothing shifts.
function UnreadBadge({ count, variant = "count", ...props }) {
  if (!count) return null;
  if (variant === "dot") {
    return (
      <Box
        aria-hidden
        position="absolute"
        w="8px"
        h="8px"
        borderRadius="full"
        bg="accent"
        boxShadow="0 0 0 2px var(--chakra-colors-bg)"
        {...props}
      />
    );
  }
  return (
    <Box
      as="span"
      aria-hidden
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      minW="18px"
      h="18px"
      px="5px"
      borderRadius="full"
      bg="accent"
      color="on-accent"
      fontFamily="mono"
      fontSize="11px"
      fontWeight={500}
      lineHeight="1"
      {...props}
    >
      {badgeText(count)}
    </Box>
  );
}

export default UnreadBadge;
