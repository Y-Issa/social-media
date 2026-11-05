import { Box } from "@chakra-ui/react";
import { forwardRef } from "react";

// Centered 9:16 frame shared by the viewer and the add-story preview. It
// fills the viewport height up to 90vh and shrinks to fit narrow screens.
export const FRAME_WIDTH = "min(calc(100vw - 16px), calc(90dvh * 9 / 16))";

const StoryFrame = forwardRef(function StoryFrame({ children, ...props }, ref) {
  return (
    <Box
      ref={ref}
      position="relative"
      w={FRAME_WIDTH}
      sx={{ aspectRatio: "9 / 16" }}
      maxH="90dvh"
      bg="#0B0B0A"
      borderRadius="md"
      overflow="hidden"
      color="#ECE9E1"
      userSelect="none"
      {...props}
    >
      {children}
    </Box>
  );
});

// The story image, letterboxed on black so nothing is cropped.
export function StoryImage({ src, alt, ...props }) {
  return (
    <Box
      as="img"
      src={src}
      alt={alt}
      position="absolute"
      inset={0}
      w="100%"
      h="100%"
      objectFit="contain"
      draggable={false}
      {...props}
    />
  );
}

// Translucent band behind text laid over the image (no gradients, per DESIGN.md).
export const scrim = "rgba(11, 11, 10, 0.55)";

export default StoryFrame;
