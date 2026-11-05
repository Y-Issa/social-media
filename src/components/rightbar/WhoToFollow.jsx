import { Box, Flex, Text } from "@chakra-ui/react";
import SoonTag from "../ui/SoonTag";

// No suggestions endpoint yet — a quiet placeholder instead of fake people.
function WhoToFollow() {
  return (
    <Box as="section" aria-labelledby="who-to-follow" border="1px solid" borderColor="border" borderRadius="md" bg="surface">
      <Flex align="center" justify="space-between" px={4} pt={3} pb={2}>
        <Text id="who-to-follow" fontSize="15px" fontWeight={600}>
          Who to follow
        </Text>
        <SoonTag />
      </Flex>
      <Text px={4} pb={4} fontSize="13px" lineHeight="18px" color="text-muted">
        Suggestions will show up here once there's enough activity to make them
        worth reading.
      </Text>
    </Box>
  );
}

export default WhoToFollow;
