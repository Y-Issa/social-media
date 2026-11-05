import { Box, Flex, Text } from "@chakra-ui/react";
import Wordmark from "./Wordmark";

// Split screen: big serif wordmark on the paper side, form column on surface.
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <Flex minH="100vh" bg="bg" color="text-primary">
      <Flex
        display={{ base: "none", lg: "flex" }}
        flex="0 0 55%"
        direction="column"
        justify="space-between"
        px={{ lg: 12, xl: 16 }}
        py={12}
      >
        <Text textStyle="label">Communet</Text>
        <Box>
          <Wordmark
            asLink={false}
            size="clamp(96px, 11vw, 168px)"
            lineHeight="0.9"
          />
          <Text
            mt={6}
            fontSize="20px"
            lineHeight="28px"
            color="text-secondary"
            maxW="440px"
          >
            A quieter place to keep up with the people and groups you care
            about.
          </Text>
        </Box>
        <Box borderTop="1px solid" borderColor="border" pt={4}>
          <Text textStyle="meta">
            posts · groups · saved for later — nothing ranked, nothing sponsored
          </Text>
        </Box>
      </Flex>

      <Flex
        flex="1"
        direction="column"
        bg="surface"
        borderLeft={{ lg: "1px solid" }}
        borderColor={{ lg: "border" }}
        px={{ base: 4, sm: 8, lg: 12 }}
        py={{ base: 8, lg: 12 }}
      >
        <Box display={{ base: "block", lg: "none" }} mb={10}>
          <Wordmark asLink={false} size="40px" />
        </Box>
        <Flex
          flex="1"
          direction="column"
          justify={{ base: "flex-start", sm: "center" }}
          w="full"
          maxW="360px"
          mx={{ base: 0, sm: "auto", lg: 0 }}
        >
          <Text
            as="h1"
            textStyle="display-xl"
            fontSize={{ base: "32px", sm: "40px" }}
            lineHeight={{ base: "36px", sm: "44px" }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text mt={2} color="text-muted">
              {subtitle}
            </Text>
          )}
          <Box mt={8}>{children}</Box>
          {footer && (
            <Box
              mt={8}
              pt={5}
              borderTop="1px solid"
              borderColor="border"
              fontSize="14px"
              color="text-secondary"
            >
              {footer}
            </Box>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default AuthLayout;
