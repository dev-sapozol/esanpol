
export const authConfig = {
  verifyEmailEndpoint: "http://localhost:4000/api/auth/verify-email",
  loginEndpoint: "http://localhost:4000/api/auth/login",
  labels: {
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    emailButton: "Next",
    passwordButton: "Login",
    invalidEmail: "Email not found",
    back: "Back",
  },
  onSuccess: (token: string) => console.log("Logged in", token),
  onError: (msg: string) => console.error(msg),
};
