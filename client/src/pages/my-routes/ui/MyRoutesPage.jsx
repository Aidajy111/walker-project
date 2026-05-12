import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { Button } from "../../../shared/ui/button/Button";
import { deleteSavedRoute, fetchMySavedRoutes } from "../../../shared/api/savedRoutesApi";
import { getRouteHref } from "../../../shared/lib/routeHref";
import { RouteCard } from "../../../entities/route-card/ui/RouteCard";
import styles from "./MyRoutesPage.module.css";

export function MyRoutesPage() {
  const { jwt, isReady } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadSaved = useCallback(async () => {
    if (!jwt) return;
    setLoading(true);
    setError("");
    try {
      const list = await fetchMySavedRoutes(jwt);
      setRoutes(list);
    } catch (err) {
      setError(err?.message || "Не удалось загрузить сохранённые маршруты.");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    if (!isReady || !jwt) return;
    loadSaved();
  }, [isReady, jwt, loadSaved]);

  async function handleDelete(savedDocumentId) {
    if (!jwt || !savedDocumentId) return;
    if (!window.confirm("Удалить маршрут из сохранённых?")) return;
    setDeletingId(savedDocumentId);
    try {
      await deleteSavedRoute(jwt, savedDocumentId);
      setRoutes((prev) => prev.filter((r) => r.savedDocumentId !== savedDocumentId));
    } catch (err) {
      setError(err?.message || "Не удалось удалить.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Мои маршруты</h1>

        {loading && isReady ? <p className={styles.hint}>Загрузка…</p> : null}
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        {!loading && routes.length === 0 ? (
          <p className={styles.empty}>
            Пока нет сохранённых маршрутов. Откройте{" "}
            <Link className={styles.emptyLink} to="/search">
              поиск
            </Link>{" "}
            или карточку маршрута и нажмите «Сохранить маршрут».
          </p>
        ) : null}

        <div className={styles.grid}>
          {routes.map((route) => (
            <RouteCard
              key={route.savedDocumentId}
              {...route}
              href={getRouteHref(route)}
              footer={
                <div className={styles.actions}>
                  <Button
                    variant="secondary"
                    className={styles.deleteButton}
                    type="button"
                    disabled={deletingId === route.savedDocumentId}
                    onClick={() => handleDelete(route.savedDocumentId)}
                  >
                    {deletingId === route.savedDocumentId ? "Удаление…" : "Удалить"}
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
