import { Text } from "@chakra-ui/react";

function SoonTag(props) {
  return (
    <Text
      as="span"
      fontFamily="mono"
      fontSize="10px"
      lineHeight="14px"
      fontWeight={500}
      letterSpacing="0.06em"
      color="text-muted"
      border="1px solid"
      borderColor="border"
      borderRadius="sm"
      px="5px"
      {...props}
    >
      SOON
    </Text>
  );
}

export default SoonTag;
