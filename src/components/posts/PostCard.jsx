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
import { HiHeart, HiOutlineHeart, HiOutlineShare } from "react-icons/hi2";
import CommentsModal from "./CommentsModal";

function PostCard({ post }) {
  return (
    <Card
      key={post.postId}
      mb="30px"
      color="textColor.100"
      bgColor="bgColor.50"
      borderRadius="2xl"
    >
      <CardHeader pb="10px" display="flex" gap="15px" alignItems="center">
        <Avatar size="sm" src={post.profileImage} />
        <Text>{post.name}</Text>
      </CardHeader>

      <CardBody pb="0px">
        <Text mb="10px">{post.description}</Text>

        <Img
          src={post.image}
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
  );
}

export default PostCard;
