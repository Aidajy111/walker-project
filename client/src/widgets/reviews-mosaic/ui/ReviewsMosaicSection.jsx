import { ReviewCard } from "../../../entities/review-card/ui/ReviewCard";
import { classNames } from "../../../shared/lib/classNames";
import styles from "./ReviewsMosaicSection.module.css";

const defaultCards = [
  {
    id: "baikal",
    size: "large",
    image: "https://www.figma.com/api/mcp/asset/dfc2ac1e-27f3-4dbd-afac-283704a15ae7",
    imageAlt: "Байкал",
    title: "Байкал — сакральный, а не просто озеро",
    description:
      "Сюда нельзя приезжать как на пляжный курорт — нужно спрашивать разрешения у духов, брызгать первыми каплями чая или молока, оставлять подношения",
  },
  {
    id: "kheer-shaalgan",
    size: "large",
    image: "https://www.figma.com/api/mcp/asset/228af365-ac3c-4bb1-bfc8-55ec50c7c618",
    imageAlt: "Хээр шаалган",
    title: "Хээр шаалган",
    description:
      "Древняя игра кочевников, где сила встречается с духом. Говорят, если сломал кость — выпустил душу животного на волю и призвал удачу.",
  },
  {
    id: "sleeping-lion",
    size: "small",
    image: "https://www.figma.com/api/mcp/asset/48cb2fda-8bd1-428f-805e-959a78762cde",
    imageAlt: "Гора Спящий лев",
    title: "Гора Спящий лев",
    description: 'Сюда приезжают медитировать, "обнуляться" и просить поддержки у духов',
  },
  {
    id: "merkitskaya-fortress",
    size: "small",
    image: "https://www.figma.com/api/mcp/asset/f7e376d0-c5ca-4cbd-bb3b-cff1da733760",
    imageAlt: "Меркитская крепость",
    title: "Меркитская крепость",
    description: "Там можно увидеть реконструированные землянки гуннов и загадочные керексуры — древние захоронения",
  },
  {
    id: "eagle-trail",
    size: "small",
    image: "https://www.figma.com/api/mcp/asset/dda12c86-afe9-4064-8e80-527c05aee0e0",
    imageAlt: "Орлиная экотропа",
    title: "Орлиная экотропа",
    description:
      "Уникальный маршрут длиной почти 21 км с самой длинной в России каменистой лестницей. Оттуда открывается вид",
  },
];

export function ReviewsMosaicSection({ title = "Отзывы наших пользователей", cards = defaultCards, variant = "reviews" }) {
  if (variant === "gallery") {
    const galleryCards = cards.slice(0, 5);
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>{title}</h2>
        <div
          className={classNames(
            styles.galleryGrid,
            galleryCards.length <= 2 && styles.galleryTwo,
            galleryCards.length === 3 && styles.galleryThree,
            galleryCards.length === 4 && styles.galleryFour,
            galleryCards.length >= 5 && styles.galleryFive,
          )}
        >
          {galleryCards.map((card) => (
            <ReviewCard key={card.id} {...card} size="small" />
          ))}
        </div>
      </section>
    );
  }

  const topRow = cards.filter((card) => card.size === "large");
  const bottomRow = cards.filter((card) => card.size === "small");

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      {topRow.length > 0 ? (
        <div className={styles.topRow}>
          {topRow.map((card) => (
            <ReviewCard key={card.id} {...card} />
          ))}
        </div>
      ) : null}

      {bottomRow.length > 0 ? (
        <div className={`${styles.bottomRow} ${topRow.length === 0 ? styles.bottomRowNoTop : ""}`}>
          {bottomRow.map((card) => (
            <ReviewCard key={card.id} {...card} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
