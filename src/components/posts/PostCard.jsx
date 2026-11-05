import {
  Avatar,
  Box,
  Flex,
  Image,
  Link,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LuBookmark, LuHeart, LuMessageCircle, LuShare } from "react-icons/lu";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import Actions from "./Actions";
import Comments from "./Comments";
import ImageLightbox from "./ImageLightbox";
import PostEditor from "./PostEditor";
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
import { fullTime, isoTime, shortTime } from "./time";
import { ease, fadeIn, likePop } from "./motion";

const Dot = () => (
  <Text as="span" textStyle="meta" aria-hidden flex="none">
    ·
  </Text>
);

// One button in the action row: 18px icon + mono count, muted → accent.
function ActionButton({ icon, count, label, isActive = false, onClick, ...props }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      aria-label={label}
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      h="32px"
      minW="32px"
      px={2}
      borderRadius="sm"
      color={isActive ? "accent" : "text-muted"}
      transition={`color 120ms ${ease}, background 120ms ${ease}`}
      _hover={{ color: "accent", bg: "accent-subtle" }}
      _active={{ color: "accent-hover" }}
      _focusVisible={{ outline: "none", boxShadow: "outline", color: "accent" }}
      {...props}
    >
      {icon}
      {count !== undefined && (
        <Text as="span" fontFamily="mono" fontSize="13px" lineHeight="16px" minW="2ch" textAlign="left">
          {count}
        </Text>
      )}
    </Box>
  );
}

