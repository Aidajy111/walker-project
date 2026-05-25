import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { Button } from "../../../shared/ui/button/Button";
import { deleteSavedRoute, fetchMySavedRoutes } from "../../../shared/api/savedRoutesApi";
import { getRouteHref } from "../../../shared/lib/routeHref";
import { RouteCard } from "../../../entities/route-card/ui/RouteCard";
import { Pagination } from "../../../shared/ui/pagination/Pagination";
import styles from "./MyRoutesPage.module.css";

const PAGE_SIZE = 10;

export function MyRoutesPage() {
  const { jwt, isReady } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadSaved = useCallback(async () => {
    if (!jwt) return;
    setLoading(true);
    setError("");
    try {
      const list = await fetchMySavedRoutes(jwt);
      setRoutes(list);
      setCurrentPage(1);
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
      setRoutes((prev) => {
        const next = prev.filter((r) => r.savedDocumentId !== savedDocumentId);
        const nextTotalPages = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
        setCurrentPage((page) => Math.min(page, nextTotalPages));
        return next;
      });
    } catch (err) {
      setError(err?.message || "Не удалось удалить.");
    } finally {
      setDeletingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(routes.length / PAGE_SIZE));
  const normalizedPage = Math.min(currentPage, totalPages);
  const visibleRoutes = routes.slice((normalizedPage - 1) * PAGE_SIZE, normalizedPage * PAGE_SIZE);

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
          {visibleRoutes.map((route) => (
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
                    {deletingId === route.savedDocumentId ? "Удаление..." : "Удалить маршрут"}
                  </Button>
                </div>
              }
            />
          ))}
        </div>
        <div className={styles.paginationWrap}>
          <Pagination currentPage={normalizedPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </section>
  );
}
