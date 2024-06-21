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
  VStack,
} from "@chakra-ui/react";
import { HiHeart, HiOutlineHeart, HiOutlineShare } from "react-icons/hi2";
import CommentsModal from "./CommentsModal";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

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
        <Box>
          <Text>{post.name}</Text>
          <Text fontSize="10px" textColor="textColor.300">
            {formatDistanceToNow(post.createdAt)} ago
          </Text>
        </Box>
      </CardHeader>

      <CardBody pb="0px">
        <Text mb="10px">{post.description}</Text>

        {post.image && (
          <Img
            src={`http://localhost:8001/public/upload/${post.image}`}
            alt={post.name}
            w="full"
            maxH="450px"
            borderRadius="5px"
          />
        )}
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
          <CommentsModal postId={post.postId} />
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
