import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Heading,
  Img,
  Text,
} from "@chakra-ui/react";
import { Navigate, useLocation } from "react-router-dom";
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
import { makeRequest } from "../axios";
import { useAuth } from "../contexts/AuthContext";
import Posts from "../components/posts/Posts";
import UpdateProfile from "../components/profile/UpdateProfile";

function Profile() {
  const { user: currentUser } = useAuth();

  const userId = useLocation().pathname.split("/").pop();
  const {
    isLoading,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await makeRequest.get(`users/find/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const { isLoading: relationshipsPending, data: relationships } = useQuery({
    queryKey: ["relationships"],
    queryFn: async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await makeRequest.get(`relationships/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (following) => {
      const token = JSON.parse(localStorage.getItem("token"));
      if (following) {
        return makeRequest.delete(`relationships/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        return makeRequest.post(
          `relationships/${userId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationships"]);
    },
  });

  function handleFollow() {
    mutation.mutate(relationships?.includes(currentUser.userId));
  }

  if (!currentUser) return <Navigate to="/login" />;

  if (error) return "An error has occurred: " + error.message;

  return isLoading
    ? "Loading..."
    : user && (
        <Box>
          <Img
            maxH="200px"
            w="full"
            src={
              user.coverImage?.startsWith("http")
                ? user.coverImage
                : `http://localhost:8001/public/upload/${user.coverImage}`
            }
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
              src={
                user.profileImage?.startsWith("http")
                  ? user.profileImage
                  : `http://localhost:8001/public/upload/${user.profileImage}`
              }
              mx="auto"
              mt="-50px"
            />
            <CardBody alignContent="center" pt="10px">
              <Box textAlign="center" mb="10px">
                <Heading size="lg">{user.name}</Heading>
                <Grid
                  templateColumns={{
                    base: "1fr",
                    sm: "1fr 1fr 1fr",
                  }}
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
                {relationshipsPending ? (
                  "Loading..."
                ) : currentUser.userId === user.userId ? (
                  <UpdateProfile />
                ) : (
                  <Button
                    mt="10px"
                    colorScheme="primary"
                    onClick={handleFollow}
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
