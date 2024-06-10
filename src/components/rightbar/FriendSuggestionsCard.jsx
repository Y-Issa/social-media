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
    <Card
      w="full"
      my="10px"
      bgColor="bgColor.50"
      color="textColor.100"
      borderRadius="sm"
    >
      <CardHeader py="5px" color="textColor.300">
        Friend Suggestions
      </CardHeader>
      <CardBody fontSize="sm">
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }} />
          <Text>Friend sugg</Text>
          <Spacer />
          <Button
            color="primary.50"
            bgColor="primary.500"
            _hover={{ bgColor: "primary.600" }}
            size={{ base: "xs", md: "sm" }}
          >
            Add
          </Button>
          <Button
            color="red.50"
            bgColor="red.600"
            _hover={{ bgColor: "red.700" }}
            variant="ghost"
            size={{ base: "xs", md: "sm" }}
          >
            Dismiss
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
}

export default FriendSuggestionsCard;
