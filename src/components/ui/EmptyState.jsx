import { Box, Text } from "@chakra-ui/react";

// Left-aligned serif headline, one muted sentence, optional single action.
function EmptyState({ title, children, action, ...props }) {
  return (
    <Box px={4} py={10} {...props}>
      <Text textStyle="display" color="text-primary">
        {title}
      </Text>
      {children && (
        <Text mt={2} color="text-muted" maxW="420px">
          {children}
        </Text>
      )}
      {action && <Box mt={5}>{action}</Box>}
    </Box>
  );
}

export default EmptyState;
