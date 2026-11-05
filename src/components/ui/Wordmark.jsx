import { Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

// "communet" in Instrument Serif italic, lowercase.
function Wordmark({ size = "28px", asLink = true, children, ...props }) {
  const text = (
    <Text
      as="span"
      fontFamily="display"
      fontStyle="italic"
      fontSize={size}
      lineHeight="1"
      letterSpacing="-0.01em"
      color="text-primary"
      {...props}
    >
      {children ?? "communet"}
    </Text>
  );
  if (!asLink) return text;
  return (
    <RouterLink to="/" aria-label="Communet home">
      {text}
    </RouterLink>
  );
}

export default Wordmark;
