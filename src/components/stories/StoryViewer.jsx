import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VisuallyHidden,
  usePrefersReducedMotion,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { LuChevronLeft, LuChevronRight, LuEye, LuMoreHorizontal, LuTrash2, LuX } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";
import { fullTime, shortTime } from "../posts/time";
import {
  STORY_DURATION_MS,
  useDeleteStory,
  useStoryViewers,
  useViewStory,
} from "../../queries/stories";
import ConfirmDialog from "../ConfirmDialog";
import StoryFrame, { StoryImage, scrim } from "./StoryFrame";
import StoryViewers from "./StoryViewers";

const TAP_MAX_MS = 250;

// First unseen story of a group, or its first story.
function startIndex(group) {
  const i = group.stories.findIndex((s) => !s.viewed);
  return i === -1 ? 0 : i;
}

function useTabVisible() {
  const [visible, setVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}

// Drives the active progress segment with rAF (linear, no easing) and calls
// onDone after STORY_DURATION_MS of un-paused time. `runKey` restarts it.
function useStoryTimer({ runKey, paused, onDone, barRef }) {
  const elapsed = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // The active segment's width is driven inline. When another segment becomes
  // active, the previous one drops its inline width so its class (100% for
  // past, 0% for upcoming) applies again.
  const driven = useRef(null);
  useEffect(() => {
    const el = barRef.current;
    if (driven.current && driven.current !== el) driven.current.style.width = "";
    driven.current = el;
    elapsed.current = 0;
    if (el) el.style.width = "0%";
  }, [runKey, barRef]);

  useEffect(() => {
    if (paused) return undefined;
    let last = performance.now();
    let frame;
    const tick = (now) => {
      elapsed.current += now - last;
      last = now;
      const pct = Math.min(100, (elapsed.current / STORY_DURATION_MS) * 100);
      if (barRef.current) {
        driven.current = barRef.current;
        barRef.current.style.width = `${pct}%`;
      }
      if (elapsed.current >= STORY_DURATION_MS) {
        onDoneRef.current();
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, runKey, barRef]);
}

// Full-screen story player. `feed` is the live story feed; the order of users
// is frozen when the viewer opens so marking stories seen doesn't reshuffle it.
function StoryViewer({ feed, startUserId, onClose }) {
  const { user: me } = useAuth();
  const toast = useToast();
  const reducedMotion = usePrefersReducedMotion();
  const tabVisible = useTabVisible();

  // Your own stories only play when you open them; everyone else's play in
  // strip order, so arrows and auto-advance walk the strip.
  const [order] = useState(() =>
    feed
      .map((g) => g.user.userId)
      .filter((id) => id === startUserId || id !== me.userId)
  );
  const groups = useMemo(() => {
    const byId = new Map(feed.map((g) => [g.user.userId, g]));
    return order.map((id) => byId.get(id)).filter(Boolean);
  }, [feed, order]);

  const [pos, setPos] = useState(() => {
    const group = feed.find((g) => g.user.userId === startUserId);
    return { userId: startUserId, index: group ? startIndex(group) : 0, run: 0 };
  });
  const userIdx = groups.findIndex((g) => g.user.userId === pos.userId);
  const group = groups[userIdx];
  const story = group?.stories[Math.min(pos.index, group.stories.length - 1)];
  const storyIdx = group ? group.stories.indexOf(story) : -1;
  const isOwn = group?.user.userId === me.userId;

  const [loadedId, setLoadedId] = useState(null);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [viewersOpen, setViewersOpen] = useState(false);
  const pressStart = useRef(0);
  const barRef = useRef(null);
  const closeRef = useRef(null);

  const viewMutation = useViewStory();
  const deleteMutation = useDeleteStory();
  const viewers = useStoryViewers(story?.storyId, isOwn);

  // Nothing left to show (e.g. every story was deleted or expired).
  useEffect(() => {
    if (!story) onClose();
  }, [story, onClose]);

  const goToGroup = useCallback(
    (idx, atEnd = false) => {
      const target = groups[idx];
      if (!target) return onClose();
      setPos({
        userId: target.user.userId,
        index: atEnd ? target.stories.length - 1 : startIndex(target),
        run: 0,
      });
    },
    [groups, onClose]
  );

  const next = useCallback(() => {
    if (!group) return;
    if (storyIdx < group.stories.length - 1) {
      setPos((p) => ({ ...p, index: storyIdx + 1, run: 0 }));
    } else {
      goToGroup(userIdx + 1);
    }
  }, [group, storyIdx, userIdx, goToGroup]);

  const prev = useCallback(() => {
    if (!group) return;
    if (storyIdx > 0) {
      setPos((p) => ({ ...p, index: storyIdx - 1, run: 0 }));
    } else if (userIdx > 0) {
      goToGroup(userIdx - 1, true);
    } else {
      // First story overall: restart it.
      setPos((p) => ({ ...p, run: p.run + 1 }));
    }
  }, [group, storyIdx, userIdx, goToGroup]);

  const loaded = story && loadedId === story.storyId;
  const paused =
    !loaded || pressed || hovered || !tabVisible || menuOpen || confirmOpen || viewersOpen;

  useStoryTimer({
    runKey: `${story?.storyId}:${pos.run}`,
    paused,
    onDone: next,
    barRef,
  });

  // Mark seen once the image is actually on screen.
  const viewStory = viewMutation.mutate;
  const requested = useRef(new Set());
  useEffect(() => {
    if (!loaded || story.viewed || requested.current.has(story.storyId)) return;
    requested.current.add(story.storyId);
    viewStory(story.storyId);
  }, [loaded, story, viewStory]);

  // Arrow keys navigate; Esc is handled by the Modal.
  useEffect(() => {
    const onKey = (e) => {
      if (confirmOpen || menuOpen) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, confirmOpen, menuOpen]);

  function handlePointerDown(e) {
    if (e.button !== 0) return;
    pressStart.current = performance.now();
    setPressed(true);
  }

  function handlePointerUp(e) {
    if (!pressed) return;
    setPressed(false);
    if (performance.now() - pressStart.current > TAP_MAX_MS) return; // a hold, not a tap
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 3) prev();
    else next();
  }

  function handleDelete() {
    const deleted = story;
    const remaining = group.stories.length - 1;
    deleteMutation.mutate(deleted.storyId, {
      onSuccess: () => {
        setConfirmOpen(false);
        toast({ title: "Story deleted.", status: "success" });
        if (remaining > 0) {
          setPos((p) => ({ ...p, index: Math.min(storyIdx, remaining - 1), run: 0 }));
        } else {
          goToGroup(userIdx + 1);
        }
      },
      onError: (error) =>
        toast({ title: "Couldn't delete story", description: errorMessage(error), status: "error" }),
    });
  }

  if (!story) return null;

  const viewerCount = viewers.data?.length;

  return (
    <Modal
      isOpen
      onClose={onClose}
      initialFocusRef={closeRef}
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
        aria-label={`Stories by ${group.user.name}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <Flex align="center" gap={4}>
          <IconButton
            display={{ base: "none", md: "inline-flex" }}
            variant="ghost"
            color="#ECE9E1"
            _hover={{ bg: "whiteAlpha.200" }}
            icon={<LuChevronLeft size={22} />}
            aria-label="Previous story"
            onClick={prev}
            isDisabled={userIdx === 0 && storyIdx === 0}
          />

          <StoryFrame
            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
            onPointerLeave={() => {
              setHovered(false);
              setPressed(false);
            }}
          >
            <StoryImage
              key={story.storyId}
              src={getImageUrl(story.image)}
              alt={story.caption || `Story by ${group.user.name}`}
              onLoad={() => setLoadedId(story.storyId)}
              onError={() => setLoadedId(story.storyId)}
            />

            {/* Tap zones: left third = previous, the rest = next; hold to pause. */}
            <Box
              position="absolute"
              inset={0}
              zIndex={1}
              cursor="pointer"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => setPressed(false)}
              onContextMenu={(e) => e.preventDefault()}
              sx={{ touchAction: "manipulation" }}
            />

            {/* Header */}
            <Box position="absolute" top={0} left={0} right={0} zIndex={2} bg={scrim} px={3} pt={2} pb={2}>
              <Flex gap="4px" mb={2} aria-hidden="true">
                {group.stories.map((s, i) => (
                  <Box key={s.storyId} flex="1" h="2px" bg="whiteAlpha.400" borderRadius="full" overflow="hidden">
                    <Box
                      ref={i === storyIdx ? barRef : undefined}
                      h="100%"
                      bg="#ECE9E1"
                      w={i < storyIdx ? "100%" : "0%"}
                    />
                  </Box>
                ))}
              </Flex>
              <Flex align="center" gap={2}>
                <Avatar size="sm" name={group.user.name} src={getImageUrl(group.user.profileImage)} />
                <Text
                  as={RouterLink}
                  to={`/profile/${group.user.userId}`}
                  onClick={onClose}
                  fontSize="13px"
                  lineHeight="18px"
                  fontWeight={600}
                  noOfLines={1}
                  _hover={{ textDecoration: "underline" }}
                >
                  {isOwn ? "Your story" : group.user.name}
                </Text>
                <Text
                  as="time"
                  dateTime={story.createdAt}
                  title={fullTime(story.createdAt)}
                  fontFamily="mono"
                  fontSize="12px"
                  color="#B9B5AA"
                  flex="none"
                >
                  {shortTime(story.createdAt)}
                </Text>
                <Box flex="1" />
                {isOwn && (
                  <Menu placement="bottom-end" onOpen={() => setMenuOpen(true)} onClose={() => setMenuOpen(false)}>
                    <MenuButton
                      as={IconButton}
                      size="sm"
                      variant="ghost"
                      color="#ECE9E1"
                      _hover={{ bg: "whiteAlpha.200" }}
                      _active={{ bg: "whiteAlpha.300" }}
                      icon={<LuMoreHorizontal size={18} />}
                      aria-label="Story options"
                    />
                    <MenuList minW="160px" color="text-primary">
                      <MenuItem icon={<LuTrash2 size={16} />} color="danger" onClick={() => setConfirmOpen(true)}>
                        Delete story
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
                <IconButton
                  ref={closeRef}
                  size="sm"
                  variant="ghost"
                  color="#ECE9E1"
                  _hover={{ bg: "whiteAlpha.200" }}
                  icon={<LuX size={18} />}
                  aria-label="Close stories"
                  onClick={onClose}
                />
              </Flex>
            </Box>

            {/* Footer: caption and, on your own story, who has seen it */}
            {(story.caption || isOwn) && (
              <Box position="absolute" bottom={0} left={0} right={0} zIndex={2} bg={scrim} px={4} py={3}>
                {story.caption && (
                  <Text fontSize="15px" lineHeight="22px" whiteSpace="pre-wrap" wordBreak="break-word">
                    {story.caption}
                  </Text>
                )}
                {isOwn && (
                  <Flex
                    as="button"
                    type="button"
                    align="center"
                    gap={2}
                    mt={story.caption ? 2 : 0}
                    fontFamily="mono"
                    fontSize="12px"
                    color="#B9B5AA"
                    _hover={{ color: "#ECE9E1" }}
                    onClick={() => setViewersOpen(true)}
                  >
                    <LuEye size={16} />
                    {viewerCount === undefined ? "Seen by …" : `Seen by ${viewerCount}`}
                  </Flex>
                )}
              </Box>
            )}

            {viewersOpen && (
              <StoryViewers query={viewers} onClose={() => setViewersOpen(false)} />
            )}
          </StoryFrame>

          <IconButton
            display={{ base: "none", md: "inline-flex" }}
            variant="ghost"
            color="#ECE9E1"
            _hover={{ bg: "whiteAlpha.200" }}
            icon={<LuChevronRight size={22} />}
            aria-label="Next story"
            onClick={next}
          />
        </Flex>

        <VisuallyHidden aria-live="polite">
          {`Story ${storyIdx + 1} of ${group.stories.length} by ${group.user.name}`}
        </VisuallyHidden>
      </ModalContent>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isLoading}
        title="Delete this story?"
        body="It will be removed for everyone right away."
      />
    </Modal>
  );
}

export default StoryViewer;
