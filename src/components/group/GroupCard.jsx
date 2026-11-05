import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import GroupMembers from "./GroupMembers";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "../../queries/groups";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";
import ConfirmDialog from "../ConfirmDialog";

const GroupCard = ({ group, isMember, onToggleMembership, isToggling = false }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const confirmDelete = useDisclosure();
  const confirmLeave = useDisclosure();
  const isOwner = user.userId === group.createdBy;

  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
      queryClient.invalidateQueries(["joinedGroups"]);
      confirmDelete.onClose();
      toast({ title: "Group deleted.", status: "success" });
    },
    onError: (error) =>
      toast({ title: "Couldn't delete group", description: errorMessage(error), status: "error" }),
  });

  return (
    <Card bgColor="bgColor.100" color="textColor.100" mt="10px">
      <CardHeader>
        <HStack spacing={4} alignItems="start">
          <Avatar name={group.name} src={getImageUrl(group.image)} />
          <Box flex="1" minW={0}>
            <Heading size={{ base: "sm", sm: "md" }}>{group.name}</Heading>
            <Text fontSize={{ base: "xs", sm: "sm" }} color="textColor.300">
              {group.description}
            </Text>
          </Box>
          <GroupMembers groupId={group.groupId} />
        </HStack>

        <Stack
          direction={{ base: "column", sm: "row" }}
          justifyContent="flex-end"
          mt={3}
          spacing={2}
        >
          {isMember ? (
            <>
              <Button
                colorScheme="primary"
                size="sm"
                onClick={() => navigate(`/groups/${group.groupId}`)}
              >
                View
              </Button>
              {!isOwner && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={confirmLeave.onOpen}
                >
                  Leave
                </Button>
              )}
              {isOwner && (
                <Button colorScheme="red" size="sm" onClick={confirmDelete.onOpen}>
                  Delete
                </Button>
              )}
            </>
          ) : (
            <Button
              colorScheme="primary"
              size="sm"
              isLoading={isToggling}
              onClick={() => onToggleMembership(group.groupId, false)}
            >
              Join
            </Button>
          )}
        </Stack>
      </CardHeader>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={confirmDelete.onClose}
        onConfirm={() => deleteMutation.mutate(group.groupId)}
        isLoading={deleteMutation.isLoading}
        title={`Delete "${group.name}"?`}
        body="All of the group's posts will be deleted. This can't be undone."
      />
      <ConfirmDialog
        isOpen={confirmLeave.isOpen}
        onClose={confirmLeave.onClose}
        onConfirm={async () => {
          await onToggleMembership(group.groupId, true);
          confirmLeave.onClose();
        }}
        isLoading={isToggling}
        title={`Leave "${group.name}"?`}
        body="You can rejoin at any time."
        confirmLabel="Leave"
      />
    </Card>
  );
};

export default GroupCard;
