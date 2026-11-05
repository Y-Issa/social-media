import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import Posts from "../components/posts/Posts";
import UserInfo, { UserInfoSkeleton } from "../components/profile/UserInfo";
import { fetchUser, fetchRelationships, toggleFollow } from "../queries/profile";
import { errorMessage } from "../axios";
import EmptyState from "../components/ui/EmptyState";
import SoonTag from "../components/ui/SoonTag";

function SoonTab({ children }) {
  return (
    <Tab isDisabled gap={2}>
      {children}
      <SoonTag />
    </Tab>
  );
}

function Profile() {
  const { user: currentUser } = useAuth();
  const { uid: userId } = useParams();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    isLoading: userLoading,
    error: userError,
    data: user,
  } = useQuery(["user", userId], () => fetchUser(userId));

  const { isLoading: relationshipsLoading, data: relationships } = useQuery(
    ["relationships", userId],
    () => fetchRelationships(userId)
  );

  const isFollowing = Boolean(relationships?.includes(currentUser.userId));

  const mutation = useMutation({
    mutationFn: (following) => toggleFollow(userId, following),
    onSuccess: () => queryClient.invalidateQueries(["relationships", userId]),
    onError: (error) =>
      toast({
        title: "Couldn't update follow.",
        description: errorMessage(error),
        status: "error",
      }),
  });

  const handleFollow = () => {
    if (mutation.isLoading) return;
    mutation.mutate(isFollowing);
  };

  if (userError) {
    const missing = [400, 404].includes(userError.response?.status);
    return (
      <EmptyState title={missing ? "No one here." : "Couldn't load this profile."}>
        {missing
          ? "This account doesn't exist, or it was deleted."
          : errorMessage(userError)}
      </EmptyState>
    );
  }

  if (userLoading) return <UserInfoSkeleton />;

  return (
    <>
      <UserInfo
        user={user}
        followerCount={relationships?.length}
        isFollowing={isFollowing}
        isFollowLoading={mutation.isLoading}
        isRelationshipsLoading={relationshipsLoading}
        onToggleFollow={handleFollow}
      />
      <Tabs isLazy>
        <TabList>
          <Tab>Posts</Tab>
          <SoonTab>Media</SoonTab>
          <SoonTab>Groups</SoonTab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Posts userId={user.userId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Profile;
