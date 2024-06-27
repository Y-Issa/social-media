import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "../Loading";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { fetchComments } from "../../queries/comments";

function CommentsModal({ postId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  return (
    <>
      <Button
        variant="ghost"
        _hover={{
          color: "primary.500",
        }}
        _active={{
          color: "primary.500",
        }}
        p="0px"
        onClick={onOpen}
      >
        <HiOutlineChatBubbleOvalLeftEllipsis fontSize="24px" />
        <Text ml={1}>{data?.length === 0 ? "" : data?.length} comments</Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent color="textColor.100" bgColor="bgColor.100">
          <ModalHeader>
            <Heading size="md">Comments</Heading>
          </ModalHeader>
          <ModalBody
            px="15px"
            sx={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "bgColor.200",
                borderRadius: "24px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "bgColor.300",
              },
            }}
          >
            {isLoading ? (
              <Loading />
            ) : error ? (
              <Text color="red.500">
                Failed to load comments. Please try again later.
              </Text>
            ) : (
              <CommentList comments={data} />
            )}
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
