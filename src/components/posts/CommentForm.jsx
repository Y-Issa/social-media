import {
  Avatar,
  Button,
  FormControl,
  Input,
  InputGroup,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../../queries/comments";
import { updatePostInCaches } from "../../queries/postCache";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";

export const MAX_COMMENT_LENGTH = 1000;

function CommentForm({ postId, comment, setComment, user }) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: (newComment) => addComment({ postId, newComment }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries(["comments", postId]);
      // Keep the count on the post in every cached list in step.
      updatePostInCaches(queryClient, postId, (post) => ({
        ...post,
        commentCount: (post.commentCount ?? 0) + 1,
      }));
    },
    onError: (error) => {
      toast({ title: "Couldn't post comment", description: errorMessage(error), status: "error" });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim() || mutation.isLoading) return;
    mutation.mutate({ description: comment.trim() });
  }

  return (
    <form onSubmit={handleSubmit}>
      <ModalFooter>
        <FormControl>
          <InputGroup gap="10px" alignItems="center">
            <Avatar size="sm" name={user.name} src={getImageUrl(user.profileImage)} />
            <Input
              placeholder="Type your comment..."
              borderColor="bgColor.400"
              focusBorderColor="primary.100"
              value={comment}
              maxLength={MAX_COMMENT_LENGTH}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              colorScheme="primary"
              type="submit"
              isLoading={mutation.isLoading}
              isDisabled={!comment.trim()}
              aria-label="Send comment"
            >
              <HiOutlineChevronDoubleRight />
            </Button>
          </InputGroup>
        </FormControl>
      </ModalFooter>
    </form>
  );
}

export default CommentForm;
