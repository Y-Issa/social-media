import {
  Avatar,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import { fetchGroupMembers } from "../../queries/groups";
import { getImageUrl } from "../../imageUrl";
import { plural, toHandle } from "../ui/format";

// Mono "12 members" line that opens the member list.
function GroupMembers({ groupId, groupName }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLoading, error, data: members } = useQuery({
    queryKey: ["members", groupId],
    queryFn: () => fetchGroupMembers(groupId),
  });

  if (isLoading) return <Skeleton h="12px" w="72px" my="2px" />;
  if (error) return <Text textStyle="meta">members unavailable</Text>;

  return (
    <>
      <Box
        as="button"
        type="button"
        onClick={onOpen}
        textStyle="meta"
        textAlign="left"
        transition="color 120ms"
        _hover={{ color: "text-primary", textDecoration: "underline" }}
        _focusVisible={{ boxShadow: "outline", outline: "none", borderRadius: "sm" }}
      >
        {plural(members?.length ?? 0, "member")}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="sm" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pr={12}>
            {groupName ? `Members of ${groupName}` : "Members"}
            <Text textStyle="meta" fontWeight={400} mt={1}>
              {plural(members.length, "member")}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={0} pb={3}>
            {members.map((member) => (
              <Flex
                as={RouterLink}
                to={`/profile/${member.userId}`}
                onClick={onClose}
                key={member.userId}
                align="center"
                gap={3}
                px={5}
                py={2.5}
                borderTop="1px solid"
                borderColor="border"
                transition="background 120ms"
                _hover={{ bg: "surface-raised" }}
                _focusVisible={{ bg: "surface-raised", outline: "none" }}
              >
                <Avatar size="md" name={member.name} src={getImageUrl(member.profileImage)} />
                <Box minW={0}>
                  <Text fontSize="15px" fontWeight={600} noOfLines={1}>
                    {member.name}
                  </Text>
                  <Text textStyle="meta" noOfLines={1}>
                    {toHandle(member)}
                  </Text>
                </Box>
              </Flex>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupMembers;
