export async function logoutWithHttpOnlyCookie(): Promise<"logout" | "error"> {
  try {
    const res = await fetch(`${import.meta.env.VITE_POST_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      return "logout";
    }

    return "error";
  } catch (error) {
    console.error("Logout error:", error);
    return "error";
  }
}
