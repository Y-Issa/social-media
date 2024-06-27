import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  HStack,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";

const GroupCard = ({ group, isMember, onToggleMembership }) => (
  <Card bgColor="bgColor.100" color="textColor.100" mt="10px">
    <CardHeader>
      <HStack gap={2}>
        <Avatar src={group.image} />
        <Box>
          <Heading size="md">{group.name}</Heading>
          <Text fontSize="sm" color="textColor.300">
            {group.description}
          </Text>
        </Box>
        <Spacer />
        {isMember ? (
          <>
            <Button colorScheme="primary">View</Button>
            <Button
              colorScheme="red"
              onClick={() => onToggleMembership(group.groupId, true)}
            >
              Leave
            </Button>
          </>
        ) : (
          <Button
            colorScheme="primary"
            onClick={() => onToggleMembership(group.groupId, false)}
          >
            Join
          </Button>
        )}
      </HStack>
    </CardHeader>
  </Card>
);

export default GroupCard;
