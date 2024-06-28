import {
  Avatar,
  Box,
  Button,
  Card,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchGroupMembers } from "../../queries/groups";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";

function GroupMembers({ groupId }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isLoading: isLoadingMembers,
    error: errorMembers,
    data: members,
  } = useQuery({
    queryKey: ["members", groupId],
    queryFn: () => fetchGroupMembers(groupId),
  });
  return isLoadingMembers ? (
    <Loading />
  ) : errorMembers ? (
    <Text>Something Went Wrong!</Text>
  ) : (
    <>
      <Button onClick={onOpen} variant="ghost" colorScheme="bgColor">
        {members?.length === 1
          ? `${members?.length} Member`
          : `${members?.length} Members`}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color="textColor.100" bgColor="bgColor.100">
          <ModalHeader>Group Members</ModalHeader>
          <ModalBody>
            <Box>
              {members?.map((member) => (
                <Card
                  key={member.userId}
                  p={2}
                  my={2}
                  color="textColor.100"
                  bgColor="bgColor.50"
                  cursor="pointer"
                  onClick={() => {
                    navigate(`/profile/${member.userId}`);
                  }}
                >
                  <HStack gap={2}>
                    <Avatar
                      src={
                        member.profileImage?.startsWith("http")
                          ? member.profileImage
                          : `http://localhost:8001/public/upload/${member.profileImage}`
                      }
                      size="md"
                    />
                    <Text>{member.name}</Text>
                  </HStack>
                </Card>
              ))}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupMembers;
