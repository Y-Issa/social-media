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
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Actions from "./Actions";

import {
  fetchLikes,
  fetchAllSavedIds,
  likePost,
  deletePost,
  savePost,
} from "../../queries/posts";
import {
  deleteGroupPost,
  fetchGroupPostLikes,
  likeGroupPost,
  saveGroupPost,
} from "../../queries/groups";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";

function PostCard({ post, groupPost: groupPostProp = false }) {
  // Saved-posts page mixes both kinds; group posts are tagged there.
  const groupPost = groupPostProp || Boolean(post.isGroupPost);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    isLoading: isLoadingLikes,
    error: errorLikes,
    data: likes,
  } = useQuery({
    queryKey: ["likes", post.postId],
    queryFn: groupPost
      ? () => fetchGroupPostLikes(post.postId)
      : () => fetchLikes(post.postId),
  });

  // One shared query for all cards instead of two requests per card.
  const { data: saved } = useQuery({
    queryKey: ["saved"],
    queryFn: fetchAllSavedIds,
  });

  const showError = (title) => (error) =>
    toast({ title, description: errorMessage(error), status: "error" });

  const likeMutation = useMutation({
    mutationFn: groupPost
      ? (liked) => likeGroupPost(post.postId, liked)
      : (liked) => likePost(post.postId, liked),
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", post.postId]);
    },
    onError: showError("Couldn't update like"),
  });

  const deleteMutation = useMutation({
    mutationFn: groupPost
      ? () => deleteGroupPost(post.postId)
      : () => deletePost(post.postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["GroupPosts"]);
      queryClient.invalidateQueries(["savedPosts"]);
      toast({ title: "Post deleted.", status: "success" });
    },
    onError: showError("Couldn't delete post"),
  });

  const saveMutation = useMutation({
    mutationFn: groupPost
      ? () => saveGroupPost(post.postId, saved)
      : () => savePost(post.postId, saved),
    onSuccess: () => {
      queryClient.invalidateQueries(["saved"]);
      queryClient.invalidateQueries(["savedPosts"]);
      toast({
        title: saved?.includes(post.postId) ? "Post unsaved." : "Post saved.",
        status: "success",
      });
    },
    onError: showError("Couldn't update saved posts"),
  });

  function handleLike() {
    if (likeMutation.isLoading) return;
    likeMutation.mutate(likes?.includes(user.userId));
  }

  function handleDelete() {
    return deleteMutation.mutateAsync().catch(() => {});
  }

  function handleSave() {
    if (saveMutation.isLoading) return;
    saveMutation.mutate();
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
          name={post.name}
          src={getImageUrl(post.profileImage)}
          onClick={() => navigate(`/profile/${post.userId}`)}
          cursor="pointer"
        />
        <Box>
          <Text>{post.name}</Text>
          <Text fontSize="10px" textColor="textColor.300">
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
        </Box>

        <Spacer />
        <Actions
          ownPost={user.userId === post.userId}
          saved={saved?.includes(post.postId)}
          onDelete={handleDelete}
          onSave={handleSave}
          isDeleting={deleteMutation.isLoading}
        />
      </CardHeader>

      <CardBody pb="0px">
        <Text mb="10px">{post.description}</Text>

        {post.image && (
          <Img
            src={getImageUrl(post.image)}
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
            {isLoadingLikes ? (
              "Loading..."
            ) : errorLikes ? (
              "Error"
            ) : likes?.includes(user.userId) ? (
              <Box as={HiHeart} fontSize="24px" color="red.500" />
            ) : (
              <HiOutlineHeart fontSize="24px" />
            )}
            <Text ml={1}>
              {isLoadingLikes ? "Loading..." : likes?.length} likes
            </Text>
          </Button>
        </HStack>
        <HStack ml="10px">
          <CommentsModal postId={post.postId} groupPost={groupPost} />
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
