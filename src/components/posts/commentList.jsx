import { Avatar, Box, Text, HStack, VStack, Spacer } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

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
        py="10px"
      >
        <HStack spacing="10px">
          <Avatar size="sm" src={comment.profileImage} />
          <VStack
            align="start"
            spacing="5px"
            w="full"
            backgroundColor="bgColor.200"
            p="10px"
            borderRadius="xl"
          >
            <HStack align="center" w="full">
              <Text fontWeight="bold">{comment.name}</Text>
              <Spacer />
              <Text fontSize="xs" color="textColor.500">
                {formattedTime}
              </Text>
            </HStack>
            <Text>{comment.description}</Text>
          </VStack>
        </HStack>
      </Box>
    );
  });
}

export default CommentList;
