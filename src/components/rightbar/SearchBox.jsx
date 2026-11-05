import { Input, InputGroup, InputLeftElement, Tooltip } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

// Visual only until search exists.
function SearchBox() {
  return (
    <Tooltip label="Coming soon" placement="bottom-start" openDelay={200}>
      <InputGroup role="search">
        <InputLeftElement pointerEvents="none" color="text-muted" h="40px">
          <LuSearch size={18} />
        </InputLeftElement>
        <Input
          aria-label="Search Communet"
          placeholder="Search Communet"
          isDisabled
          _disabled={{ opacity: 1, cursor: "not-allowed" }}
        />
      </InputGroup>
    </Tooltip>
  );
}

export default SearchBox;
