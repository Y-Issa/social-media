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
  Link,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HiHeart, HiOutlineHeart, HiOutlineShare } from "react-icons/hi2";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CommentsModal from "./CommentsModal";
import Actions from "./Actions";
import { useAuth } from "../../contexts/AuthContext";
import { deletePost, toggleLike, toggleSave } from "../../queries/posts";
import {
  postKeys,
  removePostFromCaches,
  restorePostCaches,
  snapshotPostCaches,
  updatePostInCaches,
} from "../../queries/postCache";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";

// Renders one post from a list row. Counts and likedByMe/savedByMe come
// with the row; like and save update every cached list optimistically.
// showGroup adds an "in <group>" link for group posts.
function PostCard({ post, showGroup = true }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const showError = (title, error) =>
    toast({ title, description: errorMessage(error), status: "error" });

  const likeMutation = useMutation({
    mutationFn: (liked) => toggleLike(post.postId, liked),
    onMutate: async (liked) => {
      const snapshot = await snapshotPostCaches(queryClient);
      updatePostInCaches(queryClient, post.postId, (p) => ({
        ...p,
        likedByMe: !liked,
        likeCount: Math.max(0, p.likeCount + (liked ? -1 : 1)),
      }));
      return { snapshot };
    },
    onError: (error, _liked, context) => {
      restorePostCaches(queryClient, context?.snapshot);
      showError("Couldn't update like", error);
    },
    onSettled: () => queryClient.invalidateQueries(postKeys.all),
  });

  const saveMutation = useMutation({
    mutationFn: (saved) => toggleSave(post.postId, saved),
    onMutate: async (saved) => {
      const snapshot = await snapshotPostCaches(queryClient);
      updatePostInCaches(queryClient, post.postId, (p) => ({
        ...p,
        savedByMe: !saved,
      }));
      // Unsaving takes the post off the saved list right away.
      if (saved) removePostFromCaches(queryClient, post.postId, postKeys.saved);
      return { snapshot };
    },
    onSuccess: (_data, saved) => {
      toast({ title: saved ? "Post unsaved." : "Post saved.", status: "success" });
    },
    onError: (error, _saved, context) => {
      restorePostCaches(queryClient, context?.snapshot);
      showError("Couldn't update saved posts", error);
    },
    onSettled: () => queryClient.invalidateQueries(postKeys.all),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post.postId),
    onSuccess: () => {
      removePostFromCaches(queryClient, post.postId);
      queryClient.invalidateQueries(postKeys.all);
      toast({ title: "Post deleted.", status: "success" });
    },
    onError: (error) => showError("Couldn't delete post", error),
  });

  function handleLike() {
    if (likeMutation.isLoading) return;
    likeMutation.mutate(post.likedByMe);
  }

  function handleSave() {
    if (saveMutation.isLoading) return;
    saveMutation.mutate(post.savedByMe);
  }

  function handleDelete() {
    return deleteMutation.mutateAsync().catch(() => {});
  }

  return (
    <Card
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
            {showGroup && post.groupId && post.groupName && (
              <>
                {" · in "}
                <Link
                  as={RouterLink}
                  to={`/groups/${post.groupId}`}
                  color="primary.500"
                >
                  {post.groupName}
                </Link>
              </>
            )}
          </Text>
        </Box>

        <Spacer />
        {/* Group creators may also delete posts in their group; the server
            decides, so only the author gets the menu item here. */}
        <Actions
          ownPost={user.userId === post.userId}
          saved={post.savedByMe}
          onDelete={handleDelete}
          onSave={handleSave}
          isDeleting={deleteMutation.isLoading}
        />
      </CardHeader>

      <CardBody pb="0px">
        <Text mb="10px" whiteSpace="pre-wrap">
          {post.description}
        </Text>

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
            _hover={{ color: "primary.500" }}
            _active={{ color: "primary.500" }}
            p="0px"
            onClick={handleLike}
            aria-pressed={post.likedByMe}
            aria-label={post.likedByMe ? "Unlike" : "Like"}
          >
            {post.likedByMe ? (
              <Box as={HiHeart} fontSize="24px" color="red.500" />
            ) : (
              <HiOutlineHeart fontSize="24px" />
            )}
            <Text ml={1}>
              {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
            </Text>
          </Button>
        </HStack>
        <HStack ml="10px">
          <CommentsModal post={post} />
        </HStack>
        <Spacer />
        <HStack>
          <Button variant="ghost" _hover={{ color: "primary.500" }} aria-label="Share">
            <HiOutlineShare fontSize="24px" />
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
