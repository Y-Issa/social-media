import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Go to the home feed and put the cursor in the composer.
export function useNewPost() {
  const navigate = useNavigate();

  return useCallback(() => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    let tries = 0;
    const focus = () => {
      const el =
        document.getElementById("composer") ||
        document.querySelector("main textarea");
      if (el) {
        el.focus({ preventScroll: true });
      } else if (tries++ < 30) {
        requestAnimationFrame(focus);
      }
    };
    requestAnimationFrame(focus);
  }, [navigate]);
}
