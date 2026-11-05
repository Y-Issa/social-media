import { Button, Link, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { errorMessage } from "../axios";
import FormControlInput from "../components/FormControlInput";
import AuthLayout from "../components/ui/AuthLayout";
import FormError from "../components/ui/FormError";
import { validateEmail } from "../components/ui/validate";

function validate({ email, password }) {
  return {
    email: validateEmail(email),
    password: password ? null : "Enter your password.",
  };
}

function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
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
    if (errors.email || errors.password) return;
    setIsSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate("/");
    } catch (error) {
      setServerError(errorMessage(error, "Couldn't log you in."));
      setIsSubmitting(false);
    }
  }

  if (user && !isSubmitting) return <Navigate to="/" />;

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back."
      footer={
        <>
          New here?{" "}
          <Link as={RouterLink} to="/register" fontWeight={600}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={4}>
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
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={show("password")}
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
            Log in
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}

export default Login;
