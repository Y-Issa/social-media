import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchGroup, joinGroup } from "../queries/groups";
import Loading from "../components/Loading";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Posts from "../components/posts/Posts";
import CreateGroupPost from "../components/group/CreateGroupPost";
import GroupMembers from "../components/group/GroupMembers";
import { getImageUrl } from "../imageUrl";
import { errorMessage } from "../axios";

function Group() {
  const { groupId } = useParams();
  const queryClient = useQueryClient();
  const toast = useToast();

  const groupQuery = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
  });
  const group = groupQuery.data;

  const joinMutation = useMutation({
    mutationFn: () => joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries(["group", groupId]);
      queryClient.invalidateQueries(["groups"]);
      queryClient.invalidateQueries(["joinedGroups"]);
      queryClient.invalidateQueries(["members", groupId]);
      queryClient.invalidateQueries(["posts", "group", groupId]);
    },
    onError: (error) =>
      toast({ title: "Couldn't join group", description: errorMessage(error), status: "error" }),
  });

  if (groupQuery.isLoading) return <Loading />;
  if (groupQuery.error) {
    return (
      <Text p={6}>
        {groupQuery.error.response?.status === 404
          ? "This group doesn't exist."
          : errorMessage(groupQuery.error)}
      </Text>
    );
  }

  return (
    <Box>
      <Card
        mb="30px"
        mt="20px"
        color="textColor.100"
        bgColor="bgColor.50"
        borderRadius="2xl"
        mx={{ base: "10px", lg: "35px" }}
      >
        <CardBody>
          <HStack spacing={4} align="start">
            <Avatar size="lg" name={group.name} src={getImageUrl(group.image)} />
            <Box flex="1" minW={0}>
              <Heading size="lg">{group.name}</Heading>
              {group.description && (
                <Text color="textColor.300" mt={1}>
                  {group.description}
                </Text>
              )}
            </Box>
            <GroupMembers groupId={groupId} />
          </HStack>
          {!group.isMember && (
            <Button
              mt={4}
              colorScheme="primary"
              onClick={() => joinMutation.mutate()}
              isLoading={joinMutation.isLoading}
            >
              Join group
            </Button>
          )}
        </CardBody>
      </Card>

      {group.isMember ? (
        <>
          <CreateGroupPost groupId={groupId} />
          {/* Posts are members-only, so the list only mounts for members. */}
          <Posts groupId={groupId} />
        </>
      ) : (
        <Text px={10} color="textColor.300">
          Join this group to see and share posts.
        </Text>
      )}
    </Box>
  );
}

export default Group;
