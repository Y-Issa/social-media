import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Link,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../imageUrl";
import UpdateProfile from "./UpdateProfile";
import MessageButton from "../messages/MessageButton";
import { plural, toHandle, websiteHref, websiteLabel } from "../ui/format";

// Fine diagonal hatch on surface-raised when there's no cover image.
function CoverFallback() {
  return (
    <Box
      w="full"
      h="full"
      bg="surface-raised"
      backgroundImage="repeating-linear-gradient(135deg, var(--chakra-colors-border) 0 1px, transparent 1px 9px)"
    />
  );
}

function Cover({ image }) {
  return (
    <AspectRatio ratio={3} w="full" borderBottom="1px solid" borderColor="border">
      {image ? (
        <Image
          src={getImageUrl(image)}
          alt=""
          objectFit="cover"
          fallback={<CoverFallback />}
        />
      ) : (
        <CoverFallback />
      )}
    </AspectRatio>
  );
}

function Stat({ value, label }) {
  return (
    <Text as="span" fontSize="14px" color="text-muted">
      <Text as="span" fontFamily="mono" fontWeight={500} color="text-primary">
        {value}
      </Text>{" "}
      {label}
    </Text>
  );
}

function joinedLabel(createdAt) {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? null : `Joined ${format(date, "MMM yyyy")}`;
}

// Profile header: cover, overlapping avatar, serif name, meta, stats, action.
function UserInfo({
  user,
  followerCount,
  isFollowing,
  isFollowLoading,
  isRelationshipsLoading,
  onToggleFollow,
}) {
  const { user: currentUser } = useAuth();
  const isSelf = currentUser.userId === user.userId;
  const href = websiteHref(user.website);
  const joined = joinedLabel(user.createdAt);
  const followers = user.followerCount ?? followerCount;

  const meta = [
    user.city && <Text as="span" key="city">{user.city}</Text>,
    href && (
      <Link key="web" href={href} isExternal rel="noopener noreferrer">
        {websiteLabel(user.website)} ↗
      </Link>
    ),
    joined && <Text as="span" key="joined">{joined}</Text>,
  ].filter(Boolean);

  return (
    <Box as="header">
      <Cover image={user.coverImage} />
      <Box px={4} pb={4}>
        <Flex justify="space-between" align="flex-start" minH="56px">
          <Avatar
            size="xl"
            name={user.name}
            src={getImageUrl(user.profileImage)}
            mt="-44px"
            boxShadow="0 0 0 4px var(--chakra-colors-surface), inset 0 0 0 1px var(--chakra-colors-border)"
          />
          <Box pt={3}>
            {isSelf ? (
              <UpdateProfile />
            ) : isRelationshipsLoading ? (
              <Skeleton h="36px" w="96px" />
            ) : (
              <HStack spacing={2}>
                <MessageButton userId={user.userId} />
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  onClick={onToggleFollow}
                  isLoading={isFollowLoading}
                  minW="96px"
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </HStack>
            )}
          </Box>
        </Flex>

        <Heading
          as="h1"
          variant="display"
          fontSize={{ base: "32px", sm: "40px" }}
          lineHeight={{ base: "36px", sm: "44px" }}
          mt={2}
          wordBreak="break-word"
        >
          {user.name}
        </Heading>
        <Text textStyle="meta" mt={1}>
          {toHandle(user)}
        </Text>
        {user.bio && (
          <Text mt={3} fontSize="15px" lineHeight="22px" maxW="560px">
            {user.bio}
          </Text>
        )}
        {meta.length > 0 && (
          <Flex mt={3} wrap="wrap" columnGap={2} fontSize="14px" color="text-muted">
            {meta.flatMap((item, i) =>
              i === 0
                ? [item]
                : [<Text as="span" key={`sep-${i}`} aria-hidden>·</Text>, item]
            )}
          </Flex>
        )}
        <HStack mt={3} spacing={5}>
          {followers == null ? (
            <Skeleton h="14px" w="96px" />
          ) : (
            <Stat value={followers} label={followers === 1 ? "follower" : "followers"} />
          )}
          {user.followingCount != null && (
            <Stat value={user.followingCount} label="following" />
          )}
          {user.postCount != null && (
            <Text as="span" fontSize="14px" color="text-muted">
              {plural(user.postCount, "post")}
            </Text>
          )}
        </HStack>
      </Box>
    </Box>
  );
}

export function UserInfoSkeleton() {
  return (
    <Box aria-busy="true" aria-label="Loading profile">
      <AspectRatio ratio={3} w="full">
        <Skeleton borderRadius={0} />
      </AspectRatio>
      <Box px={4} pb={4}>
        <Flex justify="space-between" minH="56px">
          <SkeletonCircle size="88px" mt="-44px" boxShadow="0 0 0 4px var(--chakra-colors-surface), inset 0 0 0 1px var(--chakra-colors-border)" />
          <Skeleton h="36px" w="96px" mt={3} />
        </Flex>
        <Skeleton h="32px" w="220px" mt={3} />
        <Skeleton h="12px" w="90px" mt={3} />
        <Skeleton h="14px" w="260px" mt={4} />
      </Box>
    </Box>
  );
}

export default UserInfo;
