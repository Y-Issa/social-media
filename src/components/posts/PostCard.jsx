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
  useToast,
} from "@chakra-ui/react";
import { HiHeart, HiOutlineHeart, HiOutlineShare } from "react-icons/hi2";
import CommentsModal from "./CommentsModal";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Actions from "./Actions";

function PostCard({ post }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    isLoading,
    error,
    data: likes,
  } = useQuery({
    queryKey: ["likes", post.postId],
    queryFn: async () => {
      const res = await makeRequest.get(`/likes/${post.postId}`);
      return res.data;
    },
  });

  const {
    isLoading: loadingSaved,
    error: errorSaved,
    data: saved,
  } = useQuery({
    queryKey: ["saved", post.postId],
    queryFn: async () => {
      const res = await makeRequest.get(`/save/ids`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      await makeRequest.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast({
        title: "Post deleted.",
        status: "success",
        duration: 3000,
        position: "top",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (postId) => {
      if (saved?.includes(postId)) {
        await makeRequest.delete(`/save/${postId}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        });
      } else {
        await makeRequest.post(
          `/save/${postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token")
              )}`,
            },
          }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["saved", post.postId]);
      queryClient.invalidateQueries(["savedPosts"]);
      toast({
        title: saved?.includes(post.postId) ? "Post unsaved." : "Post saved.",
        status: "success",
        duration: 3000,
        position: "top",
      });
    },
  });

  function handleLike() {
    likeMutation.mutate(likes?.includes(user.userId));
  }

  function handleDelete() {
    deleteMutation.mutate(post.postId);
  }

  function handleSave() {
    saveMutation.mutate(post.postId);
  }

  return (
    <Card
      key={post.postId}
      mb="30px"
      color="textColor.100"
      bgColor="bgColor.50"
      borderRadius="2xl"
      mx={{ base: "10px", lg: "35px" }}
    >
      <CardHeader pb="10px" display="flex" gap="15px" alignItems="center">
        <Avatar
          size="sm"
          src={
            post.profileImage.startsWith("http")
              ? post.profileImage
              : `http://localhost:8001/public/upload/${post.profileImage}`
          }
          onClick={() => navigate(`/profile/${post.userId}`)}
          cursor="pointer"
        />
        <Box>
          <Text>{post.name}</Text>
          <Text fontSize="10px" textColor="textColor.300">
            {formatDistanceToNow(post.createdAt)} ago
          </Text>
        </Box>

        <Spacer />
        <Actions
          ownPost={user.userId === post.userId}
          saved={saved?.includes(post.postId)}
          onDelete={handleDelete}
          onSave={handleSave}
        />
      </CardHeader>

      <CardBody pb="0px">
        <Text mb="10px">{post.description}</Text>

        {post.image && (
          <Img
            src={
              post.image.startsWith("http")
                ? post.image
                : `http://localhost:8001/public/upload/${post.image}`
            }
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
            _active={{
              color: "primary.500",
            }}
            p="0px"
            onClick={handleLike}
          >
            {isLoading ? (
              "Loading..."
            ) : likes?.includes(user.userId) ? (
              <Box as={HiHeart} fontSize="24px" color="red.500" />
            ) : (
              <HiOutlineHeart fontSize="24px" />
            )}
            <Text ml={1}>{isLoading ? "Loading..." : likes?.length} likes</Text>
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
