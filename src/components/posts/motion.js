import { keyframes } from "@chakra-ui/react";

// See DESIGN.md "Motion". The theme's global prefers-reduced-motion rule
// collapses these to a single frame.
export const ease = "cubic-bezier(.2,.8,.2,1)";

const fadeInFrames = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const likePopFrames = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.18); }
  100% { transform: scale(1); }
`;

export const fadeIn = `${fadeInFrames} 160ms ${ease} backwards`;
export const likePop = `${likePopFrames} 200ms ${ease}`;
