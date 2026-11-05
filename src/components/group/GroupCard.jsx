import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LuLogOut, LuMoreHorizontal, LuTrash2 } from "react-icons/lu";
import { Link as RouterLink } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "../../queries/groups";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../imageUrl";
import { errorMessage } from "../../axios";
import ConfirmDialog from "../ConfirmDialog";
import GroupMembers from "./GroupMembers";

function GroupImage({ group }) {
  const initial = (
    <Flex
      w="48px"
      h="48px"
      align="center"
      justify="center"
      bg="accent-subtle"
      color="accent"
      fontFamily="display"
      fontSize="26px"
      lineHeight="1"
    >
      {group.name?.trim()?.[0]?.toUpperCase() || "#"}
    </Flex>
  );
  return (
    <Box
      w="48px"
      h="48px"
      flex="none"
      borderRadius="sm"
      overflow="hidden"
      border="1px solid"
      borderColor="border"
    >
      {group.image ? (
        <Image
          src={getImageUrl(group.image)}
          alt=""
          w="full"
          h="full"
          objectFit="cover"
          fallback={initial}
        />
      ) : (
        initial
      )}
    </Box>
  );
}

// A group row: image, name, member count, action on the right.
const GroupCard = ({ group, isMember, onToggleMembership, isToggling = false }) => {
  const toast = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const confirmDelete = useDisclosure();
  const confirmLeave = useDisclosure();
  const isOwner = user.userId === group.createdBy;
  const href = `/groups/${group.groupId}`;

  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
      queryClient.invalidateQueries(["joinedGroups"]);
      confirmDelete.onClose();
      toast({ title: "Group deleted.", status: "success" });
    },
    onError: (error) =>
      toast({
        title: "Couldn't delete the group.",
        description: errorMessage(error),
        status: "error",
      }),
  });

  return (
    <Flex
      as="article"
      gap={3}
      px={4}
      py={3}
      align="flex-start"
      borderBottom="1px solid"
      borderColor="border"
      transition="background 120ms"
      _hover={isMember ? { bg: "surface-raised" } : undefined}
    >
      {isMember ? (
        <RouterLink to={href} aria-hidden tabIndex={-1}>
          <GroupImage group={group} />
        </RouterLink>
      ) : (
        <GroupImage group={group} />
      )}

      <Box flex="1" minW={0}>
        <Flex align="baseline" gap={2} wrap="wrap">
          {isMember ? (
            <Text
              as={RouterLink}
              to={href}
              fontSize="15px"
              fontWeight={600}
              lineHeight="20px"
              noOfLines={1}
              _hover={{ textDecoration: "underline" }}
            >
              {group.name}
            </Text>
          ) : (
            <Text fontSize="15px" fontWeight={600} lineHeight="20px" noOfLines={1}>
              {group.name}
            </Text>
          )}
          {isOwner && <Text textStyle="label" fontSize="10px">owner</Text>}
        </Flex>
        <GroupMembers groupId={group.groupId} groupName={group.name} />
        {group.description && (
          <Text mt={1} fontSize="14px" lineHeight="20px" color="text-secondary" noOfLines={2}>
            {group.description}
          </Text>
        )}
      </Box>

      <Flex flex="none" gap={1} align="center">
        {isMember ? (
          <>
            <Button as={RouterLink} to={href} size="sm" variant="secondary">
              Open
            </Button>
            <Menu placement="bottom-end">
              <MenuButton
                as={IconButton}
                size="sm"
                variant="ghost"
                aria-label={`More actions for ${group.name}`}
                icon={<LuMoreHorizontal size={18} />}
              />
              <MenuList>
                {isOwner ? (
                  <MenuItem icon={<LuTrash2 size={16} />} color="danger" onClick={confirmDelete.onOpen}>
                    Delete group
                  </MenuItem>
                ) : (
                  <MenuItem icon={<LuLogOut size={16} />} color="danger" onClick={confirmLeave.onOpen}>
                    Leave group
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            isLoading={isToggling}
            onClick={() => onToggleMembership(group.groupId, false)}
          >
            Join
          </Button>
        )}
      </Flex>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={confirmDelete.onClose}
        onConfirm={() => deleteMutation.mutate(group.groupId)}
        isLoading={deleteMutation.isLoading}
        title={`Delete “${group.name}”?`}
        body="All of the group's posts will be deleted. This can't be undone."
      />
      <ConfirmDialog
        isOpen={confirmLeave.isOpen}
        onClose={confirmLeave.onClose}
        onConfirm={async () => {
          await onToggleMembership(group.groupId, true);
          confirmLeave.onClose();
        }}
        isLoading={isToggling}
        title={`Leave “${group.name}”?`}
        body="You can rejoin at any time."
        confirmLabel="Leave"
      />
    </Flex>
  );
};

export default GroupCard;
