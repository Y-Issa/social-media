import {
  Box,
  Card,
  Heading,
  Text,
  Button,
  FormControl,
  Input,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import { Form, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    const formData = { email, password };
    console.log(formData);
    login();
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgColor="gray.100"
      h="100vh"
    >
      <Card
        display="flex"
        flexDirection="row"
        bgColor="red.50"
        gap={8}
        p={8}
        borderRadius="md"
        boxShadow="lg"
        minW="340px"
        minH={{ base: "auto", sm: "344px" }}
      >
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
            <Link to="/register">Don't have an account? Sign up now!</Link>
          </Button>
        </VStack>

        <VStack spacing={4} align={{ base: "center", sm: "start" }}>
          <Heading size={{ base: "md", lg: "2xl" }}>Sign In</Heading>
          <Form onSubmit={handleSubmit}>
            <FormControl>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              mt={4}
              colorScheme="blue"
              variant="outline"
              w="full"
            >
              Login
            </Button>
            <Button
              variant="link"
              mt={4}
              display={{ base: "block", sm: "none" }}
            >
              <Link to="/register">Don't have an account? Sign up now!</Link>
            </Button>
          </Form>
        </VStack>
      </Card>
    </Box>
  );
}

export default Login;
