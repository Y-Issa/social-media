import { Box, Card, Spinner, Text } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Card
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="200px"
      bg="bgColor.50"
      borderRadius="2xl"
      mb="30px"
    >
      <Box textAlign="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
        />
        <Text mt={4} fontSize="xl" fontWeight="bold" color="textColor.200">
          Loading...
        </Text>
      </Box>
    </Card>
  );
};

export default Loading;
