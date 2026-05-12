const CMS_URL = (process.env.REACT_APP_CMS_URL || "http://localhost:1337").replace(/\/$/, "");

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${CMS_URL}${url}`;
}

function normalizeDescription(description) {
  if (Array.isArray(description)) return description;
  if (typeof description === "string" && description.trim()) {
    const text = description.trim();
    if (text.startsWith("<") && text.endsWith(">")) {
      return [{ type: "html", html: text }];
    }
    return [
      {
        type: "paragraph",
        children: [{ type: "text", text }],
      },
    ];
  }
  if (description && Array.isArray(description?.content)) return description.content;
  return [];
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

function mapPlace(point) {
  const images = (Array.isArray(point?.images) ? point.images : []).slice(0, 5).map((media, index) => ({
    id: String(media?.id || index),
    src: toAbsoluteUrl(media?.url),
    title: media?.caption || "",
    text: media?.alternativeText || "",
  }));

  return {
    id: point?.documentId || point?.id,
    title: point?.title || "Точка маршрута",
    shortDescription: point?.short_description || point?.description || "",
    bodyBlocks: normalizeDescription(point?.description),
    images,
    heroImage: images[0]?.src || "/images/datsan.png",
    searchTag: point?.title || "",
  };
}

export async function fetchPlaceDetails(documentId) {
  const populate = "populate[0]=images";
  if (documentId) {
    const data = await fetchJson(`${CMS_URL}/api/points/${documentId}?${populate}`);
    return mapPlace(data?.data);
  }
  const data = await fetchJson(`${CMS_URL}/api/points?${populate}&pagination[pageSize]=1&sort[0]=createdAt:desc`);
  const first = Array.isArray(data?.data) ? data.data[0] : null;
  if (!first) throw new Error("No points found");
  return mapPlace(first);
}
