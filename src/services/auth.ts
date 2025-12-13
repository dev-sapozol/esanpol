export async function authFetch(url: string, options: RequestInit = {}) {
  let token = sessionStorage.getItem("access_token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include"
  });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      sessionStorage.removeItem("access_token");
      window.location.href = "/login";
      return res;
    }

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${newToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include"
    });
  }

  return res;
}

export async function refreshAccessToken() {
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include"
  });

  const data = await res.json();

  if (data?.token) {
    sessionStorage.setItem("access_token", data.token);
    return data.token;
  }

  return null;
}
