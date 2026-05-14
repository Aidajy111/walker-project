export function getRouteHref(route) {
  if (route?.documentId) {
    return `/route/${route.documentId}`;
  }
  return "/route";
}
