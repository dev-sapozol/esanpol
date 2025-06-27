export type RegisterResult =
  | { status: "ok"; token: string }
  | { status: "email-already-exists" }
  | { status: "error" }

export async function registerWithHttpOnlyCookie(
  params: {
    name: string;
    password: string;
    email: string;
    fatherName: string;
    motherName: string;
    country: string;
    gender: string;
    birthday: string;
    timezone: string;
    role: string;
    language: string;
  },
  t: (key: string) => string
): Promise<RegisterResult> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_POST_API_URL}/register`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      }
    );

    if (response.ok) {
      const { token } = (await response.json()) as { token: string };
      return { status: "ok", token };
    }

    if (response.status === 401) {
      const data = await response.json();
      if (data?.error === "email-already-exists") {
        return { status: "email-already-exists" };
      }
    }

    return { status: "error" };
  } catch (err) {
    console.error("Register error:", err);
    return { status: "error" };
  }
}
