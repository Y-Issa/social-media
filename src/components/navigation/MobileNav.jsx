import { Box, Flex, IconButton } from "@chakra-ui/react";
import { LuPenSquare } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Wordmark from "../ui/Wordmark";
import UserMenu from "./UserMenu";
import { getNavItems } from "./navItems";
import { useNewPost } from "./useNewPost";

// Below md: a slim top bar (wordmark + account menu) and a bottom tab bar.
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
      <UserMenu compact placement="bottom-end" />
    </Flex>
  );
}

function Tab({ item }) {
  const Icon = item.icon;
  return (
    <Box
      as={NavLink}
      to={item.to}
      end={item.end}
      aria-label={item.label}
      flex="1"
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="full"
      position="relative"
      color="text-muted"
      transition="color 120ms"
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
      <Icon size={22} aria-hidden />
    </Box>
  );
}

export function MobileTabBar() {
  const { user } = useAuth();
  const startPost = useNewPost();
  const [home, groups, saved, profile] = getNavItems(user);

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
      <Tab item={home} />
      <Tab item={groups} />
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
      <Tab item={saved} />
      <Tab item={profile} />
    </Flex>
  );
}
