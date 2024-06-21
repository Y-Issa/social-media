import { Avatar, Box, Text, HStack } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

function CommentList({ comments }) {
  return comments?.map((comment) => {
    let formattedTime = formatDistanceToNow(new Date(comment.createdAt), {
      addSuffix: true,
    });

    if (formattedTime.startsWith("about ")) {
      formattedTime = formattedTime.replace("about ", "");
    }

    return (
      <Box
        key={comment.commentId}
        borderBottom="1px"
        borderColor="bgColor.200"
        mb="10px"
      >
        <HStack gap="5px">
          <Avatar size="sm" src={comment.profileImage} />
          <Box minW="100px">
            <Text>{comment.name}</Text>
            <Text fontSize="10px" textColor="textColor.300">
              {formattedTime} ago
            </Text>
          </Box>
          <Text>{comment.description}</Text>
        </HStack>
      </Box>
    );
  });
}

export default CommentList;
