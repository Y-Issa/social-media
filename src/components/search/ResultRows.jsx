import { Avatar, Box, Button, Flex, Image, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getImageUrl } from "../../imageUrl";
import { plural, toHandle } from "../ui/format";

const nameLink = {
  display: "block",
  fontSize: "15px",
  fontWeight: 600,
  lineHeight: "20px",
  noOfLines: 1,
  _hover: { textDecoration: "underline" },
  _focusVisible: { boxShadow: "outline", outline: "none", borderRadius: "sm" },
};

// Bolds the first case-insensitive match of `term` inside `text`.
function Highlight({ text = "", term = "" }) {
  const i = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <Text as="mark" bg="transparent" color="inherit" fontWeight={700}>
        {text.slice(i, i + term.length)}
      </Text>
      {text.slice(i + term.length)}
    </>
  );
}

export function PersonRow({ person, term, isSelf, onToggleFollow }) {
  const href = `/profile/${person.userId}`;
  const following = Boolean(person.isFollowing);
  const meta = [toHandle(person), person.city].filter(Boolean).join(" · ");
  return (
    <Flex as="li" listStyleType="none" align="center" gap={3} px={4} py={3} borderBottom="1px solid" borderColor="border">
      <RouterLink to={href} tabIndex={-1} aria-hidden>
        <Avatar size="md" name={person.name} src={getImageUrl(person.profileImage)} />
      </RouterLink>
      <Box flex="1" minW={0}>
        <Text as={RouterLink} to={href} {...nameLink} fontWeight={500}>
          <Highlight text={person.name} term={term} />
        </Text>
        <Text textStyle="meta" noOfLines={1}>
          {meta}
        </Text>
      </Box>
      {!isSelf && (
        <Button
          size="sm"
          variant={following ? "secondary" : "primary"}
          minW="88px"
          flex="none"
          aria-pressed={following}
          aria-label={following ? `Unfollow ${person.name}` : `Follow ${person.name}`}
          onClick={() => onToggleFollow(person)}
        >
          {following ? "Following" : "Follow"}
        </Button>
      )}
    </Flex>
  );
}

function GroupImage({ group }) {
  const initial = (
    <Flex w="full" h="full" align="center" justify="center" bg="accent-subtle" color="accent" fontFamily="display" fontSize="26px" lineHeight="1">
      {group.name?.trim()?.[0]?.toUpperCase() || "#"}
    </Flex>
  );
  return (
    <Box w="48px" h="48px" flex="none" borderRadius="sm" overflow="hidden" border="1px solid" borderColor="border">
      {group.image ? (
        <Image src={getImageUrl(group.image)} alt="" w="full" h="full" objectFit="cover" fallback={initial} />
      ) : (
        initial
      )}
    </Box>
  );
}

export function GroupRow({ group, term, onJoin, isJoining }) {
  const href = `/groups/${group.groupId}`;
  return (
    <Flex as="li" listStyleType="none" gap={3} px={4} py={3} align="flex-start" borderBottom="1px solid" borderColor="border">
      <GroupImage group={group} />
      <Box flex="1" minW={0}>
        {group.isMember ? (
          <Text as={RouterLink} to={href} {...nameLink} fontWeight={500}>
            <Highlight text={group.name} term={term} />
          </Text>
        ) : (
          <Text fontSize="15px" fontWeight={500} lineHeight="20px" noOfLines={1}>
            <Highlight text={group.name} term={term} />
          </Text>
        )}
        <Text textStyle="meta">{plural(group.memberCount ?? 0, "member")}</Text>
        {group.description && (
          <Text mt={1} fontSize="14px" lineHeight="20px" color="text-secondary" noOfLines={2}>
            {group.description}
          </Text>
        )}
      </Box>
      {group.isMember ? (
        <Button as={RouterLink} to={href} size="sm" variant="secondary" flex="none">
          Open
        </Button>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          flex="none"
          isLoading={isJoining}
          aria-label={`Join ${group.name}`}
          onClick={() => onJoin(group)}
        >
          Join
        </Button>
      )}
    </Flex>
  );
}

export function RowSkeleton({ square = false }) {
  return (
    <Flex gap={3} px={4} py={3} align="center" borderBottom="1px solid" borderColor="border">
      {square ? <Skeleton w="48px" h="48px" flex="none" /> : <SkeletonCircle size="40px" flex="none" />}
      <Box flex="1">
        <Skeleton h="14px" w="40%" />
        <Skeleton h="10px" w="25%" mt={2} />
      </Box>
      <Skeleton h="32px" w="72px" />
    </Flex>
  );
}

export function PostSkeleton() {
  return (
    <Flex gap={3} px={4} py={3} borderBottom="1px solid" borderColor="border">
      <SkeletonCircle size="40px" flex="none" />
      <Box flex="1">
        <Skeleton h="14px" w="35%" />
        <Skeleton h="12px" w="90%" mt={3} />
        <Skeleton h="12px" w="70%" mt={2} />
      </Box>
    </Flex>
  );
}
