import { useEffect, useRef, useState } from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounced } from "../search/useDebounced";

// Typing (debounced 300ms) or Enter opens /search?q=... The search page has
// its own input, so this one hides there.
function SearchBox() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [text, setText] = useState("");
  const debounced = useDebounced(text.trim(), 300);
  const lastSent = useRef("");

  const go = (q) => {
    if (!q) return;
    lastSent.current = q;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setText("");
  };

  useEffect(() => {
    if (!debounced) lastSent.current = "";
    else if (debounced !== lastSent.current) go(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  if (pathname === "/search") return null;

  return (
    <InputGroup
      as="form"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(text.trim());
      }}
    >
      <InputLeftElement pointerEvents="none" color="text-muted" h="40px">
        <LuSearch size={18} />
      </InputLeftElement>
      <Input
        type="search"
        aria-label="Search Communet"
        placeholder="Search Communet"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setText("");
        }}
      />
    </InputGroup>
  );
}

export default SearchBox;
