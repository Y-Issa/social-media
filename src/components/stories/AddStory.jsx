import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VisuallyHidden,
  usePrefersReducedMotion,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { errorMessage } from "../../axios";
import { STORY_CAPTION_MAX, useCreateStory } from "../../queries/stories";
import CharCount from "../posts/CharCount";
import StoryFrame, { StoryImage, scrim } from "./StoryFrame";

// Preview of a picked image in the story frame, with an optional caption.
// "Share" uploads the file and creates the story.
function AddStory({ file, onClose }) {
  const [caption, setCaption] = useState("");
  const toast = useToast();
  const reducedMotion = usePrefersReducedMotion();
  const mutation = useCreateStory();

  // Created in an effect (not useMemo) so StrictMode's mount/unmount/mount
  // doesn't revoke the URL the preview is still using.
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const tooLong = caption.length > STORY_CAPTION_MAX;

  function handleSubmit(e) {
    e.preventDefault();
    if (tooLong || mutation.isLoading) return;
    mutation.mutate(
      { file, caption: caption.trim() },
      {
        onSuccess: () => {
          toast({ title: "Story shared.", status: "success" });
          onClose();
        },
        onError: (error) =>
          toast({ title: "Couldn't share story", description: errorMessage(error), status: "error" }),
      }
    );
  }

  return (
    <Modal
      isOpen
      onClose={() => !mutation.isLoading && onClose()}
      size="full"
      motionPreset={reducedMotion ? "none" : "scale"}
    >
      <ModalOverlay bg="rgba(8, 8, 7, 0.94)" />
      <ModalContent
        data-theme="dark"
        bg="transparent"
        _dark={{ bg: "transparent" }}
        border="none"
        boxShadow="none"
        m={0}
        minH="100dvh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        aria-label="New story"
      >
        <StoryFrame as="form" onSubmit={handleSubmit} userSelect="auto">
          {previewUrl && <StoryImage src={previewUrl} alt="Story preview" />}

          <Flex position="absolute" top={0} left={0} right={0} align="center" bg={scrim} px={3} py={2} zIndex={1}>
            <Text textStyle="label" color="#B9B5AA">
              New story
            </Text>
            <Box flex="1" />
            <IconButton
              size="sm"
              variant="ghost"
              color="#ECE9E1"
              _hover={{ bg: "whiteAlpha.200" }}
              icon={<LuX size={18} />}
              aria-label="Discard story"
              onClick={onClose}
              isDisabled={mutation.isLoading}
            />
          </Flex>

          <Box position="absolute" bottom={0} left={0} right={0} bg={scrim} px={3} py={3} zIndex={1}>
            <VisuallyHidden as="label" htmlFor="story-caption">
              Caption
            </VisuallyHidden>
            <Flex align="center" gap={2}>
              <Input
                id="story-caption"
                placeholder="Add a caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                isDisabled={mutation.isLoading}
                isInvalid={tooLong}
                autoComplete="off"
                flex="1"
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={mutation.isLoading}
                isDisabled={tooLong}
                flex="none"
              >
                Share
              </Button>
            </Flex>
            <Flex justify="flex-end" mt={caption.length > STORY_CAPTION_MAX - 40 ? 1 : 0}>
              <CharCount length={caption.length} max={STORY_CAPTION_MAX} warnAt={40} />
            </Flex>
          </Box>
        </StoryFrame>
      </ModalContent>
    </Modal>
  );
}

export default AddStory;
