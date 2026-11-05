import { Avatar, Flex, IconButton, Input, useToast } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment, commentKeys } from "../../queries/comments";
import { bumpCommentCount } from "../../queries/postCache";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";

export const MAX_COMMENT_LENGTH = 1000;

// Flush single-line reply input at the end of a thread.
function CommentForm({ postId, user, autoFocus = false }) {
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: (newComment) => addComment({ postId, newComment }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries(commentKeys.post(postId));
      // Keep the count on the post in every cached list in step.
      bumpCommentCount(queryClient, postId, 1);
    },
    onError: (error) => {
      toast({ title: "Couldn't post reply", description: errorMessage(error), status: "error" });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim() || mutation.isLoading) return;
    mutation.mutate({ description: comment.trim() });
  }

  return (
    <Flex as="form" onSubmit={handleSubmit} gap={2.5} align="center">
      <Avatar size="sm" flex="none" name={user.name} src={getImageUrl(user.profileImage)} />
      <Input
        variant="flushed"
        h="32px"
        fontSize="14px"
        px={0}
        placeholder="Write a reply"
        aria-label="Write a reply"
        value={comment}
        maxLength={MAX_COMMENT_LENGTH}
        onChange={(e) => setComment(e.target.value)}
        autoFocus={autoFocus}
        isReadOnly={mutation.isLoading}
      />
      <IconButton
        type="submit"
        size="sm"
        variant="ghost"
        color={comment.trim() ? "accent" : undefined}
        icon={<LuSend size={16} />}
        isLoading={mutation.isLoading}
        isDisabled={!comment.trim()}
        aria-label="Send reply"
      />
    </Flex>
  );
}

export default CommentForm;
