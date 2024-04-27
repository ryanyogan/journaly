export function validate(email: string, password: string) {
  let errors: { email?: string; password?: string } = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    errors.email = "Invalid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password is too short";
  }

  return Object.keys(errors).length ? errors : null;
}
