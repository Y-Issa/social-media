import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "../Loading";
import { makeRequest } from "../../axios";
import CommentList from "./commentList";
import CommentForm from "./CommentForm";

function CommentsModal({ postId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      const res = await makeRequest.get(`/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: isOpen,
  });

  return (
    <>
      <Button
        variant="ghost"
        _hover={{
          color: "primary.500",
        }}
        p="0px"
        onClick={onOpen}
      >
        <HiOutlineChatBubbleOvalLeftEllipsis fontSize="24px" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color="textColor.100" bgColor="bgColor.100">
          <ModalHeader>
            <Heading size="md">Comments</Heading>
          </ModalHeader>
          <ModalBody px="15px">
            {isLoading ? <Loading /> : <CommentList comments={data} />}
          </ModalBody>
          <CommentForm
            postId={postId}
            comment={comment}
            setComment={setComment}
            user={user}
          />
        </ModalContent>
      </Modal>
    </>
  );
}

export default CommentsModal;
