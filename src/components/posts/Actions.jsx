import { Button, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { FaEllipsis } from "react-icons/fa6";

function Actions({ ownPost, saved, onDelete, onSave }) {
  return (
    <Menu>
      <MenuButton as={Button} color="textColor.100" variant="unstyled">
        <FaEllipsis />
      </MenuButton>
      <MenuList bgColor="bgColor.300" border="none" p="5px">
        {ownPost && (
          <MenuItem bgColor="bgColor.200" onClick={onDelete}>
            Delete
          </MenuItem>
        )}
        {saved ? (
          <MenuItem bgColor="bgColor.200" onClick={onSave}>
            Unsave
          </MenuItem>
        ) : (
          <MenuItem bgColor="bgColor.200" onClick={onSave}>
            Save
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default Actions;
