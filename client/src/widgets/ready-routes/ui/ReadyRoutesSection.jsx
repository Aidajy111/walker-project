import { useEffect, useMemo, useState } from "react";
import { RouteCard, RouteCardSkeleton } from "../../../entities/route-card/ui/RouteCard";
import { fetchRoutesList } from "../../../shared/api/routesApi";
import { useSaveRoute } from "../../../shared/hooks/useSaveRoute";
import { getRouteHref } from "../../../shared/lib/routeHref";
import { Toast } from "../../../shared/ui/toast/Toast";
import styles from "./ReadyRoutesSection.module.css";

const arrowDark = "https://www.figma.com/api/mcp/asset/8bfaf8c9-a15a-46eb-877b-50994b77c18e";
const SKELETON_COUNT = 2;

export function ReadyRoutesSection() {
  const [routes, setRoutes] = useState([]);
  const [index, setIndex] = useState(0);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [toastType, setToastType] = useState("success");
  const [savingDocId, setSavingDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { isRouteSaved, toggleRouteSaved } = useSaveRoute();
  const maxIndex = Math.max(0, routes.length - 2);
  const offset = useMemo(() => index * 375, [index]);

  useEffect(() => {
    let mounted = true;
    async function loadRoutes() {
      setLoading(true);
      setLoadError("");
      try {
        const cmsRoutes = await fetchRoutesList();
        if (!mounted) return;
        setRoutes(cmsRoutes.slice(0, 8));
      } catch (err) {
        if (!mounted) return;
        setLoadError(err?.message || "Не удалось загрузить маршруты.");
        setRoutes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRoutes();
    return () => {
      mounted = false;
    };
  }, []);

  function prevSlide() {
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }

  function nextSlide() {
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  }

  async function handleSaveRoute(route) {
    const docId = route.documentId || route.id;
    setSaveFeedback("");
    setSavingDocId(docId);
    const result = await toggleRouteSaved(route);
    setSavingDocId(null);
    if (result.ok) {
      setToastType("success");
      setSaveFeedback(result.action === "deleted" ? "Маршрут удален из «Мои маршруты»." : "Маршрут сохранен в «Мои маршруты».");
    } else if (result.error !== "auth") {
      setToastType("error");
      setSaveFeedback(result.error);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Готовые маршруты</h2>
        <div className={styles.controls}>
          <button type="button" className={styles.controlButton} aria-label="Предыдущие" onClick={prevSlide}>
            <img className={styles.prevIcon} src={arrowDark} alt="" />
          </button>
          <button type="button" className={styles.controlButton} aria-label="Следующие" onClick={nextSlide}>
            <img src={arrowDark} alt="" />
          </button>
        </div>
      </div>

      <Toast message={saveFeedback} type={toastType} onClose={() => setSaveFeedback("")} />
      {loadError ? (
        <p className={styles.saveFeedback} role="alert">
          {loadError}
        </p>
      ) : null}

      <div className={styles.cardsViewport}>
        {loading ? (
          <div className={styles.cardsTrack}>
            {Array.from({ length: SKELETON_COUNT }, (_, item) => (
              <RouteCardSkeleton key={item} />
            ))}
          </div>
        ) : routes.length > 0 ? (
          <div className={styles.cardsTrack} style={{ transform: `translateX(-${offset}px)` }}>
            {routes.map((route) => {
              const docId = route.documentId || route.id;
              const isSaved = isRouteSaved(route);
              return (
                <RouteCard
                  key={route.id}
                  {...route}
                  href={getRouteHref(route)}
                  onSave={() => handleSaveRoute(route)}
                  saveDisabled={savingDocId === docId}
                  isSaving={savingDocId === docId}
                  saveButtonText={isSaved ? "Удалить маршрут" : "Сохранить маршрут"}
                />
              );
            })}
          </div>
        ) : (
          <p className={styles.saveFeedback}>Маршрутов пока нет.</p>
        )}
      </div>
    </section>
  );
}
