import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DestinationCard } from "../../../entities/destination-card/ui/DestinationCard";
import { fetchHomePoints } from "../../../shared/api/pointsApi";
import { Button } from "../../../shared/ui/button/Button";
import styles from "./SummerDestinationsSection.module.css";

const arrowDark = "/images/arrow-slider-dark(1).svg";

export function SummerDestinationsSection() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, cards.length - 2);
  const offset = useMemo(() => index * 375, [index]);

  useEffect(() => {
    let mounted = true;

    async function loadPoints() {
      try {
        const points = await fetchHomePoints();
        if (mounted) {
          setCards(points);
          setIndex(0);
        }
      } catch {
        if (mounted) setCards([]);
      }
    }

    loadPoints();

    return () => {
      mounted = false;
    };
  }, []);

  function prevSlide() {
    if (cards.length <= 2) return;
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }

  function nextSlide() {
    if (cards.length <= 2) return;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  }

  return (
    <section className={styles.section} id="routes">
      <div className={styles.header}>
        <h2 className={styles.title}>
          Куда поехать летом в - <span>бурятии</span>
        </h2>
        <div className={styles.controls}>
          <button type="button" className={styles.controlButton} aria-label="Предыдущие" onClick={prevSlide}>
            <img className={styles.prevIcon} src={arrowDark} alt="" />
          </button>
          <button type="button" className={styles.controlButton} aria-label="Следующие" onClick={nextSlide}>
            <img src={arrowDark} alt="" />
          </button>
        </div>
      </div>

      <div className={styles.cardsViewport}>
        {cards.length > 0 ? (
          <div className={styles.cardsTrack} style={{ transform: `translateX(-${offset}px)` }}>
            {cards.map((card) => (
              <DestinationCard key={card.id} {...card} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>Пока точек нет</p>
        )}
      </div>

      <Button variant="light" className={styles.moreButton} onClick={() => navigate("/places")}>
        Смотреть все
      </Button>
    </section>
  );
}
