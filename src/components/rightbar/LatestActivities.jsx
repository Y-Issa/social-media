import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";

function LatestActivities() {
  return (
    <Card w="full" my="10px" bgColor="white" borderRadius="sm">
      <CardHeader py="5px" color="gray.500">
        Latest Activities
      </CardHeader>
      <CardBody fontSize="sm">
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }} />
          <Text>John Doe shared an image</Text>
          <Spacer />
          <Text fontSize="xs" color="gray.500">
            1h ago
          </Text>
        </HStack>
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }} />
          <Text>John Doe shared an image</Text>
          <Spacer />
          <Text fontSize="xs" color="gray.500">
            1h ago
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
}

export default LatestActivities;
