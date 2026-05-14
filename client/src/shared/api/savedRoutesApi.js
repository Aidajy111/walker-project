import { mapRoute } from "./routesApi";

const CMS_URL = (process.env.REACT_APP_CMS_URL || process.env.REACT_APP_API_URL || "http://localhost:1337").replace(/\/$/, "");

function normalizeEntity(raw) {
  if (!raw) return null;
  if (raw.attributes && typeof raw.attributes === "object") {
    return {
      id: raw.id,
      documentId: raw.documentId,
      ...raw.attributes,
    };
  }
  return raw;
}

function unwrapRoute(routeField) {
  if (!routeField) return null;
  const inner = routeField.data !== undefined ? routeField.data : routeField;
  return normalizeEntity(inner);
}

function authHeaders(jwt) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };
}

/**
 * Список сохранённых маршрутов текущего пользователя (развёрнутые карточки + id записи сохранения).
 */
export async function fetchMySavedRoutes(jwt) {
  const qs = new URLSearchParams();
  qs.set("populate[route][populate][0]", "cover");
  qs.sort();

  const response = await fetch(`${CMS_URL}/api/saved-routes?${qs.toString()}`, {
    headers: authHeaders(jwt),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `HTTP ${response.status}`);
  }

  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows
    .map((row) => {
      const flat = normalizeEntity(row);
      const routeEntity = unwrapRoute(flat.route);
      if (!routeEntity) return null;
      const savedDocumentId = flat.documentId || flat.id;
      const card = mapRoute(routeEntity);
      return {
        savedDocumentId: String(savedDocumentId),
        ...card,
      };
    })
    .filter(Boolean);
}

export async function saveRoute(jwt, routeDocumentId) {
  const response = await fetch(`${CMS_URL}/api/saved-routes`, {
    method: "POST",
    headers: authHeaders(jwt),
    body: JSON.stringify({
      data: {
        route: routeDocumentId,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `HTTP ${response.status}`);
  }
  return data;
}

export async function deleteSavedRoute(jwt, savedRouteDocumentId) {
  const response = await fetch(`${CMS_URL}/api/saved-routes/${encodeURIComponent(savedRouteDocumentId)}`, {
    method: "DELETE",
    headers: authHeaders(jwt),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok && response.status !== 204) {
    throw new Error(data?.error?.message || `HTTP ${response.status}`);
  }
  return data;
}
