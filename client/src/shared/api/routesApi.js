const CMS_URL = (process.env.REACT_APP_CMS_URL || process.env.REACT_APP_API_URL || "http://localhost:1337").replace(/\/$/, "");

const CHIP_COLORS = ["#ff8d3b", "#884cff", "#ff0048", "#0fae9f"];

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

export function mapRoute(route) {
  const cover = Array.isArray(route?.cover) && route.cover.length > 0 ? route.cover[0] : null;
  const tags = Array.isArray(route?.tags) ? route.tags : [];

  return {
    id: String(route?.id || ""),
    documentId: route?.documentId || null,
    image: cover?.url ? toAbsoluteUrl(cover.url) : "/images/datsan.png",
    imageAlt: route?.name_route || "Маршрут",
    title: route?.name_route || "Маршрут",
    description: (route?.short_description || flattenRichText(route?.description)).slice(0, 180) || "Описание маршрута отсутствует.",
    chips: tags.slice(0, 3).map((tag, index) => ({
      text: String(tag),
      color: CHIP_COLORS[index % CHIP_COLORS.length],
    })),
    season: route?.season || "",
    tags,
  };
}

export async function fetchRoutesList() {
  const response = await fetch(`${CMS_URL}/api/routes?populate[0]=cover&sort[0]=createdAt:desc`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  const routes = Array.isArray(data?.data) ? data.data : [];
  return routes.map(mapRoute).filter((route) => route.id);
}
