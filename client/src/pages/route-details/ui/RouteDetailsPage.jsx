import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { RouteDescriptionCard } from "../../../entities/route-description-card/ui/RouteDescriptionCard";
import { RoutePointCard } from "../../../entities/route-point-card/ui/RoutePointCard";
import { fetchRouteDetails } from "../../../shared/api/routeDetailsApi";
import { RouteMap } from "../../../widgets/route-map/ui/RouteMap";
import { mockRouteDetails } from "../../../shared/mocks/routeDetails";
import styles from "./RouteDetailsPage.module.css";

export function RouteDetailsPage() {
  const { documentId } = useParams();
  const [routeDetails, setRouteDetails] = useState(mockRouteDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [modalImages, setModalImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePoint, setActivePoint] = useState(null);
  const mapGallery = useMemo(() => routeDetails.gallery || [], [routeDetails.gallery]);

  const modalLength = modalImages.length;

  useEffect(() => {
    let mounted = true;

    async function loadRoute() {
      setIsLoading(true);
      try {
        const nextRouteDetails = await fetchRouteDetails(documentId);
        if (!mounted) return;
        setRouteDetails(nextRouteDetails);
        setActivePoint(nextRouteDetails.routePoints?.[0] || null);
      } catch {
        if (!mounted) return;
        setRouteDetails(mockRouteDetails);
        setActivePoint(mockRouteDetails.routePoints?.[0] || null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadRoute();
    return () => {
      mounted = false;
    };
  }, [documentId]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!isModalOpen || modalLength === 0) {
        return;
      }

      if (event.key === "Escape") {
        setIsModalOpen(false);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % modalLength);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + modalLength) % modalLength);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, modalLength]);

  function openGallery(images, index) {
    if (!images || images.length === 0) {
      return;
    }
    setModalImages(images);
    setActiveIndex(Math.min(index, images.length - 1));
    setIsModalOpen(true);
  }

  function showNext() {
    if (modalLength === 0) {
      return;
    }
    setActiveIndex((prev) => (prev + 1) % modalLength);
  }

  function showPrev() {
    if (modalLength === 0) {
      return;
    }
    setActiveIndex((prev) => (prev - 1 + modalLength) % modalLength);
  }

  const handleSelectPoint = useCallback((point) => {
    setActivePoint(point);
  }, []);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {isLoading ? <p className={styles.loading}>Загрузка маршрута...</p> : null}
        <div className={styles.contentRow}>
          <div className={styles.leftColumn}>
            <div className={styles.leftBlock}>
              <div className={styles.galleryColumn}>
                {mapGallery.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.thumbnailButton}
                    onClick={() => openGallery(mapGallery, index)}
                  >
                    <img className={styles.thumbnailImage} src={item.src} alt={item.alt} />
                  </button>
                ))}
              </div>

              <div className={styles.mapBlock}>
                <RouteMap
                  points={routeDetails.routePoints}
                  activePointId={activePoint?.id ?? null}
                  onPointSelect={handleSelectPoint}
                />
              </div>
            </div>

            <RouteDescriptionCard
              summary={routeDetails.routeSummary}
              reviews={routeDetails.routeReviews}
              routeDocumentId={routeDetails.id}
            />
          </div>

          <div className={styles.pointsColumn}>
            {routeDetails.routePoints.map((point) => (
              <RoutePointCard
                key={point.id}
                point={point}
                onGalleryOpen={openGallery}
                onSelect={handleSelectPoint}
                isActive={activePoint?.id === point.id}
              />
            ))}
          </div>
        </div>
      </div>

      {activePoint?.audioSrc ? (
        <div className={styles.audioDock}>
          <div className={styles.audioDockInner}>
            <p className={styles.audioTitle}>Аудиогид: {activePoint.title}</p>
            <audio
              key={`${activePoint.id}-${activePoint.audioSrc}`}
              className={styles.audioPlayer}
              src={activePoint.audioSrc}
              controls
              preload="metadata"
            />
          </div>
        </div>
      ) : null}

      {isModalOpen && modalLength > 0 ? (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.modalClose} onClick={() => setIsModalOpen(false)} aria-label="Закрыть">
              x
            </button>
            <button type="button" className={styles.modalArrowLeft} onClick={showPrev} aria-label="Предыдущее фото">
              {"<"}
            </button>
            <img
              className={styles.modalImage}
              src={modalImages[activeIndex].src}
              alt={modalImages[activeIndex].alt || ""}
            />
            <button type="button" className={styles.modalArrowRight} onClick={showNext} aria-label="Следующее фото">
              {">"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
