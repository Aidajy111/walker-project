const CMS_URL = (process.env.REACT_APP_CMS_URL || process.env.REACT_APP_API_URL || "http://localhost:1337").replace(/\/$/, "");

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${CMS_URL}${url}`;
}

function flattenRichText(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => (Array.isArray(block?.children) ? block.children.map((child) => child?.text || "").join("") : ""))
    .filter(Boolean)
    .join(" ");
}

function normalizeMediaList(media) {
  if (Array.isArray(media)) return media;
  if (media?.data && Array.isArray(media.data)) return media.data.map((item) => item?.attributes || item).filter(Boolean);
  if (media?.data) return [media.data?.attributes || media.data].filter(Boolean);
  return [];
}

export function getPointHref(point) {
  const id = point?.documentId || point?.id;
  return id ? `/place/${id}` : "/place";
}

export function mapPointCard(point) {
  const images = normalizeMediaList(point?.images);
  const cover = images[0] || null;
  const description = point?.short_description || flattenRichText(point?.description) || "";
  const showOnHome = point?.show_on_home === true || point?.show_on_home === "true" || point?.show_on_home === 1;

  return {
    id: String(point?.documentId || point?.id || ""),
    documentId: point?.documentId || null,
    showOnHome,
    image: cover?.url ? toAbsoluteUrl(cover.url) : "/images/datsan.png",
    imageAlt: cover?.alternativeText || point?.title || "Точка",
    title: point?.title || "Точка",
    description: description.slice(0, 180) || "Описание точки отсутствует.",
    address: point?.address || "",
    href: getPointHref(point),
  };
}

async function fetchPoints(query) {
  const response = await fetch(`${CMS_URL}/api/points?${query}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  const points = Array.isArray(data?.data) ? data.data : [];
  return points.map(mapPointCard).filter((point) => point.id);
}

export function fetchHomePoints() {
  const params = new URLSearchParams();
  params.set("populate[0]", "images");
  params.set("filters[show_on_home][$eq]", "true");
  params.set("sort[0]", "createdAt:desc");
  params.set("pagination[pageSize]", "8");

  return fetchPoints(params.toString()).catch(async () => {
    const points = await fetchPointsList();
    return points.filter((point) => point.showOnHome).slice(0, 8);
  });
}

export function fetchPointsList() {
  const params = new URLSearchParams();
  params.set("populate[0]", "images");
  params.set("sort[0]", "createdAt:desc");
  params.set("pagination[pageSize]", "100");

  return fetchPoints(params.toString());
}
