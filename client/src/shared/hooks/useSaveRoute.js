import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { deleteSavedRoute, fetchSavedRouteIndex, saveRoute } from "../api/savedRoutesApi";

export function useSaveRoute() {
  const { jwt, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [savedRoutesById, setSavedRoutesById] = useState({});

  const refreshSavedRoutes = useCallback(async () => {
    if (!isAuthenticated || !jwt) {
      setSavedRoutesById({});
      return {};
    }

    const index = await fetchSavedRouteIndex(jwt);
    setSavedRoutesById(index);
    return index;
  }, [isAuthenticated, jwt]);

  useEffect(() => {
    refreshSavedRoutes().catch(() => setSavedRoutesById({}));
  }, [refreshSavedRoutes]);

  const getSavedDocumentId = useCallback(
    (route) => {
      const routeId = typeof route === "object" ? route?.documentId || route?.id : route;
      return routeId ? savedRoutesById[String(routeId)] || null : null;
    },
    [savedRoutesById],
  );

  const isRouteSaved = useCallback((route) => Boolean(getSavedDocumentId(route)), [getSavedDocumentId]);

  const requireRouteId = useCallback((routeDocumentId) => {
    if (!routeDocumentId) {
      return { ok: false, error: "Нет идентификатора маршрута." };
    }
    return null;
  }, []);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated || !jwt) {
      navigate("/profile", { state: { from: `${location.pathname}${location.search}` } });
      return { ok: false, error: "auth" };
    }
    return null;
  }, [isAuthenticated, jwt, location.pathname, location.search, navigate]);

  const saveRouteByDocumentId = useCallback(
    async (routeDocumentId) => {
      const idError = requireRouteId(routeDocumentId);
      if (idError) return idError;

      const authError = requireAuth();
      if (authError) return authError;

      try {
        await saveRoute(jwt, routeDocumentId);
        await refreshSavedRoutes();
        return { ok: true, action: "saved" };
      } catch (err) {
        return { ok: false, error: err?.message || "Не удалось сохранить." };
      }
    },
    [jwt, refreshSavedRoutes, requireAuth, requireRouteId],
  );

  const toggleRouteSaved = useCallback(
    async (route) => {
      const routeDocumentId = typeof route === "object" ? route?.documentId || route?.id : route;
      const idError = requireRouteId(routeDocumentId);
      if (idError) return idError;

      const authError = requireAuth();
      if (authError) return authError;

      const savedDocumentId = getSavedDocumentId(route);

      try {
        if (savedDocumentId) {
          await deleteSavedRoute(jwt, savedDocumentId);
          setSavedRoutesById((prev) => {
            const next = { ...prev };
            delete next[String(routeDocumentId)];
            if (route?.id) delete next[String(route.id)];
            if (route?.documentId) delete next[String(route.documentId)];
            return next;
          });
          return { ok: true, action: "deleted" };
        }

        await saveRoute(jwt, routeDocumentId);
        await refreshSavedRoutes();
        return { ok: true, action: "saved" };
      } catch (err) {
        return { ok: false, error: err?.message || "Не удалось изменить сохранение." };
      }
    },
    [getSavedDocumentId, jwt, refreshSavedRoutes, requireAuth, requireRouteId],
  );

  return useMemo(
    () => ({
      getSavedDocumentId,
      isRouteSaved,
      refreshSavedRoutes,
      savedRoutesById,
      saveRouteByDocumentId,
      toggleRouteSaved,
    }),
    [getSavedDocumentId, isRouteSaved, refreshSavedRoutes, savedRoutesById, saveRouteByDocumentId, toggleRouteSaved],
  );
}
