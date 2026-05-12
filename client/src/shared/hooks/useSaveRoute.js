import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { saveRoute } from "../api/savedRoutesApi";

export function useSaveRoute() {
  const { jwt, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const saveRouteByDocumentId = useCallback(
    async (routeDocumentId) => {
      if (!routeDocumentId) {
        return { ok: false, error: "Нет идентификатора маршрута." };
      }
      if (!isAuthenticated || !jwt) {
        navigate("/profile", { state: { from: `${location.pathname}${location.search}` } });
        return { ok: false, error: "auth" };
      }
      try {
        await saveRoute(jwt, routeDocumentId);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err?.message || "Не удалось сохранить." };
      }
    },
    [isAuthenticated, jwt, location.pathname, location.search, navigate],
  );

  return { saveRouteByDocumentId };
}
