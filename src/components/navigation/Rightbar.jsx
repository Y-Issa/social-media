import { VStack } from "@chakra-ui/react";
import FriendSuggestionsCard from "../rightbar/FriendSuggestionsCard";
import LatestActivities from "../rightbar/LatestActivities";
import OnlineFriends from "../rightbar/OnlineFriends";

function Rightbar() {
  return (
    <VStack p="5px" alignItems="start" gap={2}>
      <FriendSuggestionsCard />
      <LatestActivities />
      <OnlineFriends />
    </VStack>
  );
}

export default Rightbar;
