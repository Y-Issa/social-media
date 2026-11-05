import { Box, Flex, Skeleton, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchJoinedGroups,
  fetchUnjoinedGroups,
  joinGroup,
  leaveGroup,
} from "../queries/groups";
import GroupCard from "../components/group/GroupCard";
import CreateGroup from "../components/group/CreateGroup";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import { errorMessage } from "../axios";

function GroupRowSkeleton() {
  return (
    <Flex gap={3} px={4} py={3} borderBottom="1px solid" borderColor="border">
      <Skeleton w="48px" h="48px" flex="none" />
      <Box flex="1">
        <Skeleton h="14px" w="40%" mt={1} />
        <Skeleton h="10px" w="72px" mt={2} />
        <Skeleton h="12px" w="80%" mt={2} />
      </Box>
      <Skeleton h="32px" w="56px" />
    </Flex>
  );
}

function Section({ title, count, children }) {
  return (
    <Box as="section" aria-label={title}>
      <Flex
        align="center"
        justify="space-between"
        px={4}
        pt={6}
        pb={2}
        borderBottom="1px solid"
        borderColor="border"
      >
        <Text as="h2" textStyle="label">
          {title}
        </Text>
        {count != null && <Text textStyle="meta">{count}</Text>}
      </Flex>
      {children}
    </Box>
  );
}

function GroupList({ query, isMember, empty, onToggle, togglingId }) {
  if (query.isLoading)
    return (
      <>
        <GroupRowSkeleton />
        <GroupRowSkeleton />
      </>
    );
  if (query.error)
    return (
      <Text px={4} py={4} color="danger" fontSize="14px">
        {errorMessage(query.error, "Couldn't load groups.")}
      </Text>
    );
  if (!query.data?.length) return empty;
  return query.data.map((group) => (
    <GroupCard
      key={group.groupId}
      group={group}
      isMember={isMember}
      onToggleMembership={onToggle}
      isToggling={togglingId === group.groupId}
    />
  ));
}

function Groups() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const joined = useQuery({ queryKey: ["joinedGroups"], queryFn: fetchJoinedGroups });
  const discover = useQuery({ queryKey: ["groups"], queryFn: fetchUnjoinedGroups });

  const toggleMembershipMutation = useMutation({
    mutationFn: async ({ groupId, isMember }) => {
      if (isMember) await leaveGroup(groupId);
      else await joinGroup(groupId);
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
      toast({
        title: "Something went wrong.",
        description: errorMessage(error),
        status: "error",
      }),
  });

  const handleToggleMembership = (groupId, isMember) =>
    toggleMembershipMutation.mutateAsync({ groupId, isMember }).catch(() => {});

  const togglingId = toggleMembershipMutation.isLoading
    ? toggleMembershipMutation.variables?.groupId
    : null;

  return (
    <>
      <PageHeader title="Groups" action={<CreateGroup />} />

      <Section title="Your groups" count={joined.data?.length}>
        <GroupList
          query={joined}
          isMember
          onToggle={handleToggleMembership}
          togglingId={togglingId}
          empty={
            <EmptyState title="No groups yet." py={8}>
              Join one from the list below, or start your own.
            </EmptyState>
          }
        />
      </Section>

      <Section title="Discover" count={discover.data?.length}>
        <GroupList
          query={discover}
          isMember={false}
          onToggle={handleToggleMembership}
          togglingId={togglingId}
          empty={
            <EmptyState
              title="You've joined everything."
              py={8}
              action={<CreateGroup buttonProps={{ variant: "secondary" }} label="Start a group" />}
            >
              There are no other groups right now.
            </EmptyState>
          }
        />
      </Section>
    </>
  );
}

export default Groups;
