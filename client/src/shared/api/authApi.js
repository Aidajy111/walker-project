const CMS_URL = (process.env.REACT_APP_CMS_URL || process.env.REACT_APP_API_URL || "http://localhost:1337").replace(
  /\/$/,
  "",
);

function extractErrorMessage(data) {
  const err = data?.error;
  if (!err) return "Не удалось выполнить запрос.";
  if (typeof err.message === "string") return err.message;
  const details = err.details;
  if (Array.isArray(details?.errors)) {
    return details.errors.map((item) => item?.message).filter(Boolean).join(". ") || "Ошибка валидации.";
  }
  return "Не удалось выполнить запрос.";
}

async function parseJsonResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

async function request(method, path, { body, jwt } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = `Bearer ${jwt}`;
  const response = await fetch(`${CMS_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await parseJsonResponse(response);
  if (!response.ok) {
    const message = extractErrorMessage(data);
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return data;
}

export function mapStrapiUser(user) {
  if (!user || typeof user !== "object") return null;
  return {
    id: String(user.id ?? ""),
    documentId: user.documentId ?? null,
    username: user.username ?? "",
    email: user.email ?? "",
    name: user.username || user.email || "Пользователь Walker",
  };
}

export async function loginRequest(identifier, password) {
  return request("POST", "/api/auth/local", {
    body: { identifier: identifier.trim(), password },
  });
}

export async function registerRequest({ username, email, password }) {
  return request("POST", "/api/auth/local/register", {
    body: {
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
    },
  });
}

export async function forgotPasswordRequest(email) {
  return request("POST", "/api/auth/forgot-password", {
    body: { email: email.trim().toLowerCase() },
  });
}

export async function resetPasswordRequest(code, password, passwordConfirmation) {
  return request("POST", "/api/auth/reset-password", {
    body: { code, password, passwordConfirmation },
  });
}

export async function fetchMe(jwt) {
  return request("GET", "/api/users/me", { jwt });
}
