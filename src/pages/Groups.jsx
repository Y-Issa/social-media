import { Box, Heading, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchJoinedGroups,
  fetchUnjoinedGroups,
  joinGroup,
  leaveGroup,
} from "../queries/groups";
import GroupCard from "../components/group/GroupCard";
import Loading from "../components/Loading";
import CreateGroup from "../components/group/CreateGroup";
import { errorMessage } from "../axios";

function Groups() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    isLoading: isLoadingJoinedGroups,
    error: errorJoinedGroups,
    data: joinedGroups,
  } = useQuery({ queryKey: ["joinedGroups"], queryFn: fetchJoinedGroups });

  const {
    isLoading: isLoadingGroups,
    error: errorGroups,
    data: groups,
  } = useQuery({ queryKey: ["groups"], queryFn: fetchUnjoinedGroups });

  const toggleMembershipMutation = useMutation({
    mutationFn: async ({ groupId, isMember }) => {
      if (isMember) {
        await leaveGroup(groupId);
      } else {
        await joinGroup(groupId);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["groups"]);
      queryClient.invalidateQueries(["joinedGroups"]);
      toast({
        title: variables.isMember ? "You left the group." : "You joined the group.",
        status: "success",
      });
    },
    onError: (error) =>
      toast({ title: "Something went wrong", description: errorMessage(error), status: "error" }),
  });

  const handleToggleMembership = (groupId, isMember) =>
    toggleMembershipMutation.mutateAsync({ groupId, isMember }).catch(() => {});

  const togglingId = toggleMembershipMutation.isLoading
    ? toggleMembershipMutation.variables?.groupId
    : null;

  return (
    <>
      <Box p="20px">
        <Heading>Your Groups</Heading>
        {isLoadingJoinedGroups ? (
          <Loading />
        ) : errorJoinedGroups ? (
          <Text>Something Went Wrong!</Text>
        ) : joinedGroups?.length > 0 ? (
          joinedGroups.map((group) => (
            <GroupCard
              key={group.groupId}
              group={group}
              isMember={true}
              onToggleMembership={handleToggleMembership}
              isToggling={togglingId === group.groupId}
            />
          ))
        ) : (
          <Text mt={2}>No groups joined yet.</Text>
        )}
      </Box>
      <Box p="20px">
        <Heading>Other Groups</Heading>
        {isLoadingGroups ? (
          <Loading />
        ) : errorGroups ? (
          <Text>Something Went Wrong!</Text>
        ) : groups?.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.groupId}
              group={group}
              isMember={false}
              onToggleMembership={handleToggleMembership}
              isToggling={togglingId === group.groupId}
            />
          ))
        ) : (
          <Text mt={2}>No other groups available to join at the moment.</Text>
        )}
        <CreateGroup />
      </Box>
    </>
  );
}

export default Groups;
