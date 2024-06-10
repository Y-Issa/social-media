import { Box, Text } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn ? (
        <div>NFO5o</div>
      ) : (
        <Box>
          <Text h="5000px">Not logged in</Text>
        </Box>
      )}
    </>
  );
}

export default Profile;