// One post row (see DESIGN.md "Post"). Counts and likedByMe/savedByMe come
// with the row; like and save update every cached list optimistically.
// showGroup adds an "in <group>" link for group posts; canModerate lets a
// group's owner delete any post on the group page. defaultExpanded opens
// the replies right away (the permalink page); onDeleted runs after a
// successful delete, before the lists refetch.
function PostCard({ post, showGroup = true, canModerate = false, defaultExpanded = false, onDeleted }) {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const lightbox = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(defaultExpanded);
  const [likePulse, setLikePulse] = useState(0);

  const isAuthor = user.userId === post.userId;
  const profile = `/profile/${post.userId}`;
  const permalink = `/post/${post.postId}`;

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
      onDeleted?.();
      // Refetch the lists, but not this post's permalink (it would 404).
      const detail = postKeys.detail(post.postId).join("/");
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
        predicate: (query) => query.queryKey.join("/") !== detail,
      });
      toast({ title: "Post deleted.", status: "success" });
    },
    onError: (error) => showError("Couldn't delete post", error),
  });

  function handleLike() {
    if (likeMutation.isLoading) return;
    if (!post.likedByMe) setLikePulse((n) => n + 1);
    likeMutation.mutate(post.likedByMe);
  }

  function handleSave() {
    if (saveMutation.isLoading) return;
    saveMutation.mutate(post.savedByMe);
  }

  function handleDelete() {
    return deleteMutation.mutateAsync().then(
      () => true,
      () => false
    );
  }

  async function handleShare() {
    const url = `${window.location.origin}${permalink}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied.", status: "success" });
    } catch {
      toast({ title: "Couldn't copy the link", description: url, status: "error" });
    }
  }

  const groupLink = showGroup && post.groupId && post.groupName;

  return (
    <Flex
      as="article"
      aria-label={`Post by ${post.name}`}
      gap={3}
      px={4}
      py={3}
      borderBottom="1px solid"
      borderColor="border"
      animation={fadeIn}
    >
      <Avatar
        as={RouterLink}
        to={profile}
        size="md"
        flex="none"
        name={post.name}
        src={getImageUrl(post.profileImage)}
        aria-label={post.name}
      />

      <Box flex="1" minW={0}>
        <Flex as="header" align="center" gap={1.5} minH="20px">
          <Flex align="baseline" gap={1.5} minW={0} flex="1" overflow="hidden" whiteSpace="nowrap">
            <Link
              as={RouterLink}
              to={profile}
              color="text-primary"
              fontSize="15px"
              fontWeight={600}
              lineHeight="20px"
              overflow="hidden"
              textOverflow="ellipsis"
              flexShrink={1}
              minW="2ch"
              _hover={{ color: "text-primary", textDecoration: "underline" }}
            >
              {post.name}
            </Link>
            <Dot />
            <Tooltip label={fullTime(post.createdAt)} openDelay={400}>
              <Link
                as={RouterLink}
                to={permalink}
                textStyle="meta"
                color="text-muted"
                flex="none"
                borderRadius="sm"
                _hover={{ color: "text-secondary", textDecoration: "underline" }}
                _focusVisible={{ outline: "none", boxShadow: "outline" }}
              >
                <time dateTime={isoTime(post.createdAt)}>{shortTime(post.createdAt)}</time>
              </Link>
            </Tooltip>
            {post.editedAt && (
              <>
                <Dot />
                <Tooltip label={`Edited ${fullTime(post.editedAt)}`} openDelay={400}>
                  <Text as="span" textStyle="meta" flex="none">
                    edited
                  </Text>
                </Tooltip>
              </>
            )}
            {groupLink && (
              <>
                <Dot />
                <Text as="span" textStyle="meta" overflow="hidden" textOverflow="ellipsis" minW={0}>
                  in{" "}
                  <Link as={RouterLink} to={`/groups/${post.groupId}`} color="text-secondary" fontWeight={500}>
                    {post.groupName}
                  </Link>
                </Text>
              </>
            )}
          </Flex>
          <Box flex="none" mt={-1} mb={-1} mr={-1.5}>
            <Actions
              saved={post.savedByMe}
              canEdit={isAuthor}
              canDelete={isAuthor || canModerate}
              onSave={handleSave}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isLoading}
            />
          </Box>
        </Flex>

        {isEditing ? (
          <PostEditor post={post} onDone={() => setIsEditing(false)} />
        ) : (
          post.description && (
            <Text
              mt={0.5}
              maxW="560px"
              fontSize="15px"
              lineHeight="22px"
              color="text-primary"
              whiteSpace="pre-wrap"
              overflowWrap="anywhere"
            >
              {post.description}
            </Text>
          )
        )}

        {post.image && (
          <>
            <Box
              as="button"
              type="button"
              display="block"
              w="full"
              mt={2.5}
              borderRadius="sm"
              overflow="hidden"
              border="1px solid"
              borderColor="border"
              cursor="zoom-in"
              onClick={lightbox.onOpen}
              aria-label="Open image"
              _focusVisible={{ outline: "none", boxShadow: "outline" }}
            >
              <Image
                src={getImageUrl(post.image)}
                alt=""
                loading="lazy"
                decoding="async"
                w="full"
                maxH="520px"
                objectFit="cover"
                bg="surface-raised"
              />
            </Box>
            <ImageLightbox
              src={getImageUrl(post.image)}
              alt={`Image posted by ${post.name}`}
              isOpen={lightbox.isOpen}
              onClose={lightbox.onClose}
            />
          </>
        )}

        <Flex as="footer" mt={1.5} ml={-2} h="32px" align="center" justify="space-between" maxW="400px">
          <ActionButton
            label={`Replies (${post.commentCount ?? 0})`}
            icon={<LuMessageCircle size={18} />}
            count={post.commentCount ?? 0}
            isActive={showComments}
            aria-expanded={showComments}
            onClick={() => setShowComments((open) => !open)}
          />
          <ActionButton
            label={post.likedByMe ? `Unlike (${post.likeCount} likes)` : `Like (${post.likeCount} likes)`}
            aria-pressed={post.likedByMe}
            isActive={post.likedByMe}
            icon={
              <Box
                as="span"
                key={likePulse}
                display="inline-flex"
                animation={likePulse && post.likedByMe ? likePop : undefined}
              >
                <LuHeart size={18} fill={post.likedByMe ? "currentColor" : "none"} />
              </Box>
            }
            count={post.likeCount}
            onClick={handleLike}
          />
          <ActionButton
            label={post.savedByMe ? "Unsave" : "Save"}
            aria-pressed={post.savedByMe}
            isActive={post.savedByMe}
            icon={<LuBookmark size={18} fill={post.savedByMe ? "currentColor" : "none"} />}
            onClick={handleSave}
          />
          <ActionButton label="Copy link" icon={<LuShare size={18} />} onClick={handleShare} />
        </Flex>

        {showComments && <Comments post={post} autoFocus={!defaultExpanded} />}
      </Box>
    </Flex>
  );
}

export default PostCard;
