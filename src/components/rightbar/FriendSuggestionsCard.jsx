import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  Avatar,
  Text,
  Spacer,
  Button,
} from "@chakra-ui/react";

function FriendSuggestionsCard() {
  return (
    <Card w="full" my="10px" bgColor="white" borderRadius="sm">
      <CardHeader py="5px" color="gray.500">
        Friend Suggestions
      </CardHeader>
      <CardBody>
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }} />
          <Text>Friend sugg</Text>
          <Spacer />
          <Button size={{ base: "xs", md: "sm" }}>Add</Button>
          <Button size={{ base: "xs", md: "sm" }}>Dismiss</Button>
        </HStack>
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }} />
          <Text>Friend sugg</Text>
          <Spacer />
          <Button size={{ base: "xs", md: "sm" }}>Add</Button>
          <Button size={{ base: "xs", md: "sm" }}>Dismiss</Button>
        </HStack>
      </CardBody>
    </Card>
  );
}

export default FriendSuggestionsCard;
