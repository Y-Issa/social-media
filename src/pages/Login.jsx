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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FormControlInput from "../components/FormControlInput";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    let localError = null;
    try {
      await login({ email, password });
    } catch (error) {
      localError = error.response.data || "Unkown Error Occured.";
    } finally {
      toast({
        position: "top",
        title: localError ? "Error" : "Success",
        description: localError ? localError : "Logged in successfully",
        status: localError ? "error" : "success",
        variant: localError ? "left-accent" : "solid",
        duration: 4000,
      });
      if (!localError) {
        navigate("/");
      }
      localError = null;
    }
  }

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

        <VStack spacing={4} w="full">
          <Heading size={{ base: "md", lg: "2xl" }}>Sign In</Heading>
          <Form onSubmit={handleSubmit}>
            <FormControlInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            <FormControlInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
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
