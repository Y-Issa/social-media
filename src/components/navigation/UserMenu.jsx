import {
  Avatar,
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import {
  LuBookmark,
  LuCalendar,
  LuMoreHorizontal,
  LuLogOut,
  LuMoon,
  LuSun,
  LuUser,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { getImageUrl } from "../../imageUrl";
import { toHandle } from "../ui/format";

// compact: avatar only (icon rail / mobile header).
function UserMenu({ compact = false, placement = "top-start" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();

  if (!user) return null;

  return (
    <Menu placement={placement} gutter={6}>
      <MenuButton
        aria-label="Account menu"
        w={compact ? "auto" : "full"}
        p={compact ? 1 : 2}
        borderRadius="md"
        transition="background 120ms"
        _hover={{ bg: "surface-raised" }}
        _expanded={{ bg: "surface-raised" }}
        _focusVisible={{ boxShadow: "outline" }}
      >
        <HStack spacing={3} textAlign="left">
          <Avatar size="md" name={user.name} src={getImageUrl(user.profileImage)} />
          {!compact && (
            <>
              <Box flex="1" minW={0}>
                <Text fontSize="14px" fontWeight={600} lineHeight="18px" noOfLines={1}>
                  {user.name}
                </Text>
                <Text textStyle="meta" noOfLines={1}>
                  {toHandle(user)}
                </Text>
              </Box>
              <Box color="text-muted">
                <LuMoreHorizontal size={18} />
              </Box>
            </>
          )}
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<LuUser size={16} />} onClick={() => navigate(`/profile/${user.userId}`)}>
          Profile
        </MenuItem>
        <MenuItem icon={<LuBookmark size={16} />} onClick={() => navigate("/saved")}>
          Saved
        </MenuItem>
        <MenuItem icon={<LuCalendar size={16} />} onClick={() => navigate("/events")}>
          Events
        </MenuItem>
        <MenuItem
          icon={isDark ? <LuSun size={16} /> : <LuMoon size={16} />}
          onClick={toggleDarkMode}
          closeOnSelect={false}
        >
          {isDark ? "Light mode" : "Dark mode"}
        </MenuItem>
        <MenuDivider />
        <MenuItem
          icon={<LuLogOut size={16} />}
          color="danger"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default UserMenu;
