import {
  Avatar,
  Button,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { HiOutlineMail, HiOutlineSearch } from "react-icons/hi";
import {
  HiOutlineBell,
  HiOutlineHome,
  HiOutlineMoon,
  HiOutlineSquares2X2,
  HiOutlineSun,
  HiOutlineUser,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkModeContext";

function Navbar() {
  const { isDark, toggleDarkMode } = useDarkMode();
  return (
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
      <Heading size="md" display={{ base: "none", sm: "block" }}>
        <Link to="/">Communet</Link>
      </Heading>
      <HStack gap={1}>
        <HiOutlineHome />
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
        <HiOutlineUser />
        <HiOutlineMail />
        <HiOutlineBell />
        <Avatar size="sm" />
        <Text display={{ base: "none", sm: "block" }}>UserName</Text>
      </HStack>
    </HStack>
  );
}

export default Navbar;
