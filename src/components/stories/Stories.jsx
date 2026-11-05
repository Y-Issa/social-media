import { Box, Flex, Skeleton, SkeletonCircle, Text, useToast } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { storyKeys, useStoryFeed } from "../../queries/stories";
import StoryRing from "./StoryRing";
import StoryViewer from "./StoryViewer";
import AddStory from "./AddStory";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp)$/i;

const itemProps = {
  as: "button",
  type: "button",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  w: "72px",
  flex: "none",
  borderRadius: "sm",
  _focusVisible: { boxShadow: "outline", outline: "none" },
};

function StoryName({ children, strong }) {
  return (
    <Text
      fontFamily="mono"
      fontSize="11px"
      lineHeight="14px"
      color={strong ? "text-primary" : "text-muted"}
      maxW="72px"
      noOfLines={1}
      wordBreak="break-all"
    >
      {children}
    </Text>
  );
}

// Horizontal strip of story avatars at the top of the home feed. "Your story"
// is always first: it opens your stories when you have some, and its + badge
// (or the whole item, when you have none) starts a new one.
function Stories() {
  const { user } = useAuth();
  const toast = useToast();
  const feedQuery = useStoryFeed();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [openUserId, setOpenUserId] = useState(null);
  const queryClient = useQueryClient();
  // Re-sort the strip (seen users move back) once the viewer closes.
  const closeViewer = useCallback(() => {
    setOpenUserId(null);
    queryClient.invalidateQueries(storyKeys.feed);
  }, [queryClient]);

  const feed = feedQuery.data ?? [];
  const mine = feed.find((g) => g.user.userId === user.userId);
  const others = feed.filter((g) => g.user.userId !== user.userId);

  function pickFile() {
    fileInputRef.current?.click();
  }

  function handleFile(e) {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    if (!picked.type.startsWith("image/") || !IMAGE_EXT_RE.test(picked.name)) {
      toast({ title: "Only images can be shared", description: "Use a JPG, PNG, GIF or WebP file.", status: "error" });
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      toast({ title: "Image is too large", description: "The limit is 5 MB.", status: "error" });
      return;
    }
    setFile(picked);
  }

  return (
    <Box as="section" aria-label="Stories" borderBottom="1px solid" borderColor="border">
      <Flex
        as="ul"
        listStyleType="none"
        gap={2}
        px={4}
        py={3}
        overflowX="auto"
        sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
      >
        <Box as="li" position="relative" flex="none">
          <Box
            {...itemProps}
            onClick={mine ? () => setOpenUserId(user.userId) : pickFile}
            aria-label={mine ? "View your story" : "Add to your story"}
          >
            <StoryRing user={user} state={mine ? (mine.hasUnseen ? "unseen" : "seen") : null} />
            <StoryName strong>Your story</StoryName>
          </Box>
          <Flex
            as="button"
            type="button"
            onClick={pickFile}
            aria-label="Add to your story"
            title="Add to your story"
            position="absolute"
            top="50px"
            left="50px"
            boxSize="20px"
            borderRadius="full"
            bg="accent"
            color="on-accent"
            align="center"
            justify="center"
            boxShadow="0 0 0 2px var(--chakra-colors-bg)"
            _hover={{ bg: "accent-hover" }}
            _focusVisible={{ boxShadow: "0 0 0 2px var(--chakra-colors-bg), 0 0 0 4px var(--chakra-colors-accent)", outline: "none" }}
            // Only a separate control when the avatar itself opens the viewer.
            tabIndex={mine ? 0 : -1}
            aria-hidden={mine ? undefined : true}
          >
            <LuPlus size={14} strokeWidth={2.5} />
          </Flex>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
        </Box>

        {feedQuery.isLoading &&
          [0, 1, 2, 3, 4].map((i) => (
            <Flex as="li" key={i} direction="column" align="center" gap="6px" w="72px" flex="none" aria-hidden="true">
              <SkeletonCircle boxSize="70px" />
              <Skeleton h="10px" w="48px" mt="2px" />
            </Flex>
          ))}

        {others.map((group) => (
          <Box as="li" key={group.user.userId} flex="none">
            <Box
              {...itemProps}
              onClick={() => setOpenUserId(group.user.userId)}
              aria-label={`View story by ${group.user.name}${group.hasUnseen ? ", new" : ""}`}
            >
              <StoryRing user={group.user} state={group.hasUnseen ? "unseen" : "seen"} />
              <StoryName strong={group.hasUnseen}>{group.user.name.split(" ")[0]}</StoryName>
            </Box>
          </Box>
        ))}
      </Flex>

      {openUserId && (
        <StoryViewer feed={feed} startUserId={openUserId} onClose={closeViewer} />
      )}
      {file && <AddStory file={file} onClose={() => setFile(null)} />}
    </Box>
  );
}

export default Stories;
