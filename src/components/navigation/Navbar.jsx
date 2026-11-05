import {
  Avatar,
  Button,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { HiOutlineMail, HiOutlineSearch } from "react-icons/hi";
import {
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSquares2X2,
  HiOutlineSun,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../imageUrl";

function Navbar() {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  return (
    user && (
      <HStack
        gap={2}
        minH="8vh"
        py="5px"
        px="10px"
        bgColor="bgColor.50"
        color="textColor.100"
        borderBottom="1px"
        borderColor="bgColor.400"
      >
        <Heading size="md">
          <Link to="/">Communet</Link>
        </Heading>
        <HStack gap={1}>
          <Button
            variant="ghost"
            _hover={{ bgColor: "bgColor.400" }}
            onClick={toggleDarkMode}
          >
            {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
          </Button>
          <HiOutlineSquares2X2 />
        </HStack>
        <InputGroup maxW="440px" borderColor="bgColor.400">
          <InputLeftElement children={<HiOutlineSearch />} />
          <Input placeholder="Search" focusBorderColor="primary.100" />
        </InputGroup>
        <Spacer />
        <HStack gap={1}>
          <HiOutlineMail />
          <HiOutlineBell />
        </HStack>
        <Menu placement="bottom-end">
          <MenuButton as={Button} variant="ghost" px={2} _hover={{ bgColor: "bgColor.400" }}>
            <HStack>
              <Avatar size="sm" name={user.name} src={getImageUrl(user.profileImage)} />
              <Text display={{ base: "none", sm: "block" }}>{user.name}</Text>
            </HStack>
          </MenuButton>
          <MenuList bgColor="bgColor.100" borderColor="bgColor.400" zIndex="dropdown">
            <MenuItem bgColor="bgColor.100" onClick={() => navigate(`/profile/${user.userId}`)}>
              Profile
            </MenuItem>
            <MenuItem bgColor="bgColor.100" onClick={() => navigate("/saved")}>
              Saved posts
            </MenuItem>
            <MenuItem
              bgColor="bgColor.100"
              color="red.500"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    )
  );
}

export default Navbar;
