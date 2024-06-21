import {
  Avatar,
  Button,
  FormControl,
  Input,
  InputGroup,
  ModalFooter,
} from "@chakra-ui/react";
import { HiOutlineChevronDoubleRight } from "react-icons/hi2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

function CommentForm({ postId, comment, setComment, user }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post(`/comments/${postId}`, newComment, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate({ description: comment });
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <ModalFooter>
        <FormControl>
          <InputGroup gap="10px" alignItems="center">
            <Avatar size="sm" src={user.profileImage} />
            <Input
              placeholder="Type your comment..."
              borderColor="bgColor.400"
              focusBorderColor="primary.100"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              bgColor="primary.500"
              color="primary.50"
              _hover={{ bgColor: "primary.600" }}
              type="submit"
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
