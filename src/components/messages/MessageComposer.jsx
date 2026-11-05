import { useState } from "react";
import { Flex, IconButton, Textarea } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { useAutoGrow } from "../posts/useAutoGrow";
import CharCount from "../posts/CharCount";
import { MESSAGE_MAX_LENGTH } from "../../queries/messages";

// Auto-growing textarea. Enter sends, Shift+Enter adds a newline.
function MessageComposer({ onSend, recipientName, autoFocus }) {
  const [value, setValue] = useState("");
  const ref = useAutoGrow(value, 160);
  const body = value.trim();
  const canSend = body.length > 0 && body.length <= MESSAGE_MAX_LENGTH;

  const send = () => {
    if (!canSend) return;
    onSend(body);
    setValue("");
    ref.current?.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={(event) => {
        event.preventDefault();
        send();
      }}
      align="flex-end"
      gap={2}
      px={3}
      py={2.5}
      borderTop="1px solid"
      borderColor="border"
      bg="surface"
      flex="none"
    >
      <Textarea
        ref={ref}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={recipientName ? `Message ${recipientName}` : "Write a message"}
        aria-label="Message"
        rows={1}
        resize="none"
        minH="40px"
        py="9px"
        fontSize="15px"
        lineHeight="20px"
        borderRadius="6px"
        autoFocus={autoFocus}
      />
      <Flex direction="column" align="center" gap={1} flex="none">
        <CharCount length={body.length} max={MESSAGE_MAX_LENGTH} />
        <IconButton
          type="submit"
          variant="primary"
          aria-label="Send message"
          icon={<LuSend size={18} />}
          isDisabled={!canSend}
          w="40px"
          h="40px"
        />
      </Flex>
    </Flex>
  );
}

export default MessageComposer;
