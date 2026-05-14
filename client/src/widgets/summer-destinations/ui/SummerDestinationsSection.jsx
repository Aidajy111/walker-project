import { useMemo, useState } from "react";
import { Button } from "../../../shared/ui/button/Button";
import { DestinationCard } from "../../../entities/destination-card/ui/DestinationCard";
import styles from "./SummerDestinationsSection.module.css";

const arrowDark = "https://www.figma.com/api/mcp/asset/8bfaf8c9-a15a-46eb-877b-50994b77c18e";

const cards = [
  {
    id: "datsan",
    image: "/images/datsan.png",
    imageAlt: "Дацан Иволгинский",
    title: "Иволгинский дацан",
    description:
      "буддийский монастырь-дацан, центр Буддийской традиционной Сангхи России. Расположен в Республике Бурятия в селе Верхняя Иволга в 36 км западнее центра Улан-Удэ.",
  },
  {
    id: "shamanka",
    image: "/images/shamanka.png",
    imageAlt: "Скала Шаманка",
    title: "Иволгинский дацан",
    description: "Мыс в средней части западного побережья острова Ольхон на озере Байкал.",
  },
  {
    id: "datsan-copy",
    image: "/images/datsan.png",
    imageAlt: "Дацан Иволгинский",
    title: "Иволгинский дацан",
    description:
      "буддийский монастырь-дацан, центр Буддийской традиционной Сангхи России. Расположен в Республике Бурятия в селе Верхняя Иволга в 36 км западнее центра Улан-Удэ.",
  },
  {
    id: "shamanka-copy",
    image: "/images/shamanka.png",
    imageAlt: "Скала Шаманка",
    title: "Иволгинский дацан",
    description: "Мыс в средней части западного побережья острова Ольхон на озере Байкал.",
  },
];

export function SummerDestinationsSection() {
  const [index, setIndex] = useState(0);
  const maxIndex = cards.length - 2;
  const offset = useMemo(() => index * 375, [index]);

  function prevSlide() {
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }

  function nextSlide() {
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
        <div className={styles.cardsTrack} style={{ transform: `translateX(-${offset}px)` }}>
          {cards.map((card) => (
            <DestinationCard key={card.id} {...card} href="/place" />
          ))}
        </div>
      </div>

      <Button variant="light" className={styles.moreButton}>
        Смотреть все
      </Button>
    </section>
  );
}
