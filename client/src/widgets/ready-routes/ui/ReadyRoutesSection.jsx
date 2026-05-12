import { useEffect, useMemo, useState } from "react";
import { RouteCard } from "../../../entities/route-card/ui/RouteCard";
import { fetchRoutesList } from "../../../shared/api/routesApi";
import { useSaveRoute } from "../../../shared/hooks/useSaveRoute";
import { getRouteHref } from "../../../shared/lib/routeHref";
import { mockRoutes } from "../../../shared/mocks/routes";
import styles from "./ReadyRoutesSection.module.css";

const arrowDark = "https://www.figma.com/api/mcp/asset/f964996e-be41-4062-827b-3abc753c4511";

export function ReadyRoutesSection() {
  const [routes, setRoutes] = useState(mockRoutes.slice(0, 4));
  const [index, setIndex] = useState(0);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [savingDocId, setSavingDocId] = useState(null);
  const { saveRouteByDocumentId } = useSaveRoute();
  const maxIndex = Math.max(0, routes.length - 2);
  const offset = useMemo(() => index * 375, [index]);

  useEffect(() => {
    let mounted = true;
    async function loadRoutes() {
      try {
        const cmsRoutes = await fetchRoutesList();
        if (!mounted || cmsRoutes.length === 0) return;
        setRoutes(cmsRoutes.slice(0, 8));
      } catch {
        // Fallback to mocks
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
    const result = await saveRouteByDocumentId(docId);
    setSavingDocId(null);
    if (result.ok) {
      setSaveFeedback("Маршрут добавлен в «Мои маршруты».");
    } else if (result.error !== "auth") {
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

      {saveFeedback ? (
        <p className={styles.saveFeedback} role="status">
          {saveFeedback}
        </p>
      ) : null}

      <div className={styles.cardsViewport}>
        <div className={styles.cardsTrack} style={{ transform: `translateX(-${offset}px)` }}>
          {routes.map((route) => {
            const docId = route.documentId || route.id;
            return (
              <RouteCard
                key={route.id}
                {...route}
                href={getRouteHref(route)}
                onSave={() => handleSaveRoute(route)}
                saveDisabled={savingDocId === docId}
                saveButtonText={savingDocId === docId ? "Сохранение…" : "Сохранить маршрут"}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
