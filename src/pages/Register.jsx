import { Button, Link, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { makeRequest, errorMessage } from "../axios";
import { useAuth } from "../contexts/AuthContext";
import FormControlInput from "../components/FormControlInput";
import AuthLayout from "../components/ui/AuthLayout";
import FormError from "../components/ui/FormError";
import { validateEmail } from "../components/ui/validate";

const MIN_PASSWORD = 6;

function validate({ name, email, password }) {
  let passwordError = null;
  if (!password) passwordError = "Choose a password.";
  else if (password.length < MIN_PASSWORD)
    passwordError = `Use at least ${MIN_PASSWORD} characters.`;
  return {
    name: name.trim() ? null : "Enter your name.",
    email: validateEmail(email),
    password: passwordError,
  };
}

function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = validate(values);
  const show = (field) => (submitted || touched[field]) && errors[field];

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setServerError(null);
  }
  const handleBlur = (e) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    setIsSubmitting(true);
    const payload = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
    };
    try {
      await makeRequest.post("/auth/register", payload);
      await login({ email: payload.email, password: payload.password });
      toast({ title: "Welcome to Communet.", status: "success" });
      navigate("/");
    } catch (error) {
      setServerError(errorMessage(error, "Couldn't create your account."));
      setIsSubmitting(false);
    }
  }

  if (user && !isSubmitting) return <Navigate to="/" />;

  return (
    <AuthLayout
      title="Create an account"
      subtitle="It takes about a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link as={RouterLink} to="/login" fontWeight={600}>
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={4}>
          <FormControlInput
            label="Name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={show("name")}
            isRequired
          />
          <FormControlInput
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={show("email")}
            isRequired
          />
          <FormControlInput
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={show("password")}
            helper={`At least ${MIN_PASSWORD} characters.`}
            isRequired
          />
          <FormError>{serverError}</FormError>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            w="full"
            isLoading={isSubmitting}
            mt={2}
          >
            Create account
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}

export default Register;
