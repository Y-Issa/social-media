import {
  Box,
  Button,
  Card,
  Heading,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { makeRequest } from "../axios";
import { Form, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FormControlInput from "../components/FormControlInput";

function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let localError = null;
    setIsSubmitting(true);
    try {
      await makeRequest.post("/auth/register", formData);
      await login({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (error) {
      localError = error.response
        ? error.response.data || "Unknown error occurred."
        : "Could not reach the server.";
    } finally {
      setIsSubmitting(false);
      toast({
        position: "top",
        title: localError ? "Error" : "Success",
        description: localError ? localError : "Account created successfully",
        status: localError ? "error" : "success",
        variant: localError ? "left-accent" : "solid",
        duration: 4000,
      });
    }
  }

  if (user && !isSubmitting) return <Navigate to="/" />;

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
          <Form onSubmit={handleSubmit}>
            <FormControlInput
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
            <FormControlInput
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
            />
            <FormControlInput
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              mt={4}
              bgColor="primary.500"
              color="primary.50"
              _hover={{ bgColor: "primary.600" }}
              w="full"
              isLoading={isSubmitting}
            >
              Sign Up
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
