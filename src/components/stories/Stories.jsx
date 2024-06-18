import { Box, Button, HStack, Img, Text } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { HiOutlinePlus } from "react-icons/hi";

function Stories() {
  const { user } = useAuth();

  const TEMPSTORIES = [
    {
      id: 1,
      name: "John Doe",
      img: "https://www.thoughtco.com/thmb/_h43bYwrmYgTcGILDAuJWUfciok=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/choosing-close-up-farm-1549666-ef40bc27ee9746fc9d27d9cc3b587e62.jpg",
    },
    {
      id: 2,
      name: "Jane Doe",
      img: "https://cdn.pixabay.com/photo/2017/07/25/06/05/drip-2537039_640.jpg",
    },
    {
      id: 3,
      name: "Jane Doe",
      img: "https://cdn.pixabay.com/photo/2017/07/25/06/05/drip-2537039_640.jpg",
    },
    {
      id: 4,
      name: "Jane Doe",
      img: "https://cdn.pixabay.com/photo/2017/07/25/06/05/drip-2537039_640.jpg",
    },
  ];
  return (
    <HStack
      pl="5px"
      h="250px"
      gap="10px"
      mb="30px"
      overflowX="scroll"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {user && (
        <Box position="relative" flex={1} minW="100px">
          <Img
            src={user.image}
            alt={user.name}
            h="200px"
            w="full"
            borderRadius="10px"
          />

          <Button
            position="absolute"
            bottom="10px"
            left="10px"
            bgColor="primary.500"
            color="white"
            _hover={{ bgColor: "primary.600" }}
            borderRadius="full"
          >
            <HiOutlinePlus />
          </Button>
        </Box>
      )}
      {TEMPSTORIES.map((story) => (
        <Box key={story.id} position="relative" flex={1} minW="100px">
          <Img
            src={story.img}
            alt={story.name}
            h="200px"
            w="full"
            borderRadius="10px"
          />
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="rgba(0, 0, 0, 0.171)"
            color="white"
            p="10px"
            borderBottomRadius="10px"
            textAlign="left"
          >
            <Text>{story.name}</Text>
          </Box>
        </Box>
      ))}
    </HStack>
  );
}

export default Stories;
