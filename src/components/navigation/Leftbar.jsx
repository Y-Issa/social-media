import { Divider, HStack, Text, VStack } from "@chakra-ui/react";
import {
  FcCalendar,
  FcClapperboard,
  FcConferenceCall,
  FcContacts,
  FcPicture,
  FcShop,
} from "react-icons/fc";
import { HiMail } from "react-icons/hi";
import { useAuth } from "../../contexts/AuthContext";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function Leftbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    user && (
      <VStack
        mr="10px"
        p="15px"
        alignItems="start"
        gap={2}
        bgColor="bgColor.50"
        minH="92vh"
      >
        <HStack>
          <FcContacts size="30px" />
          <Text>Connections</Text>
        </HStack>
        <HStack cursor="pointer" onClick={() => navigate("/groups")}>
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
        <HStack
          pb="10px"
          cursor="pointer"
          onClick={() => {
            navigate("/saved");
          }}
        >
          <HiArchiveBoxArrowDown color="#3F51B5" size="30px" />
          <Text>Saved</Text>
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
    )
  );
}

export default Leftbar;
