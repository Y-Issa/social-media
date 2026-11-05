import { Avatar, Box } from "@chakra-ui/react";
import { getImageUrl } from "../../imageUrl";

// 64px avatar inside a ring: 2px accent when there's something unseen,
// 1px border-strong once everything has been seen, none when `state` is null.
// A 2px gap in the page background separates ring and photo.
function StoryRing({ user, state, size = 64 }) {
  const ring =
    state === "unseen"
      ? "0 0 0 2px var(--chakra-colors-accent)"
      : state === "seen"
        ? "0 0 0 1px var(--chakra-colors-border-strong)"
        : "none";

  return (
    <Box
      borderRadius="full"
      p="3px"
      boxShadow={ring}
      transition="box-shadow 120ms cubic-bezier(.2,.8,.2,1)"
    >
      <Avatar
        name={user.name}
        src={getImageUrl(user.profileImage)}
        w={`${size}px`}
        h={`${size}px`}
        fontSize={`${Math.round(size / 3.2)}px`}
        display="flex"
      />
    </Box>
  );
}

export default StoryRing;
