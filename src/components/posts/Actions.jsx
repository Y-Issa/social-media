import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { LuBookmark, LuBookmarkMinus, LuMoreHorizontal, LuPencil, LuTrash2 } from "react-icons/lu";
import ConfirmDialog from "../ConfirmDialog";

// The ⋯ menu on a post. canEdit: the author. canDelete: the author, or the
// group's owner on the group page.
function Actions({ saved, canEdit, canDelete, onSave, onEdit, onDelete, isDeleting = false }) {
  const confirm = useDisclosure();

  return (
    <>
      <Menu placement="bottom-end" isLazy>
        <MenuButton
          as={IconButton}
          size="xs"
          variant="ghost"
          w="28px"
          h="28px"
          aria-label="Post actions"
          icon={<LuMoreHorizontal size={18} />}
        />
        <Portal>
          <MenuList>
            <MenuItem
              icon={saved ? <LuBookmarkMinus size={16} /> : <LuBookmark size={16} />}
              onClick={onSave}
            >
              {saved ? "Unsave" : "Save"}
            </MenuItem>
            {canEdit && (
              <MenuItem icon={<LuPencil size={16} />} onClick={onEdit}>
                Edit
              </MenuItem>
            )}
            {canDelete && (
              <>
                <MenuDivider />
                <MenuItem icon={<LuTrash2 size={16} />} color="danger" onClick={confirm.onOpen}>
                  Delete
                </MenuItem>
              </>
            )}
          </MenuList>
        </Portal>
      </Menu>
      {canDelete && (
        <ConfirmDialog
          isOpen={confirm.isOpen}
          onClose={confirm.onClose}
          onConfirm={async () => {
            const ok = await onDelete();
            if (ok !== false) confirm.onClose();
          }}
          isLoading={isDeleting}
          title="Delete post?"
          body={canEdit ? "This can't be undone." : "You're removing this post as the group's owner. This can't be undone."}
        />
      )}
    </>
  );
}

export default Actions;
