import {
  Avatar,
  AvatarBadge,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";

function OnlineFriends() {
  return (
    <Card
      w="full"
      my="10px"
      bgColor="bgColor.50"
      color="textColor.100"
      borderRadius="sm"
    >
      <CardHeader py="5px" color="textColor.300">
        Online Friends
      </CardHeader>
      <CardBody fontSize="sm">
        <HStack mb="10px">
          <Avatar size={{ base: "xs", md: "sm" }}>
            <AvatarBadge boxSize="1em" bg="green.500" />
          </Avatar>
          <Text>John Doe </Text>
          <Spacer />
        </HStack>
      </CardBody>
    </Card>
  );
}

export default OnlineFriends;
