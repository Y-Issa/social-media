import {
  Box,
  Img,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Heading,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  FaEllipsisVertical,
  FaFacebook,
  FaGlobe,
  FaInbox,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaTwitter,
} from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import Posts from "../components/posts/Posts";
import UpdateProfile from "../components/profile/UpdateProfile";
import {
  fetchUser,
  fetchRelationships,
  toggleFollow,
} from "../queries/profile";
import { getImageUrl } from "../imageUrl";
import { errorMessage } from "../axios";
import Loading from "../components/Loading";
import { useToast } from "@chakra-ui/react";

function Profile() {
  const { user: currentUser } = useAuth();
  const { uid: userId } = useParams();
  const toast = useToast();

  const {
    isLoading: userLoading,
    error: userError,
    data: user,
  } = useQuery(["user", userId], () => fetchUser(userId));
  const { isLoading: relationshipsLoading, data: relationships } = useQuery(
    ["relationships", userId],
    () => fetchRelationships(userId)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) => toggleFollow(userId, following),
    onSuccess: () => {
      queryClient.invalidateQueries(["relationships", userId]);
    },
    onError: (error) =>
      toast({ title: "Couldn't update follow", description: errorMessage(error), status: "error" }),
  });

  const handleFollow = () => {
    if (mutation.isLoading) return;
    mutation.mutate(relationships?.includes(currentUser.userId));
  };

  if (userError) {
    return (
      <Text p={6}>
        {userError.response?.status === 404 || userError.response?.status === 400
          ? "This user doesn't exist."
          : errorMessage(userError)}
      </Text>
    );
  }

  return userLoading ? (
    <Loading />
  ) : (
    <Box>
      <Img
        maxH="200px"
        w="full"
        src={getImageUrl(user.coverImage)}
        fallback={<Box h="200px" w="full" bgColor="bgColor.400" mb="10px" />}
        alt="cover-image"
        objectFit="cover"
        objectPosition="top"
        mb="10px"
      />
      <Card
        color="textColor.100"
        bgColor="bgColor.50"
        borderRadius="2xl"
        mx={{ base: "10px", lg: "35px" }}
        mb="30px"
      >
        <Avatar
          size={{ base: "xl", sm: "2xl" }}
          name={user.name}
          src={getImageUrl(user.profileImage)}
          mx="auto"
          mt="-50px"
        />
        <CardBody alignContent="center" pt="10px">
          <Box textAlign="center" mb="10px">
            <Heading size="lg">{user.name}</Heading>
            <Grid
              templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }}
              gap={4}
              alignItems="center"
            >
              <GridItem>
                <HStack
                  spacing={4}
                  justify={{ base: "center", md: "flex-start" }}
                >
                  <FaFacebook fontSize="24px" />
                  <FaInstagram fontSize="24px" />
                  <FaTwitter fontSize="24px" />
                  <FaLinkedin fontSize="24px" />
                </HStack>
              </GridItem>
              <GridItem
                display="flex"
                justifyContent={{ base: "center", md: "center" }}
              >
                <HStack spacing={4}>
                  <Text>{user.city ? user.city : "Earth"}</Text>
                  <FaLocationDot fontSize="24px" />
                  {user.website && (
                    <Button
                      as="a"
                      href={
                        user.website.startsWith("http")
                          ? user.website
                          : `http://${user.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="unstyled"
                      display="flex"
                      gap={2}
                    >
                      <Text>Website</Text>
                      <FaGlobe fontSize="24px" />
                    </Button>
                  )}
                </HStack>
              </GridItem>
              <GridItem
                display="flex"
                justifyContent={{ base: "center", md: "flex-end" }}
              >
                <HStack spacing={4}>
                  <FaInbox fontSize="24px" />
                  <FaEllipsisVertical fontSize="24px" />
                </HStack>
              </GridItem>
            </Grid>
            {relationshipsLoading ? (
              "Loading..."
            ) : currentUser.userId === user.userId ? (
              <UpdateProfile />
            ) : (
              <Button
                mt="10px"
                colorScheme="primary"
                onClick={handleFollow}
                isLoading={mutation.isLoading}
              >
                {relationships?.includes(currentUser.userId)
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            )}
          </Box>
        </CardBody>
      </Card>
      <Posts userId={user.userId} />
    </Box>
  );
}

export default Profile;
