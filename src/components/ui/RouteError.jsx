import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";
import Wordmark from "./Wordmark";

// Router-level error screen, instead of React Router's developer default.
// `inline` renders inside the app shell's feed column.
function RouteError({ inline = false }) {
  const error = useRouteError();
  const detail = error?.statusText || error?.message;

  return (
    <Box
      minH={inline ? undefined : "100vh"}
      bg={inline ? "transparent" : "bg"}
      color="text-primary"
      px={inline ? 4 : { base: 4, md: 12 }}
      py={10}
    >
      {!inline && <Wordmark asLink={false} />}
      <Box maxW="520px" mt={inline ? 0 : { base: 16, md: 24 }}>
        <Text as="h1" textStyle={inline ? "display" : "display-xl"}>
          Something broke on this page.
        </Text>
        <Text mt={3} color="text-muted">
          Reloading usually fixes it. If it keeps happening, the error below
          will help whoever looks into it.
        </Text>
        {detail && (
          <Text
            mt={5}
            textStyle="meta"
            p={3}
            bg="surface"
            border="1px solid"
            borderColor="border"
            borderRadius="sm"
            wordBreak="break-word"
          >
            {detail}
          </Text>
        )}
        <HStack mt={6} spacing={3}>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button variant="secondary" onClick={() => window.location.assign("/")}>
            Go home
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

export default RouteError;
