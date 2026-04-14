
export const authConfig = {
  verifyEmailEndpoint: `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
  loginEndpoint: `${import.meta.env.VITE_API_URL}/api/auth/login`,
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
