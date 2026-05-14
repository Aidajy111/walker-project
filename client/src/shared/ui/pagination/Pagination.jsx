import { classNames } from "../../lib/classNames";
import styles from "./Pagination.module.css";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.navButton}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        aria-label="Предыдущая страница"
      >
        {"<"}
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={classNames(styles.pageButton, currentPage === page && styles.activePage)}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={styles.navButton}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        aria-label="Следующая страница"
      >
        {">"}
      </button>
    </div>
  );
}
