import { useEffect, useMemo, useState } from "react";
import { DestinationCard } from "../../../entities/destination-card/ui/DestinationCard";
import { fetchPointsList } from "../../../shared/api/pointsApi";
import { Pagination } from "../../../shared/ui/pagination/Pagination";
import styles from "./PointsPage.module.css";

const PAGE_SIZE = 9;

export function PointsPage() {
  const [points, setPoints] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;

    async function loadPoints() {
      try {
        const nextPoints = await fetchPointsList();
        if (mounted) setPoints(nextPoints);
      } catch {
        if (mounted) setPoints([]);
      }
    }

    loadPoints();

    return () => {
      mounted = false;
    };
  }, []);

  const visiblePoints = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return points;

    return points.filter((point) =>
      [point.title, point.description, point.address].filter(Boolean).join(" ").toLowerCase().includes(query),
    );
  }, [points, search]);

  const totalPages = Math.max(1, Math.ceil(visiblePoints.length / PAGE_SIZE));
  const normalizedPage = Math.min(currentPage, totalPages);
  const paginatedPoints = visiblePoints.slice((normalizedPage - 1) * PAGE_SIZE, normalizedPage * PAGE_SIZE);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Точки</h1>
        <input
          className={styles.searchInput}
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Поиск по точкам"
          aria-label="Поиск по точкам"
        />
      </div>

      {points.length === 0 ? (
        <p className={styles.emptyText}>Точек пока нету</p>
      ) : visiblePoints.length > 0 ? (
        <>
          <div className={styles.cardsGrid}>
            {paginatedPoints.map((point) => (
              <DestinationCard key={point.id} {...point} />
            ))}
          </div>
          <div className={styles.paginationWrap}>
            <Pagination currentPage={normalizedPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </>
      ) : (
        <p className={styles.emptyText}>Ничего не найдено</p>
      )}
    </section>
  );
}
