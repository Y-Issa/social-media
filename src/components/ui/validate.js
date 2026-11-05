const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email.trim()) return "Enter your email.";
  if (!EMAIL.test(email.trim())) return "That doesn't look like an email address.";
  return null;
}
