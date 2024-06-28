import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  HStack,
  Heading,
  Text,
  VStack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import GroupMembers from "./GroupMembers";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "../../queries/groups";
import { useAuth } from "../../contexts/AuthContext";

const GroupCard = ({ group, isMember, onToggleMembership }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayVertical = useBreakpointValue({ base: true, sm: false });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
      queryClient.invalidateQueries(["joinedGroups"]);
      toast({
        title: "Group Deleted Successfully",
        status: "success",
        duration: 3000,
        position: "top",
      });
    },
  });

  async function handleDeleteGroup() {
    await mutation.mutateAsync(group.groupId);
  }

  return (
    <Card bgColor="bgColor.100" color="textColor.100" mt="10px">
      <CardHeader>
        <HStack spacing={4} alignItems="start">
          <Avatar src={group.image} />
          <Box flex="1">
            <Heading size={displayVertical ? "sm" : "md"}>{group.name}</Heading>
            <Text
              fontSize={displayVertical ? "xs" : "sm"}
              color="textColor.300"
            >
              {group.description}
            </Text>
          </Box>
          <GroupMembers groupId={group.groupId} />
        </HStack>
        {displayVertical ? (
          <VStack mt={3} alignItems="flex-start" spacing={2} w="full">
            {isMember ? (
              <>
                <Button
                  colorScheme="primary"
                  size="sm"
                  w="full"
                  onClick={() => navigate(`/groups/${group.groupId}`)}
                >
                  View
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  w="full"
                  onClick={() => onToggleMembership(group.groupId, true)}
                >
                  Leave
                </Button>
                {user.userId === group.createdBy && <Button>Delete</Button>}
              </>
            ) : (
              <Button
                colorScheme="primary"
                size="sm"
                w="full"
                onClick={() => onToggleMembership(group.groupId, false)}
              >
                Join
              </Button>
            )}
          </VStack>
        ) : (
          <HStack justifyContent="flex-end" mt={3}>
            {isMember ? (
              <>
                <Button
                  colorScheme="primary"
                  size="sm"
                  onClick={() => navigate(`/groups/${group.groupId}`)}
                >
                  View
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => onToggleMembership(group.groupId, true)}
                >
                  Leave
                </Button>
                {user.userId === group.createdBy && (
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={handleDeleteGroup}
                  >
                    Delete
                  </Button>
                )}
              </>
            ) : (
              <Button
                colorScheme="primary"
                size="sm"
                onClick={() => onToggleMembership(group.groupId, false)}
              >
                Join
              </Button>
            )}
          </HStack>
        )}
      </CardHeader>
    </Card>
  );
};

export default GroupCard;
