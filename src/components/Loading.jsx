import { Box, Flex, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react";

// Skeleton that mirrors a post row: avatar gutter + header, two body lines,
// action row. `count` repeats it.
function PostRowSkeleton({ withImage = false }) {
  return (
    <Flex gap={3} px={4} py={3} borderBottom="1px solid" borderColor="border">
      <SkeletonCircle size="10" flex="none" />
      <Box flex="1" minW={0}>
        <Flex gap={2} align="center" h="20px">
          <Skeleton h="12px" w="120px" />
          <Skeleton h="10px" w="32px" />
        </Flex>
        <Stack spacing={2} mt={2}>
          <Skeleton h="12px" w="92%" />
          <Skeleton h="12px" w="64%" />
        </Stack>
        {withImage && <Skeleton mt={3} h="180px" w="full" />}
        <Flex gap={8} mt={3} h="20px" align="center">
          <Skeleton h="12px" w="28px" />
          <Skeleton h="12px" w="28px" />
          <Skeleton h="12px" w="28px" />
        </Flex>
      </Box>
    </Flex>
  );
}

function Loading({ count = 3 }) {
  return (
    <Box aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <PostRowSkeleton key={i} withImage={i === 1} />
      ))}
    </Box>
  );
}

export default Loading;
