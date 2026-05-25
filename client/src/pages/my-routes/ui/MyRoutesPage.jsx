import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { Button } from "../../../shared/ui/button/Button";
import { deleteSavedRoute, fetchMySavedRoutes } from "../../../shared/api/savedRoutesApi";
import { getRouteHref } from "../../../shared/lib/routeHref";
import { RouteCard, RouteCardSkeleton } from "../../../entities/route-card/ui/RouteCard";
import { Pagination } from "../../../shared/ui/pagination/Pagination";
import styles from "./MyRoutesPage.module.css";

const PAGE_SIZE = 10;
const SKELETON_COUNT = 4;

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
          {loading && isReady
            ? Array.from({ length: SKELETON_COUNT }, (_, item) => <RouteCardSkeleton key={item} />)
            : visibleRoutes.map((route) => {
                const isDeleting = deletingId === route.savedDocumentId;
                return (
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
                          disabled={isDeleting}
                          onClick={() => handleDelete(route.savedDocumentId)}
                        >
                          <span className={styles.buttonContent}>
                            {isDeleting ? <span className={styles.buttonSpinner} aria-hidden="true" /> : null}
                            <span>Удалить маршрут</span>
                          </span>
                        </Button>
                      </div>
                    }
                  />
                );
              })}
        </div>
        {!loading && routes.length > 0 ? (
          <div className={styles.paginationWrap}>
            <Pagination currentPage={normalizedPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
