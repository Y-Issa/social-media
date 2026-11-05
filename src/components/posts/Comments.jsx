import { Box, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { commentKeys, deleteComment, fetchComments } from "../../queries/comments";
import { bumpCommentCount } from "../../queries/postCache";
import { errorMessage } from "../../axios";
import ConfirmDialog from "../ConfirmDialog";
import CommentList, { CommentSkeleton } from "./CommentList";
import CommentForm from "./CommentForm";
import { fadeIn } from "./motion";

// Inline thread under a post. Comments are fetched only while it's open.
// You can delete your own comments, and any comment on your own post.
// autoFocus focuses the reply input (when the thread was opened by a click).
function Comments({ post, autoFocus = true }) {
  const { postId } = post;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [pending, setPending] = useState(null);

  const { isLoading, error, data: comments } = useQuery({
    queryKey: commentKeys.post(postId),
    queryFn: () => fetchComments(postId),
  });

  const deleteMutation = useMutation({
    mutationFn: (comment) => deleteComment(comment.commentId),
    onSuccess: (_data, comment) => {
      queryClient.setQueryData(commentKeys.post(postId), (list) =>
        list?.filter((c) => c.commentId !== comment.commentId)
      );
      bumpCommentCount(queryClient, postId, -1);
      setPending(null);
      toast({ title: "Reply deleted.", status: "success" });
    },
    onError: (err) =>
      toast({ title: "Couldn't delete reply", description: errorMessage(err), status: "error" }),
  });

  const ownPost = post.userId === user.userId;
  const canDelete = (comment) => ownPost || comment.userId === user.userId;

  return (
    <Box as="section" aria-label="Replies" pt={2} pb={1} animation={fadeIn}>
      {isLoading ? (
        <CommentSkeleton count={Math.min(post.commentCount || 1, 3)} />
      ) : error ? (
        <Text fontSize="13px" color="danger" pb={3}>
          {errorMessage(error, "Couldn't load replies.")}
        </Text>
      ) : (
        <CommentList comments={comments ?? []} canDelete={canDelete} onDelete={setPending} />
      )}
      <CommentForm postId={postId} user={user} autoFocus={autoFocus} />

      <ConfirmDialog
        isOpen={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={() => pending && deleteMutation.mutate(pending)}
        isLoading={deleteMutation.isLoading}
        title="Delete reply?"
        body={
          pending && pending.userId !== user.userId
            ? `This removes ${pending.name}'s reply from your post.`
            : "This can't be undone."
        }
      />
    </Box>
  );
}

export default Comments;
