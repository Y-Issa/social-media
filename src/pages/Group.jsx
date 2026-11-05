import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import { fetchGroup, joinGroup } from "../queries/groups";
import { postKeys } from "../queries/postCache";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import EmptyState from "../components/ui/EmptyState";
import Posts from "../components/posts/Posts";
import CreateGroupPost from "../components/group/CreateGroupPost";
import GroupMembers from "../components/group/GroupMembers";
import GroupEvents from "../components/events/GroupEvents";
import { getImageUrl } from "../imageUrl";
import { errorMessage } from "../axios";

const IMAGE_SIZE = { base: "56px", md: "72px" };

function GroupImage({ group }) {
  const initial = (
    <Flex
      w="full"
      h="full"
      align="center"
      justify="center"
      bg="accent-subtle"
      color="accent"
      fontFamily="display"
      fontSize={{ base: "30px", md: "38px" }}
      lineHeight="1"
    >
      {group.name?.trim()?.[0]?.toUpperCase() || "#"}
    </Flex>
  );
  return (
    <Box
      w={IMAGE_SIZE}
      h={IMAGE_SIZE}
      flex="none"
      borderRadius="sm"
      overflow="hidden"
      border="1px solid"
      borderColor="border"
    >
      {group.image ? (
        <Image src={getImageUrl(group.image)} alt="" w="full" h="full" objectFit="cover" fallback={initial} />
      ) : (
        initial
      )}
    </Box>
  );
}

function GroupHeaderSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Loading group">
      <Flex gap={4} px={4} pt={{ base: 5, md: 8 }} pb={4} borderBottom="1px solid" borderColor="border">
        <Skeleton w={IMAGE_SIZE} h={IMAGE_SIZE} flex="none" />
        <Box flex="1">
          <Skeleton h="28px" w="55%" />
          <Skeleton h="12px" w="72px" mt={3} />
          <Skeleton h="12px" w="80%" mt={3} />
        </Box>
      </Flex>
      <Loading count={2} />
    </Box>
  );
}

function Group() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabIndex = searchParams.get("tab") === "events" ? 1 : 0;
  const setTab = (index) =>
    setSearchParams(index === 1 ? { tab: "events" } : {}, { replace: true });

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
      queryClient.invalidateQueries(postKeys.group(groupId));
      toast({ title: `You joined ${group?.name ?? "the group"}.`, status: "success" });
    },
    onError: (error) =>
      toast({ title: "Couldn't join group", description: errorMessage(error), status: "error" }),
  });

  if (groupQuery.isLoading) return <GroupHeaderSkeleton />;
  if (groupQuery.error) {
    const notFound = groupQuery.error.response?.status === 404;
    return (
      <EmptyState
        title={notFound ? "This group doesn't exist." : "Couldn't load this group."}
        action={
          <Button as={RouterLink} to="/groups" variant="secondary" size="sm">
            All groups
          </Button>
        }
      >
        {notFound ? "It may have been deleted by its owner." : errorMessage(groupQuery.error)}
      </EmptyState>
    );
  }

  const isOwner = user.userId === group.createdBy;

  return (
    <>
      <Flex
        as="header"
        gap={4}
        px={4}
        pt={{ base: 5, md: 8 }}
        pb={4}
        borderBottom="1px solid"
        borderColor="border"
        align="flex-start"
      >
        <GroupImage group={group} />
        <Box flex="1" minW={0}>
          <Flex align="flex-start" gap={3}>
            <Box flex="1" minW={0}>
              <Heading
                as="h1"
                variant="display"
                fontSize={{ base: "28px", md: "40px" }}
                lineHeight={{ base: "32px", md: "44px" }}
                overflowWrap="anywhere"
              >
                {group.name}
              </Heading>
              <Flex align="center" gap={1.5} mt={1}>
                <GroupMembers groupId={groupId} groupName={group.name} />
                {isOwner && (
                  <>
                    <Text as="span" textStyle="meta" aria-hidden>
                      ·
                    </Text>
                    <Text as="span" textStyle="meta">
                      you own this group
                    </Text>
                  </>
                )}
              </Flex>
            </Box>
            {!group.isMember && (
              <Button
                flex="none"
                variant="primary"
                size="sm"
                mt={{ base: 0.5, md: 2 }}
                onClick={() => joinMutation.mutate()}
                isLoading={joinMutation.isLoading}
              >
                Join
              </Button>
            )}
          </Flex>
          {group.description && (
            <Text mt={2.5} fontSize="15px" lineHeight="22px" color="text-secondary" maxW="520px" whiteSpace="pre-wrap">
              {group.description}
            </Text>
          )}
        </Box>
      </Flex>

      {group.isMember ? (
        <Tabs index={tabIndex} onChange={setTab} isLazy>
          <TabList>
            <Tab>Posts</Tab>
            <Tab>Events</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CreateGroupPost groupId={groupId} />
              {/* Posts are members-only, so the list only mounts for members. */}
              <Posts groupId={groupId} canModerate={isOwner} />
            </TabPanel>
            <TabPanel>
              <GroupEvents groupId={groupId} groupName={group.name} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <EmptyState title="Members only.">
          Join {group.name} to read its posts, see its events and share your own.
        </EmptyState>
      )}
    </>
  );
}

export default Group;
