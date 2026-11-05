import { useLayoutEffect, useRef } from "react";

// Grows a textarea to fit its content (up to maxHeight) whenever value
// changes. Returns the ref to attach.
export function useAutoGrow(value, maxHeight = 480) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);

  return ref;
}
