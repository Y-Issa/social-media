import { Flex, Heading, Text } from "@chakra-ui/react";

// Serif page title with an optional mono kicker and a right-side action.
function PageHeader({ title, kicker, action, ...props }) {
  return (
    <Flex
      as="header"
      align="flex-end"
      justify="space-between"
      gap={4}
      px={4}
      pt={{ base: 5, md: 8 }}
      pb={4}
      borderBottom="1px solid"
      borderColor="border"
      {...props}
    >
      <div>
        {kicker && (
          <Text textStyle="label" mb={1}>
            {kicker}
          </Text>
        )}
        <Heading as="h1" variant="display" fontSize={{ base: "28px", md: "40px" }} lineHeight={{ base: "32px", md: "44px" }}>
          {title}
        </Heading>
      </div>
      {action}
    </Flex>
  );
}

export default PageHeader;
