import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CloseButton,
  HStack,
  Img,
  Input,
  Spacer,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { uploadImage } from "../../queries/upload";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";

export const MAX_POST_LENGTH = 2000;

// Shared post composer for the home feed and group feeds.
// createFn({ description, image }) performs the request; invalidateKeys are
// refreshed on success.
function Composer({ createFn, invalidateKeys = [], placeholder = "What's on your mind?" }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const mutation = useMutation({
    mutationFn: async () => {
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

  return (
    <Card
      as="form"
      onSubmit={handleSubmit}
      mb="30px"
      color="textColor.100"
      bgColor="bgColor.50"
      borderRadius="2xl"
      mx={{ base: "10px", lg: "35px" }}
    >
      <CardBody>
        <HStack align="start">
          <Avatar size="md" name={user.name} src={getImageUrl(user.profileImage)} />
          <Textarea
            placeholder={placeholder}
            bgColor="bgColor.50"
            focusBorderColor="primary.100"
            border="none"
            resize="none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </HStack>
        {previewUrl && (
          <Box position="relative" mt={3} w="fit-content">
            <Img src={previewUrl} alt="Selected image" maxH="200px" borderRadius="md" />
            <CloseButton
              size="sm"
              position="absolute"
              top={1}
              right={1}
              bg="blackAlpha.600"
              color="white"
              onClick={clearFile}
              aria-label="Remove image"
            />
          </Box>
        )}
      </CardBody>
      <CardFooter pt={0}>
        <HStack w="full">
          <Button
            variant="ghost"
            textColor="textColor.200"
            _hover={{ bgColor: "bgColor.100" }}
            onClick={() => fileInputRef.current?.click()}
          >
            Add Image
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            display="none"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          <Spacer />
          {description.length > MAX_POST_LENGTH - 200 && (
            <Text fontSize="sm" color={tooLong ? "red.500" : "textColor.300"}>
              {MAX_POST_LENGTH - description.length}
            </Text>
          )}
          <Button
            type="submit"
            colorScheme="primary"
            isLoading={mutation.isLoading}
            isDisabled={isEmpty || tooLong}
          >
            Post
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  );
}

export default Composer;
