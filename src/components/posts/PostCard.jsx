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
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isPending, error, data } = useQuery({
    queryKey: ["likes", post.postId],
    queryFn: async () => {
      const res = await makeRequest.get(`/likes/${post.postId}`);
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (liked) => {
      if (!liked)
        return makeRequest.post(
          `/likes/${post.postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );
      return makeRequest.delete(`/likes/${post.postId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", post.postId]);
    },
  });

  function handleLike() {
    mutation.mutate(data?.includes(user.userId));
  }

  return (
    <Card
      key={post.postId}
      mb="30px"
      color="textColor.100"
      bgColor="bgColor.50"
      borderRadius="2xl"
    >
      <CardHeader pb="10px" display="flex" gap="15px" alignItems="center">
        <Avatar
          size="sm"
          src={post.profileImage}
          onClick={() => navigate(`/profile/${post.userId}`)}
          cursor="pointer"
        />
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
            onClick={handleLike}
          >
            {isPending ? (
              "Loading..."
            ) : data?.includes(user.userId) ? (
              <Box as={HiHeart} fontSize="24px" color="red.500" />
            ) : (
              <HiOutlineHeart fontSize="24px" />
            )}
            <Text ml={1}>{isPending ? "Loading..." : data?.length} likes</Text>
          </Button>
        </HStack>
        <HStack ml="10px">
          <CommentsModal postId={post.postId} />
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
