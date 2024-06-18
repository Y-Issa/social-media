import {
  Avatar,
  Button,
  FormControl,
  Heading,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";
import { useAuth } from "../../contexts/AuthContext";

function CommentsModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useAuth();
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
          <ModalBody>
            <p>Comments will be displayed here</p>
            <p>Comments will be displayed here</p>
            <p>Comments will be displayed here</p>
            <p>Comments will be displayed here</p>
          </ModalBody>
          <ModalFooter>
            <FormControl>
              <InputGroup gap="10px" alignItems="center">
                <Avatar size="sm" src={user.image} />
                <Input
                  placeholder="Type your comment..."
                  borderColor="bgColor.400"
                  focusBorderColor="primary.100"
                />
                <Button
                  bgColor="primary.500"
                  color="primary.50"
                  _hover={{ bgColor: "primary.600" }}
                >
                  <HiOutlineChevronDoubleRight />
                </Button>
              </InputGroup>
            </FormControl>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CommentsModal;
