import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Img,
  Spacer,
  Text,
} from "@chakra-ui/react";
import {
  HiHeart,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineHeart,
  HiOutlineShare,
} from "react-icons/hi2";
import CommentsModal from "./CommentsModal";

function Posts() {
  const TEMPPOSTS = [
    {
      id: 1,
      name: "John Doe",
      profilePic: "https://bit.ly/dan-abramov",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nisl at libero tincidunt tincidunt. Donec et libero in nunc tristique fermentum.",
      img: "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
      isLiked: true,
    },
    {
      id: 2,
      name: "Jane Doe",
      profilePic: "https://bit.ly/dan-abramov",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nisl at libero tincidunt tincidunt. Donec et libero in nunc tristique fermentum.",
      img: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    },
    {
      id: 3,
      name: "Jane Doe",
      profilePic: "https://bit.ly/dan-abramov",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec nisl at libero tincidunt tincidunt. Donec et libero in nunc tristique fermentum.",
      img: "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
    },
  ];

  return (
    <Box>
      {TEMPPOSTS.map((post) => (
        <Card
          key={post.id}
          mb="30px"
          color="textColor.100"
          bgColor="bgColor.50"
          borderRadius="2xl"
        >
          <CardHeader pb="10px" display="flex" gap="15px" alignItems="center">
            <Avatar size="sm" src={post.profilePic} />
            <Text>{post.name}</Text>
          </CardHeader>

          <CardBody pb="0px">
            <Text mb="10px">{post.description}</Text>

            <Img
              src={post.img}
              alt={post.name}
              w="full"
              maxH="450px"
              borderRadius="5px"
            />
          </CardBody>
          <CardFooter>
            <HStack>
              <Button
                variant="ghost"
                _hover={{
                  color: "primary.500",
                }}
                p="0px"
              >
                {post.isLiked ? (
                  <Box as={HiHeart} fontSize="24px" color="red.500" />
                ) : (
                  <HiOutlineHeart fontSize="24px" />
                )}
              </Button>
              <Text>2.2k</Text>
            </HStack>
            <HStack ml="10px">
              <CommentsModal />
              <Text>5.6k</Text>
            </HStack>
            <Spacer />
            <HStack>
              <Button
                variant="ghost"
                _hover={{
                  color: "primary.500",
                }}
              >
                <HiOutlineShare fontSize="24px" />
              </Button>
            </HStack>
          </CardFooter>
        </Card>
      ))}
    </Box>
  );
}

export default Posts;
