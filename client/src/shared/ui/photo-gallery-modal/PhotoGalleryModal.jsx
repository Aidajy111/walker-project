import { useEffect } from "react";
import styles from "./PhotoGalleryModal.module.css";

export function PhotoGalleryModal({ images, activeIndex, onIndexChange, onClose }) {
  const total = images.length;
  const activeImage = images[activeIndex];

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight" && total > 0) {
        onIndexChange((activeIndex + 1) % total);
      }

      if (event.key === "ArrowLeft" && total > 0) {
        onIndexChange((activeIndex - 1 + total) % total);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onClose, onIndexChange, total]);

  if (!activeImage) {
    return null;
  }

  function showNext() {
    onIndexChange((activeIndex + 1) % total);
  }

  function showPrev() {
    onIndexChange((activeIndex - 1 + total) % total);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          x
        </button>
        {total > 1 ? (
          <button type="button" className={styles.arrowLeft} onClick={showPrev} aria-label="Предыдущее фото">
            {"<"}
          </button>
        ) : null}
        <img className={styles.image} src={activeImage.src} alt={activeImage.alt || ""} />
        {total > 1 ? (
          <button type="button" className={styles.arrowRight} onClick={showNext} aria-label="Следующее фото">
            {">"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
