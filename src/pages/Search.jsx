import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Tab,
  TabList,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import { LuSearch, LuX } from "react-icons/lu";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { errorMessage } from "../axios";
import { SEARCH_TYPES, useSearch, useSearchFollow, useSearchJoin } from "../queries/search";
import { useDebounced } from "../components/search/useDebounced";
import { GroupRow, PersonRow, PostSkeleton, RowSkeleton } from "../components/search/ResultRows";
import PostCard from "../components/posts/PostCard";
import EmptyState from "../components/ui/EmptyState";

const TABS = [
  { type: "all", label: "All" },
  { type: "users", label: "People" },
  { type: "posts", label: "Posts" },
  { type: "groups", label: "Groups" },
];

function searchHref(q, type) {
  const params = new URLSearchParams({ q });
  if (type !== "all") params.set("type", type);
  return `/search?${params}`;
}

function Section({ id, title, q, type, children }) {
  return (
    <Box as="section" aria-labelledby={id}>
      <Flex align="center" justify="space-between" px={4} pt={6} pb={2} borderBottom="1px solid" borderColor="border">
        <Text as="h2" id={id} textStyle="label">
          {title}
        </Text>
        <Link as={RouterLink} to={searchHref(q, type)} fontSize="13px" fontWeight={500}>
          See all
        </Link>
      </Flex>
      {children}
    </Box>
  );
}

function Skeletons({ type }) {
  if (type === "posts") return [0, 1, 2].map((i) => <PostSkeleton key={i} />);
  if (type === "all")
    return (
      <>
        <RowSkeleton />
        <RowSkeleton />
        <PostSkeleton />
        <PostSkeleton />
        <RowSkeleton square />
      </>
    );
  return [0, 1, 2, 3].map((i) => <RowSkeleton key={i} square={type === "groups"} />);
}

function Search() {
  const { user } = useAuth();
  const toast = useToast();
  const inputRef = useRef(null);
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const type = SEARCH_TYPES.includes(params.get("type")) ? params.get("type") : "all";

  const [text, setText] = useState(q);
  const debounced = useDebounced(text.trim(), 300);
  const pushed = useRef(q);

  const pushQuery = (next) => {
    pushed.current = next;
    setParams(
      (prev) => {
        const out = new URLSearchParams(prev);
        if (next) out.set("q", next);
        else out.delete("q");
        return out;
      },
      { replace: true }
    );
  };

  // Input -> URL (debounced).
  useEffect(() => {
    if (debounced !== pushed.current) pushQuery(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // URL -> input, when ?q changes from outside (e.g. the sidebar box).
  useEffect(() => {
    if (q !== pushed.current) {
      pushed.current = q;
      setText(q);
    }
  }, [q]);

  // Autofocus with the caret at the end.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  const setType = (index) => {
    const next = TABS[index].type;
    setParams(
      (prev) => {
        const out = new URLSearchParams(prev);
        if (next === "all") out.delete("type");
        else out.set("type", next);
        return out;
      },
      { replace: true }
    );
  };

  const clear = () => {
    setText("");
    pushQuery("");
    inputRef.current?.focus();
  };

  const result = useSearch(q, type);
  const follow = useSearchFollow();
  const join = useSearchJoin();

  const onToggleFollow = (person) =>
    follow.mutate(
      { userId: person.userId, isFollowing: Boolean(person.isFollowing) },
      {
        onError: (error) =>
          toast({ title: "Couldn't update follow.", description: errorMessage(error), status: "error" }),
      }
    );

  const onJoin = (group) =>
    join.mutate(group.groupId, {
      onSuccess: () => toast({ title: `You joined ${group.name}.`, status: "success" }),
      onError: (error) =>
        toast({ title: "Couldn't join the group.", description: errorMessage(error), status: "error" }),
    });

  const joiningId = join.isLoading ? join.variables : null;
  const data = result.data;
  const users = data?.users ?? [];
  const posts = data?.items ?? [];
  const groups = data?.groups ?? [];
  const isEmpty = data && !users.length && !posts.length && !groups.length;

  const people = (
    <Box as="ul" m={0} p={0}>
      {users.map((person) => (
        <PersonRow
          key={person.userId}
          person={person}
          term={q}
          isSelf={person.userId === user.userId}
          onToggleFollow={onToggleFollow}
        />
      ))}
    </Box>
  );
  const groupList = (
    <Box as="ul" m={0} p={0}>
      {groups.map((group) => (
        <GroupRow
          key={group.groupId}
          group={group}
          term={q}
          onJoin={onJoin}
          isJoining={joiningId === group.groupId}
        />
      ))}
    </Box>
  );
  const postList = posts.map((post) => <PostCard key={post.postId} post={post} />);

  let body;
  if (!q) {
    body = (
      <Text px={4} py={6} fontSize="14px" color="text-muted">
        Search for people, posts and groups.
      </Text>
    );
  } else if (result.isLoading) {
    body = (
      <Box aria-busy="true" aria-label="Searching">
        <Skeletons type={type} />
      </Box>
    );
  } else if (result.isError) {
    body = <EmptyState title="Search failed.">{errorMessage(result.error)}</EmptyState>;
  } else if (isEmpty) {
    body = (
      <EmptyState title={`No results for “${q}”.`}>
        Try a different spelling, or fewer words.
      </EmptyState>
    );
  } else if (type === "all") {
    body = (
      <>
        {users.length > 0 && (
          <Section id="search-people" title="People" q={q} type="users">
            {people}
          </Section>
        )}
        {posts.length > 0 && (
          <Section id="search-posts" title="Posts" q={q} type="posts">
            {postList}
          </Section>
        )}
        {groups.length > 0 && (
          <Section id="search-groups" title="Groups" q={q} type="groups">
            {groupList}
          </Section>
        )}
      </>
    );
  } else {
    body = type === "users" ? people : type === "groups" ? groupList : postList;
  }

  return (
    <>
      <Box
        position="sticky"
        top={{ base: "52px", md: 0 }}
        zIndex={2}
        bg="surface"
        borderBottom="1px solid"
        borderColor="border"
      >
        <Box
          as="form"
          role="search"
          px={4}
          pt={{ base: 3, md: 4 }}
          pb={2}
          onSubmit={(e) => {
            e.preventDefault();
            pushQuery(text.trim());
          }}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="text-muted" h="40px">
              <LuSearch size={18} />
            </InputLeftElement>
            <Input
              ref={inputRef}
              type="text"
              inputMode="search"
              enterKeyHint="search"
              aria-label="Search Communet"
              placeholder="Search people, posts and groups"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  clear();
                }
              }}
              pr="40px"
            />
            {text && (
              <InputRightElement h="40px">
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Clear search"
                  icon={<LuX size={16} />}
                  onClick={clear}
                  h="28px"
                  minW="28px"
                />
              </InputRightElement>
            )}
          </InputGroup>
        </Box>
        <Tabs index={TABS.findIndex((t) => t.type === type)} onChange={setType} variant="line">
          <TabList borderBottom="none" overflowX="auto" overflowY="hidden">
            {TABS.map((t) => (
              <Tab key={t.type} flex={{ base: 1, sm: "none" }} _focusVisible={{ boxShadow: "inset 0 0 0 2px var(--chakra-colors-accent)" }}>
                {t.label}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>

      <Box
        opacity={result.isPreviousData ? 0.6 : 1}
        transition="opacity 120ms"
      >
        {body}
      </Box>
    </>
  );
}

export default Search;
