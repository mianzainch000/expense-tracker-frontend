"use client";
import styles from "@/css/Pagination.module.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  windowSize = 3,
}) => {
  if (totalPages < 1) return null;

  const pageNumbers = [];

  // Always show first page
  pageNumbers.push(1);

  // Left window: start from 2, but also extend if currentPage is close
  let start = 2;
  let end = Math.min(totalPages - 1, windowSize + 1);

  if (currentPage > windowSize) {
    start = currentPage - 1;
    end = currentPage + 1;
  }

  // Push middle pages
  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPages) {
      pageNumbers.push(i);
    }
  }

  // Add dots if gap after middle pages
  if (end < totalPages - 1) {
    pageNumbers.push("...");
  }

  // Always show last page
  if (totalPages > 1) {
    pageNumbers.push(totalPages);
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.pageBtn}
      >
        Prev
      </button>

      {pageNumbers.map((page, idx) =>
        page === "..." ? (
          <span
            key={idx}
            className={styles.pageBtn}
            style={{ cursor: "default" }}
          >
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""
              }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.pageBtn}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
