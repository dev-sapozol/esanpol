export async function loginWithHttpOnlyCookie(
  email: string,
  password: string,
  t: (key: string) => string
): Promise<"success" | "invalid-credentials" | "error"> {
  try {
    const response = await fetch(`${import.meta.env.VITE_POST_API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (response.ok) {
      return "success"
    }

    const data = await response.json()

    if (response.status === 401 && data?.error === "invalid-credentials") {
      return "invalid-credentials"
    }

    return "error"
  } catch (error) {
    console.error("Login error:", error)
    return "error"
  }
}
