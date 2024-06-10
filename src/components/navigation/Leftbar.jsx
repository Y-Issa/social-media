import { Avatar, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import {
  FcCalendar,
  FcClapperboard,
  FcClock,
  FcConferenceCall,
  FcContacts,
  FcPicture,
  FcShop,
} from "react-icons/fc";
import { HiMail } from "react-icons/hi";

function Leftbar() {
  return (
    <VStack
      p="15px"
      alignItems="start"
      gap={2}
      bgColor="bgColor.50"
      minH="92vh"
    >
      <HStack>
        <Avatar size="sm" />
        <Text>UserName</Text>
      </HStack>
      <HStack>
        <FcContacts size="30px" />
        <Text>Friends</Text>
      </HStack>
      <HStack>
        <FcConferenceCall size="30px" />
        <Text>Groups</Text>
      </HStack>
      <HStack>
        <FcShop size="30px" />
        <Text>MarketPlace</Text>
      </HStack>
      <HStack>
        <FcClapperboard size="30px" />
        <Text>Watch</Text>
      </HStack>
      <HStack pb="10px">
        <FcClock size="30px" />
        <Text>Memories</Text>
      </HStack>

      <Divider borderColor="bgColor.400" />

      <HStack pt="10px">
        <FcCalendar size="30px" />
        <Text>Events</Text>
      </HStack>
      <HStack>
        <FcPicture size="30px" />
        <Text>Gallery</Text>
      </HStack>
      <HStack>
        <HiMail color="#3F51B5" size="30px" />
        <Text>Messages</Text>
      </HStack>
    </VStack>
  );
}

export default Leftbar;
