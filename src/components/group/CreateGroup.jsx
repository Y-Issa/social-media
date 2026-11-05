import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../../queries/groups";
import { errorMessage } from "../../axios";
import FormControlInput from "../FormControlInput";
import FormError from "../ui/FormError";

const DESCRIPTION_MAX = 280;

// "New group" button + modal. `buttonProps` lets callers restyle the trigger.
function CreateGroup({ buttonProps, label = "New group" }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);

  const errors = {
    name: name.trim() ? null : "Give the group a name.",
    description: !description.trim()
      ? "Add a short description."
      : description.length > DESCRIPTION_MAX
      ? `Keep it under ${DESCRIPTION_MAX} characters.`
      : null,
  };

  function reset() {
    setName("");
    setDescription("");
    setImage("");
    setSubmitted(false);
    setServerError(null);
  }

  const mutation = useMutation(createGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["joinedGroups"]);
      toast({ title: `“${data?.name ?? name}” created.`, status: "success" });
      reset();
      onClose();
    },
    onError: (error) =>
      setServerError(errorMessage(error, "Couldn't create the group.")),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.description) return;
    mutation.mutate({ name: name.trim(), description: description.trim(), image: image.trim() });
  };

  return (
    <>
      <Button
        onClick={onOpen}
        variant="primary"
        size="sm"
        leftIcon={<LuPlus size={16} />}
        {...buttonProps}
      >
        {label}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit} noValidate>
          <ModalHeader>New group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControlInput
                label="Name"
                name="name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={submitted && errors.name}
                isRequired
              />
              <FormControl isRequired isInvalid={Boolean(submitted && errors.description)}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  resize="vertical"
                  placeholder="What's this group about?"
                />
                {submitted && errors.description ? (
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                ) : (
                  <FormHelperText display="flex" justifyContent="flex-end">
                    <Text as="span" textStyle="meta" color={description.length > DESCRIPTION_MAX ? "danger" : "text-muted"}>
                      {description.length}/{DESCRIPTION_MAX}
                    </Text>
                  </FormHelperText>
                )}
              </FormControl>
              <FormControlInput
                label="Image URL"
                name="image"
                placeholder="https://"
                helper="Optional. Shown as a small square next to the name."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <FormError>{serverError}</FormError>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={mutation.isLoading}>
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateGroup;
