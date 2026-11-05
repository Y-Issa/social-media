import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Spacer,
  Textarea,
  Tooltip,
  VisuallyHidden,
  useToast,
} from "@chakra-ui/react";
import { LuImage, LuX } from "react-icons/lu";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { uploadImage } from "../../queries/upload";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";
import { useAutoGrow } from "./useAutoGrow";
import CharCount from "./CharCount";

export const MAX_POST_LENGTH = 2000;

// Shared post composer for the home feed and group feeds, flush at the top
// of the feed. createFn({ description, image }) performs the request;
// invalidateKeys are refreshed on success. The left rail's "New post" button
// focuses the textarea by its id.
function Composer({
  createFn,
  invalidateKeys = [],
  placeholder = "What's on your mind?",
  id = "composer",
}) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);
  const textareaRef = useAutoGrow(description);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const mutation = useMutation({
    mutationFn: async () => {
      // Upload first; the post only references the stored filename.
      const image = file ? await uploadImage(file) : "";
      return createFn({ description: description.trim(), image });
    },
    onSuccess: () => {
      // Only clear once the server has the post.
      setDescription("");
      clearFile();
      invalidateKeys.forEach((key) => queryClient.invalidateQueries(key));
    },
    onError: (error) => {
      toast({ title: "Couldn't publish", description: errorMessage(error), status: "error" });
    },
  });

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const tooLong = description.length > MAX_POST_LENGTH;
  const isEmpty = !description.trim() && !file;

  function handleSubmit(e) {
    e.preventDefault();
    if (isEmpty || tooLong || mutation.isLoading) return;
    mutation.mutate();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e);
  }

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit}
      gap={3}
      px={4}
      pt={3}
      pb={2}
      borderBottom="1px solid"
      borderColor="border"
    >
      <Avatar size="md" flex="none" name={user.name} src={getImageUrl(user.profileImage)} />
      <Box flex="1" minW={0}>
        <VisuallyHidden as="label" htmlFor={id}>
          New post
        </VisuallyHidden>
        <Textarea
          ref={textareaRef}
          id={id}
          variant="unstyled"
          placeholder={placeholder}
          rows={1}
          resize="none"
          fontSize="17px"
          lineHeight="24px"
          minH="48px"
          py="8px"
          px={0}
          borderRadius={0}
          color="text-primary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          isDisabled={mutation.isLoading}
          _disabled={{ opacity: 0.6 }}
        />

        {previewUrl && (
          <Box position="relative" mt={2} mb={1} w="fit-content" maxW="full">
            <Image
              src={previewUrl}
              alt="Selected image"
              maxH="240px"
              borderRadius="sm"
              border="1px solid"
              borderColor="border"
              objectFit="cover"
            />
            <IconButton
              size="xs"
              position="absolute"
              top={2}
              right={2}
              variant="ghost"
              bg="surface-raised"
              border="1px solid"
              borderColor="border"
              boxShadow="float"
              color="text-primary"
              _hover={{ bg: "bg" }}
              icon={<LuX size={14} />}
              onClick={clearFile}
              aria-label="Remove image"
              isDisabled={mutation.isLoading}
            />
          </Box>
        )}

        <Flex align="center" gap={2} mt={1} ml={-2}>
          <Tooltip label="Add image" openDelay={300}>
            <IconButton
              size="sm"
              variant="ghost"
              icon={<LuImage size={18} />}
              aria-label="Add image"
              onClick={() => fileInputRef.current?.click()}
              isDisabled={mutation.isLoading}
            />
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          <Spacer />
          <CharCount length={description.length} max={MAX_POST_LENGTH} />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={mutation.isLoading}
            isDisabled={isEmpty || tooLong}
          >
            Post
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Composer;
