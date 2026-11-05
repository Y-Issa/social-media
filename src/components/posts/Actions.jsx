import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEllipsis } from "react-icons/fa6";
import ConfirmDialog from "../ConfirmDialog";

function Actions({ ownPost, saved, onDelete, onSave, isDeleting = false }) {
  const confirm = useDisclosure();

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          color="textColor.100"
          variant="unstyled"
          aria-label="Post actions"
        >
          <FaEllipsis />
        </MenuButton>
        <MenuList bgColor="bgColor.300" border="none" p="5px">
          <MenuItem bgColor="bgColor.200" onClick={onSave}>
            {saved ? "Unsave" : "Save"}
          </MenuItem>
          {ownPost && (
            <MenuItem bgColor="bgColor.200" color="red.500" onClick={confirm.onOpen}>
              Delete
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.onClose}
        onConfirm={async () => {
          await onDelete();
          confirm.onClose();
        }}
        isLoading={isDeleting}
        title="Delete post?"
        body="This can't be undone."
      />
    </>
  );
}

export default Actions;
