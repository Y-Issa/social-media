import { Box, Flex, IconButton } from "@chakra-ui/react";
import { LuPenSquare, LuSearch } from "react-icons/lu";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUnreadCount } from "../../queries/notifications";
import UnreadBadge, { badgeText } from "../notifications/UnreadBadge";
import Wordmark from "../ui/Wordmark";
import UserMenu from "./UserMenu";
import { getNavItems } from "./navItems";
import { useNewPost } from "./useNewPost";

// Below md: a slim top bar (wordmark, search, account menu) and a bottom tab bar.
export function MobileHeader() {
  return (
    <Flex
      as="header"
      display={{ base: "flex", md: "none" }}
      position="sticky"
      top={0}
      zIndex="sticky"
      h="52px"
      px={4}
      align="center"
      justify="space-between"
      bg="bg"
      borderBottom="1px solid"
      borderColor="border"
    >
      <Wordmark size="26px" />
      <Flex align="center" gap={1}>
        <IconButton
          as={RouterLink}
          to="/search"
          variant="ghost"
          aria-label="Search"
          icon={<LuSearch size={20} />}
          w="40px"
          h="40px"
        />
        <UserMenu compact placement="bottom-end" />
      </Flex>
    </Flex>
  );
}

function Tab({ item, unread = 0 }) {
  const Icon = item.icon;
  return (
    <Box
      as={NavLink}
      to={item.to}
      end={item.end}
      aria-label={unread ? `${item.label}, ${badgeText(unread)} unread` : item.label}
      flex="1"
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="full"
      position="relative"
      color="text-muted"
      transition="color 120ms"
      _focusVisible={{ boxShadow: "inset 0 0 0 2px var(--chakra-colors-accent)", outline: "none" }}
      sx={{
        "&.active": { color: "text-primary" },
        "&.active::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "30%",
          right: "30%",
          h: "2px",
          bg: "accent",
        },
      }}
    >
      <Box as="span" position="relative" display="inline-flex">
        <Icon size={22} aria-hidden />
        <UnreadBadge
          count={unread}
          position="absolute"
          top="-6px"
          left="12px"
          minW="16px"
          h="16px"
          px="4px"
          fontSize="10px"
          boxShadow="0 0 0 2px var(--chakra-colors-surface)"
        />
      </Box>
    </Box>
  );
}

export function MobileTabBar() {
  const { user } = useAuth();
  const startPost = useNewPost();
  const { data: unread = 0 } = useUnreadCount();
  const items = Object.fromEntries(getNavItems(user).map((item) => [item.key, item]));

  return (
    <Flex
      as="nav"
      aria-label="Main"
      display={{ base: "flex", md: "none" }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex="sticky"
      h="calc(56px + env(safe-area-inset-bottom))"
      pb="env(safe-area-inset-bottom)"
      bg="surface"
      borderTop="1px solid"
      borderColor="border"
      align="stretch"
    >
      <Tab item={items.home} />
      <Tab item={items.groups} />
      <Flex flex="1" align="center" justify="center">
        <IconButton
          variant="primary"
          aria-label="New post"
          icon={<LuPenSquare size={18} />}
          onClick={startPost}
          w="44px"
          h="36px"
        />
      </Flex>
      <Tab item={items.notifications} unread={unread} />
      <Tab item={items.profile} />
    </Flex>
  );
}
