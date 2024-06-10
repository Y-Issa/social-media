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
    <Card
      w="full"
      my="10px"
      bgColor="bgColor.50"
      color="textColor.100"
      borderRadius="sm"
    >
      <CardHeader py="5px" color="textColor.300">
        Latest Activities
      </CardHeader>
      <CardBody fontSize="sm">
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }} />
          <Text>John Doe shared an image</Text>
          <Spacer />
          <Text fontSize="xs" color="textColor.300">
            1h ago
          </Text>
        </HStack>
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }} />
          <Text>John Doe shared an image</Text>
          <Spacer />
          <Text fontSize="xs" color="textColor.300">
            1h ago
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
}

export default LatestActivities;
