import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RouteCard } from "../../../entities/route-card/ui/RouteCard";
import { BlurField } from "../../../shared/ui/blur-field/BlurField";
import { Button } from "../../../shared/ui/button/Button";
import { Pagination } from "../../../shared/ui/pagination/Pagination";
import {
  CITY_OPTIONS,
  DEFAULT_ROUTE_FILTERS,
  REGION_OPTIONS,
  SEASON_OPTIONS,
} from "../../../shared/config/routeFilters";
import { mockRoutes } from "../../../shared/mocks/routes";
import styles from "./SearchRoutesPage.module.css";

const chevronIcon = "https://www.figma.com/api/mcp/asset/0a0e73e8-de47-4aba-9aa9-c3748ddc8589";
const PAGE_SIZE = 8;

function extractFilters(searchParams) {
  const rawBudget = searchParams.get("budget") || DEFAULT_ROUTE_FILTERS.budget;
  const [minBudget = "", maxBudget = ""] = rawBudget.split("-").map((part) => part.trim());

  return {
    region: searchParams.get("region") || DEFAULT_ROUTE_FILTERS.region,
    city: searchParams.get("city") || DEFAULT_ROUTE_FILTERS.city,
    minBudget,
    maxBudget,
    season: searchParams.get("season") || DEFAULT_ROUTE_FILTERS.season,
    tags: searchParams.get("tags") || DEFAULT_ROUTE_FILTERS.tags,
  };
}

export function SearchRoutesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilters = extractFilters(searchParams);
  const initialPage = Number(searchParams.get("page") || "1");

  const [region, setRegion] = useState(initialFilters.region);
  const [city, setCity] = useState(initialFilters.city);
  const [minBudget, setMinBudget] = useState(initialFilters.minBudget);
  const [maxBudget, setMaxBudget] = useState(initialFilters.maxBudget);
  const [season, setSeason] = useState(initialFilters.season);
  const [tags, setTags] = useState(initialFilters.tags);
  const [currentPage, setCurrentPage] = useState(Number.isNaN(initialPage) ? 1 : initialPage);

  const filteredRoutes = useMemo(() => {
    const normalizedTags = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    return mockRoutes.filter((route) => {
      const regionPass = !region || route.region === region;
      const cityPass = city === "Неважно" || !city || route.city === city;
      const seasonPass = season === "Любой" || !season || route.season === season;
      const tagsPass =
        normalizedTags.length === 0 || normalizedTags.every((tag) => route.tags.join(" ").toLowerCase().includes(tag));

      return regionPass && cityPass && seasonPass && tagsPass;
    });
  }, [region, city, season, tags]);

  const totalPages = Math.max(1, Math.ceil(filteredRoutes.length / PAGE_SIZE));
  const normalizedPage = Math.min(currentPage, totalPages);
  const visibleRoutes = filteredRoutes.slice((normalizedPage - 1) * PAGE_SIZE, normalizedPage * PAGE_SIZE);

  function handleApplyFilters() {
    const next = new URLSearchParams();
    next.set("region", region);
    next.set("city", city);
    next.set("budget", [minBudget, maxBudget].filter(Boolean).join(" - "));
    next.set("season", season);
    next.set("tags", tags);
    next.set("page", "1");
    setSearchParams(next);
    setCurrentPage(1);
  }

  function handlePageChange(nextPage) {
    const clampedPage = Math.min(Math.max(nextPage, 1), totalPages);
    const next = new URLSearchParams();
    next.set("region", region);
    next.set("city", city);
    next.set("budget", [minBudget, maxBudget].filter(Boolean).join(" - "));
    next.set("season", season);
    next.set("tags", tags);
    next.set("page", String(clampedPage));
    setSearchParams(next);
    setCurrentPage(clampedPage);
  }

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.filterPanel}>
          <h2 className={styles.filterTitle}>Планируйте путешествия</h2>
          <BlurField
            className={styles.selectField}
            variant="light"
            label="Регион"
            value={region}
            onChange={setRegion}
            iconSrc={chevronIcon}
            options={REGION_OPTIONS}
          />
          <BlurField
            className={styles.selectField}
            variant="light"
            label="Выберите город/поселок/местность"
            value={city}
            onChange={setCity}
            iconSrc={chevronIcon}
            options={CITY_OPTIONS}
          />
          <div className={styles.inputField}>
            <p className={styles.inputLabel}>Бюджет от и до</p>
            <div className={styles.budgetControl}>
              <input
                type="text"
                inputMode="numeric"
                className={styles.budgetInput}
                placeholder="20 000"
                value={minBudget}
                onChange={(event) => setMinBudget(event.target.value)}
              />
              <span className={styles.budgetDivider} />
              <input
                type="text"
                inputMode="numeric"
                className={styles.budgetInput}
                placeholder="50 000"
                value={maxBudget}
                onChange={(event) => setMaxBudget(event.target.value)}
              />
            </div>
          </div>
          <BlurField
            className={styles.selectField}
            variant="light"
            label="Сезон"
            value={season}
            onChange={setSeason}
            iconSrc={chevronIcon}
            options={SEASON_OPTIONS}
          />
          <div className={styles.inputField}>
            <p className={styles.inputLabel}>Теги</p>
            <input
              type="text"
              className={styles.inputControl}
              placeholder="Бузы, природа, байкал"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </div>
          <Button className={styles.findButton} onClick={handleApplyFilters}>
            Найти маршрут
          </Button>
        </aside>

        <div className={styles.resultsColumn}>
          <section className={styles.resultsPanel}>
            <h1 className={styles.resultsTitle}>Готовые маршруты</h1>
            <div className={styles.cardsGrid}>
              {visibleRoutes.map((route) => (
                <RouteCard key={route.id} {...route} href="/place" />
              ))}
            </div>
          </section>

          <Pagination currentPage={normalizedPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </section>
  );
}
