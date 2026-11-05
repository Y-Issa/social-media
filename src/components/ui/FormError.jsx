import { Box, Text } from "@chakra-ui/react";

// Inline server error under a form: 3px danger bar, plain wording.
function FormError({ children, ...props }) {
  if (!children) return null;
  return (
    <Box role="alert" borderLeft="3px solid" borderColor="danger" pl={3} py={1} {...props}>
      <Text fontSize="14px" lineHeight="20px" color="danger">
        {children}
      </Text>
    </Box>
  );
}

export default FormError;
