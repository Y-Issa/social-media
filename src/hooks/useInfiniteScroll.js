import { useEffect, useRef } from "react";

// Returns a ref for a sentinel element; when it scrolls into view (or
// within `rootMargin` of it) and there is another page, onLoadMore runs.
export function useInfiniteScroll({ hasMore, isLoading, onLoadMore, rootMargin = "400px" }) {
  const ref = useRef(null);
  const loadMore = useRef(onLoadMore);
  loadMore.current = onLoadMore;

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasMore || isLoading) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore.current();
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, rootMargin]);

  return ref;
}
