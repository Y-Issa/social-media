import { Text } from "@chakra-ui/react";

// Remaining characters, shown only within `warnAt` of the limit.
function CharCount({ length, max, warnAt = 200 }) {
  if (length <= max - warnAt) return null;
  const remaining = max - length;
  return (
    <Text
      as="span"
      textStyle="meta"
      color={remaining < 0 ? "danger" : "text-muted"}
      aria-live="polite"
      aria-label={remaining < 0 ? `${-remaining} characters over the limit` : `${remaining} characters left`}
    >
      {remaining}
    </Text>
  );
}

export default CharCount;
