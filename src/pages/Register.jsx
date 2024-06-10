import {
  Box,
  Button,
  Card,
  FormControl,
  Heading,
  Input,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form, Link } from "react-router-dom";

function Register() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgColor="bgColor.300"
    >
      <Card
        display="flex"
        flexDirection="row"
        bgColor="bgColor.100"
        color="textColor.100"
        gap={8}
        p={8}
        borderRadius="md"
        boxShadow="lg"
        minW="340px"
        minH={{ base: "auto", sm: "344px" }}
      >
        <VStack spacing={4} w="full">
          <Heading size={{ base: "md", lg: "2xl" }}>Sign Up</Heading>
          <Form>
            <FormControl>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="off"
                isRequired
                focusBorderColor="primary.100"
                borderColor="bgColor.400"
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                isRequired
                focusBorderColor="primary.100"
                borderColor="bgColor.400"
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                isRequired
                focusBorderColor="primary.100"
                borderColor="bgColor.400"
              />
            </FormControl>
            <Button
              type="submit"
              mt={4}
              bgColor="primary.500"
              color="primary.50"
              _hover={{ bgColor: "primary.600" }}
              w="full"
            >
              Login
            </Button>
            <Button
              w="full"
              variant="link"
              mt={4}
              display={{ base: "block", sm: "none" }}
            >
              <Link to="/login">Already have an account?</Link>
            </Button>
          </Form>
        </VStack>
        <VStack
          spacing={4}
          align="start"
          maxW={{ base: "200px", md: "300px" }}
          display={{ base: "none", sm: "flex" }}
        >
          <Heading size={{ base: "sm", lg: "xl" }}>Welcome to Communet</Heading>
          <Text>
            Connect with friends, share your moments, and explore what's
            happening around you. Join Communet today and be a part of our
            growing community. If you already have an account, sign in now!
          </Text>
          <Spacer />
          <Button variant="link" mt={4}>
            <Link to="/login">Already have an account?</Link>
          </Button>
        </VStack>
      </Card>
    </Box>
  );
}

export default Register;
