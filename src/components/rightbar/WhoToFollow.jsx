import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle, Text, useToast } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { errorMessage } from "../../axios";
import { getImageUrl } from "../../imageUrl";
import { useSuggestionFollow, useSuggestions } from "../../queries/users";

const LIMIT = 4;

function RowSkeleton() {
  return (
    <Flex align="center" gap={3} px={4} py={2.5}>
      <SkeletonCircle size="40px" flex="none" />
      <Box flex="1">
        <Skeleton h="12px" w="60%" />
        <Skeleton h="10px" w="85%" mt={2} />
      </Box>
      <Skeleton h="32px" w="64px" />
    </Flex>
  );
}

function SuggestionRow({ person, onToggle }) {
  const href = `/profile/${person.userId}`;
  const following = Boolean(person.isFollowing);
  return (
    <Flex as="li" align="center" gap={3} px={4} py={2.5}>
      <RouterLink to={href} tabIndex={-1} aria-hidden>
        <Avatar size="md" name={person.name} src={getImageUrl(person.profileImage)} />
      </RouterLink>
      <Box flex="1" minW={0}>
        <Text
          as={RouterLink}
          to={href}
          display="block"
          fontSize="14px"
          fontWeight={600}
          lineHeight="18px"
          noOfLines={1}
          _hover={{ textDecoration: "underline" }}
          _focusVisible={{ boxShadow: "outline", outline: "none", borderRadius: "sm" }}
        >
          {person.name}
        </Text>
        <Text textStyle="meta" fontSize="11px" lineHeight="14px" mt="2px" noOfLines={2} title={person.reason}>
          {person.reason || person.city || "Suggested for you"}
        </Text>
      </Box>
      <Button
        size="sm"
        variant="secondary"
        flex="none"
        minW="76px"
        px={3}
        color={following ? "text-muted" : undefined}
        aria-pressed={following}
        aria-label={following ? `Unfollow ${person.name}` : `Follow ${person.name}`}
        onClick={() => onToggle(person)}
      >
        {following ? "Following" : "Follow"}
      </Button>
    </Flex>
  );
}

// Live suggestions; the whole section hides when there's nobody to suggest.
function WhoToFollow() {
  const toast = useToast();
  const { data, isLoading, isError } = useSuggestions(LIMIT);
  const follow = useSuggestionFollow(LIMIT);

  if (isError || (!isLoading && !data?.length)) return null;

  const toggle = (person) =>
    follow.mutate(
      { userId: person.userId, isFollowing: Boolean(person.isFollowing) },
      {
        onError: (error) =>
          toast({ title: "Couldn't update follow.", description: errorMessage(error), status: "error" }),
      }
    );

  return (
    <Box
      as="section"
      aria-labelledby="who-to-follow"
      aria-busy={isLoading || undefined}
      border="1px solid"
      borderColor="border"
      borderRadius="md"
      bg="surface"
      pb={1.5}
    >
      <Text id="who-to-follow" as="h2" fontSize="15px" fontWeight={600} px={4} pt={3} pb={1}>
        Who to follow
      </Text>
      {isLoading ? (
        <>
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </>
      ) : (
        <Box as="ul" listStyleType="none">
          {data.slice(0, LIMIT).map((person) => (
            <SuggestionRow key={person.userId} person={person} onToggle={toggle} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default WhoToFollow;
