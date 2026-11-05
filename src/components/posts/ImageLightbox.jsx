import { Image, Modal, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react";

// Full-size view of a post image. Click outside or press Esc to close.
function ImageLightbox({ src, alt, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="full" motionPreset="scale">
      <ModalOverlay />
      <ModalContent
        bg="transparent"
        _dark={{ bg: "transparent" }}
        border="none"
        boxShadow="none"
        m={0}
        mx={0}
        minH="100dvh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 4, md: 10 }}
        onClick={onClose}
      >
        <ModalCloseButton
          position="fixed"
          top={4}
          right={4}
          bg="surface-raised"
          border="1px solid"
          borderColor="border"
          boxShadow="float"
          color="text-primary"
          _hover={{ bg: "surface", color: "text-primary" }}
        />
        <Image
          src={src}
          alt={alt}
          maxW="100%"
          maxH={{ base: "calc(100dvh - 32px)", md: "calc(100dvh - 80px)" }}
          objectFit="contain"
          borderRadius="sm"
          onClick={(e) => e.stopPropagation()}
        />
      </ModalContent>
    </Modal>
  );
}

export default ImageLightbox;
