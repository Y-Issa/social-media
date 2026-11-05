import {
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { LuPenSquare } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Wordmark from "../ui/Wordmark";
import SoonTag from "../ui/SoonTag";
import UserMenu from "./UserMenu";
import { getNavItems, soonItems } from "./navItems";
import { useNewPost } from "./useNewPost";
import UnreadBadge, { badgeText } from "../notifications/UnreadBadge";
import { useUnreadCount } from "../../queries/notifications";
import { useMessagesUnreadCount } from "../../queries/messages";

// Shown as a 72px icon rail between md and xl, full 240px rail from xl.
const full = { base: "none", xl: "flex" };
const iconOnly = { base: "flex", xl: "none" };

function RailItem({ item, isRail, unread = 0 }) {
  const Icon = item.icon;
  const label = unread ? `${item.label}, ${badgeText(unread)} unread` : item.label;
  return (
    <Tooltip label={item.label} placement="right" isDisabled={!isRail} openDelay={300}>
      <Box
        as={NavLink}
        to={item.to}
        end={item.end}
        aria-label={label}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent={{ base: "center", xl: "flex-start" }}
        gap={3}
        h="40px"
        px={{ base: 0, xl: 3 }}
        w="full"
        borderRadius="sm"
        color="text-secondary"
        fontSize="15px"
        fontWeight={500}
        transition="color 120ms, background 120ms"
        _hover={{ color: "text-primary", bg: "surface-raised" }}
        _focusVisible={{ boxShadow: "outline", outline: "none" }}
        sx={{
          "&.active": { color: "text-primary", fontWeight: 600 },
          "&.active::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: "8px",
            bottom: "8px",
            w: "2px",
            bg: "accent",
            borderRadius: "1px",
          },
        }}
      >
        <Box as="span" position="relative" display="inline-flex">
          <Icon size={20} aria-hidden />
          <UnreadBadge count={unread} variant="dot" top="-1px" right="-2px" display={iconOnly} />
        </Box>
        <Text as="span" display={full}>
          {item.label}
        </Text>
        <UnreadBadge count={unread} ml="auto" display={{ base: "none", xl: "inline-flex" }} />
      </Box>
    </Tooltip>
  );
}

function SoonItem({ item }) {
  const Icon = item.icon;
  return (
    <Tooltip label={`${item.label} — coming soon`} placement="right" openDelay={300}>
      <Flex
        aria-disabled="true"
        aria-label={`${item.label} (coming soon)`}
        align="center"
        justify={{ base: "center", xl: "flex-start" }}
        gap={3}
        h="40px"
        px={{ base: 0, xl: 3 }}
        w="full"
        color="text-muted"
        opacity={0.75}
        fontSize="15px"
        fontWeight={500}
        cursor="default"
      >
        <Icon size={20} aria-hidden />
        <Text as="span" display={full}>
          {item.label}
        </Text>
        <SoonTag display={full} ml="auto" />
      </Flex>
    </Tooltip>
  );
}

function Leftbar() {
  const { user } = useAuth();
  const startPost = useNewPost();
  const isRail = useBreakpointValue({ base: true, xl: false }, { ssr: false });
  const { data: unread = 0 } = useUnreadCount();
  const { data: unreadMessages = 0 } = useMessagesUnreadCount();
  const badges = { notifications: unread, messages: unreadMessages };
  if (!user) return null;

  return (
    <Flex
      as="nav"
      aria-label="Main"
      direction="column"
      position="sticky"
      top={0}
      h="100vh"
      py={5}
      px={{ base: 3, xl: 4 }}
      align={{ base: "center", xl: "stretch" }}
    >
      <Box px={{ base: 0, xl: 3 }} mb={6} h="32px" display="flex" alignItems="center">
        <Box display={full}>
          <Wordmark />
        </Box>
        <Box display={iconOnly}>
          <Wordmark size="30px">c</Wordmark>
        </Box>
      </Box>

      <VStack as="ul" listStyleType="none" spacing={0.5} align="stretch" w="full">
        {getNavItems(user).map((item) => (
          <li key={item.key}>
            <RailItem item={item} isRail={isRail} unread={item.badge ? badges[item.badge] : 0} />
          </li>
        ))}
      </VStack>

      {soonItems.length > 0 && (
        <>
          <Box h="1px" bg="border" my={3} mx={{ base: 2, xl: 3 }} />
          <VStack spacing={0.5} align="stretch" w="full">
            {soonItems.map((item) => (
              <SoonItem key={item.label} item={item} />
            ))}
          </VStack>
        </>
      )}

      <Button
        variant="primary"
        mt={5}
        w="full"
        display={full}
        leftIcon={<LuPenSquare size={18} />}
        onClick={startPost}
      >
        New post
      </Button>
      <Tooltip label="New post" placement="right">
        <Button
          variant="primary"
          mt={5}
          w="40px"
          px={0}
          h="40px"
          display={iconOnly}
          aria-label="New post"
          onClick={startPost}
        >
          <LuPenSquare size={18} />
        </Button>
      </Tooltip>

      <Box mt="auto" w="full" display={full}>
        <UserMenu />
      </Box>
      <Box mt="auto" display={iconOnly}>
        <UserMenu compact />
      </Box>
    </Flex>
  );
}

export default Leftbar;
