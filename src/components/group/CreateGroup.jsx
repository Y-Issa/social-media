import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../../queries/groups";

function CreateGroup() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const mutation = useMutation(createGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["joinedGroups"]);
      toast({
        title: "Group created.",
        description: `Group "${data.name}" created successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setName("");
      setDescription("");
      setImage("");
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while creating the group.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, description, image });
  };

  return (
    <>
      <Button onClick={onOpen} mt="20px" colorScheme="primary" w="full">
        Create New Group
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent color="textColor.100" bgColor="bgColor.100" p="15px">
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Group Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                />
              </FormControl>
              <FormControl isRequired mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Image URL</FormLabel>
                <Input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  focusBorderColor="primary.100"
                  borderColor="bgColor.400"
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme="primary"
                isLoading={mutation.isLoading}
                type="submit"
                w="full"
              >
                Create Group
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateGroup;
