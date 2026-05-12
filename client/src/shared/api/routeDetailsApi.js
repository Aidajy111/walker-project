const CMS_URL = (process.env.REACT_APP_CMS_URL || "http://localhost:1337").replace(/\/$/, "");

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${CMS_URL}${url}`;
}

function mapPoint(point, fallbackImages) {
  const pointImages = Array.isArray(point?.images) ? point.images : [];
  const images = (pointImages.length > 0 ? pointImages : fallbackImages).map((media, index) => ({
    id: `${point?.id || "point"}-img-${media?.id || index}`,
    src: toAbsoluteUrl(media?.url),
    alt: point?.title || "Точка маршрута",
  }));

  const lat = Number(point?.coordinate?.lat);
  const lng = Number(point?.coordinate?.lng);

  return {
    id: String(point?.id || ""),
    documentId: point?.documentId || null,
    cardVariant: point?.card_variant || "default",
    badgeText: point?.badge_text || null,
    discountText: point?.discount_text || null,
    title: point?.title || "Точка маршрута",
    rating: typeof point?.rating === "number" ? point.rating : 0,
    workingHours: point?.working_hours || "Не указано",
    averageCheck: point?.average_check || "Не указан",
    address: point?.address || "Не указан",
    description: point?.short_description || point?.description || "Описание отсутствует.",
    images,
    bookingPhone: point?.booking_phone || null,
    href: point?.documentId ? `/place/${point.documentId}` : "/place",
    audioSrc: point?.audio?.url ? toAbsoluteUrl(point.audio.url) : null,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
  };
}

function mapRouteToUi(route) {
  const cover = Array.isArray(route?.cover) ? route.cover : [];
  const gallery = cover.map((media, index) => ({
    id: `route-cover-${media?.id || index}`,
    src: toAbsoluteUrl(media?.url),
    alt: route?.name_route || "Маршрут",
  }));

  const orderedLinks = Array.isArray(route?.route_points_links)
    ? [...route.route_points_links].sort((a, b) => (a?.order || 0) - (b?.order || 0))
    : [];

  const routePoints = orderedLinks
    .map((link) => mapPoint(link?.point, cover))
    .filter((point) => point.id);

  const bodyBlocks = Array.isArray(route?.description) ? route.description : [];

  return {
    id: route?.documentId || route?.id,
    routeSummary: {
      title: route?.name_route || "Маршрут",
      bodyBlocks,
      tags: Array.isArray(route?.tags) ? route.tags : [],
    },
    routeReviews: [],
    gallery,
    routePoints,
  };
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchRouteDetails(documentId) {
  const populate = "populate[0]=cover&populate[1]=route_points_links.point&populate[2]=route_points_links.point.images&populate[3]=route_points_links.point.audio";

  if (documentId) {
    const data = await fetchJson(`${CMS_URL}/api/routes/${documentId}?${populate}`);
    return mapRouteToUi(data?.data);
  }

  const data = await fetchJson(`${CMS_URL}/api/routes?${populate}&pagination[pageSize]=1&sort[0]=createdAt:desc`);
  const firstRoute = Array.isArray(data?.data) ? data.data[0] : null;
  if (!firstRoute) {
    throw new Error("No routes found");
  }
  return mapRouteToUi(firstRoute);
}
