import { Button, Flex, Spacer, Text, Textarea, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../../queries/posts";
import { replacePostInCaches } from "../../queries/postCache";
import { errorMessage } from "../../axios";
import { useAutoGrow } from "./useAutoGrow";
import { MAX_POST_LENGTH } from "./Composer";
import CharCount from "./CharCount";

// Inline editor that replaces a post's body while editing.
function PostEditor({ post, onDone }) {
  const [text, setText] = useState(post.description ?? "");
  const ref = useAutoGrow(text);
  const queryClient = useQueryClient();
  const toast = useToast();

  // Focus on the frame after the ⋯ menu returns focus to its button.
  useEffect(() => {
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        el.focus({ preventScroll: true });
        el.setSelectionRange(el.value.length, el.value.length);
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [ref]);

  const mutation = useMutation({
    mutationFn: () => updatePost(post.postId, text.trim()),
    onSuccess: (row) => {
      replacePostInCaches(queryClient, row);
      toast({ title: "Post updated.", status: "success" });
      onDone();
    },
    onError: (error) =>
      toast({ title: "Couldn't update post", description: errorMessage(error), status: "error" }),
  });

  const trimmed = text.trim();
  const tooLong = text.length > MAX_POST_LENGTH;
  const isEmpty = !trimmed && !post.image;
  const unchanged = trimmed === (post.description ?? "").trim();
  const canSave = !isEmpty && !tooLong && !unchanged && !mutation.isLoading;

  function handleSubmit(e) {
    e.preventDefault();
    if (canSave) mutation.mutate();
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      onDone();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  }

  return (
    <Flex as="form" direction="column" onSubmit={handleSubmit} mt={1.5} maxW="560px">
      <Textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Edit post"
        rows={2}
        resize="none"
        fontSize="15px"
        lineHeight="22px"
        py={2}
      />
      <Flex align="center" gap={2} mt={2}>
        <Text textStyle="meta" display={{ base: "none", sm: "block" }}>
          esc to cancel
        </Text>
        <Spacer />
        <CharCount length={text.length} max={MAX_POST_LENGTH} />
        <Button size="sm" variant="ghost" onClick={onDone} isDisabled={mutation.isLoading}>
          Cancel
        </Button>
        <Button size="sm" variant="primary" type="submit" isDisabled={!canSave} isLoading={mutation.isLoading}>
          Save
        </Button>
      </Flex>
    </Flex>
  );
}

export default PostEditor;
