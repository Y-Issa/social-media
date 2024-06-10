import {
  Avatar,
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

function Navbar() {
  return (
    <HStack
      gap={2}
      minH="8vh"
      px="10px"
      borderBottom="1px"
      borderColor="lightgray"
    >
      <Heading size="md" display={{ base: "none", sm: "block" }}>
        <Link to="/">Communet</Link>
      </Heading>
      <HStack gap={1}>
        <HiOutlineHome />
        <HiOutlineMoon />
        <HiOutlineSquares2X2 />
      </HStack>
      <InputGroup maxW="440px">
        <InputLeftElement children={<HiOutlineSearch />} />
        <Input placeholder="Search" />
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
