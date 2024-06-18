import {
  Avatar,
  Box,
  Card,
  CardBody,
  HStack,
  Heading,
  Img,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";

function Profile() {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <Box>
          <Img
            maxH="200px"
            w="full"
            src={user.coverImage}
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
          >
            <Avatar
              size={{ base: "xl", md: "2xl" }}
              src={user.profileImage}
              mx="auto"
              mt="-50px"
            />
            <CardBody alignContent="center" pt="10px">
              <Box textAlign="center" mb="10px">
                <Heading size="lg">{user.name}</Heading>
                <HStack>
                  <FaFacebook fontSize="24px" />
                  <FaInstagram fontSize="24px" />
                  <FaTwitter fontSize="24px" />
                  <FaLinkedin fontSize="24px" />
                </HStack>
              </Box>
            </CardBody>
          </Card>
        </Box>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}

export default Profile;
