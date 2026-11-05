import { Button, useToast } from "@chakra-ui/react";
import { LuMail } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "../../axios";
import { useStartConversation } from "../../queries/messages";

// Secondary "Message" button for someone else's profile: opens (or creates)
// the 1:1 conversation and navigates to it.
function MessageButton({ userId, ...props }) {
  const navigate = useNavigate();
  const toast = useToast();
  const start = useStartConversation();

  const open = () =>
    start.mutate(userId, {
      onSuccess: ({ conversationId }) => navigate(`/messages/${conversationId}`),
      onError: (error) =>
        toast({ title: "Couldn't open the conversation", description: errorMessage(error), status: "error" }),
    });

  return (
    <Button
      variant="secondary"
      leftIcon={<LuMail size={16} />}
      onClick={open}
      isLoading={start.isLoading}
      {...props}
    >
      Message
    </Button>
  );
}

export default MessageButton;
