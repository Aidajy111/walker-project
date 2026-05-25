import { useMemo, useState } from "react";
import { ReviewCard } from "../../../entities/review-card/ui/ReviewCard";
import { classNames } from "../../../shared/lib/classNames";
import { PhotoGalleryModal } from "../../../shared/ui/photo-gallery-modal/PhotoGalleryModal";
import styles from "./ReviewsMosaicSection.module.css";

const defaultCards = [
  {
    id: "baikal",
    size: "large",
    image: "/images/ozero_baikal_1921.jpg",
    imageAlt: "Байкал",
    title: "Байкал — сакральный, а не просто озеро",
    description:
      "Сюда нельзя приезжать как на пляжный курорт — нужно спрашивать разрешения у духов, брызгать первыми каплями чая или молока, оставлять подношения",
  },
  {
    id: "kheer-shaalgan",
    size: "large",
    image: "/images/3wyd8hjsw2i3gm2rxqpjx6at2lc2mazm1.jpg",
    imageAlt: "Хээр шаалган",
    title: "Хээр шаалган",
    description:
      "Древняя игра кочевников, где сила встречается с духом. Говорят, если сломал кость — выпустил душу животного на волю и призвал удачу.",
  },
  {
    id: "sleeping-lion",
    size: "small",
    image: "/images/870_490_fixedwidth1.jpg",
    imageAlt: "Гора Спящий лев",
    title: "Гора Спящий лев",
    description: 'Сюда приезжают медитировать, "обнуляться" и просить поддержки у духов',
  },
  {
    id: "merkitskaya-fortress",
    size: "small",
    image: "/images/S600xU_2x1.png",
    imageAlt: "Меркитская крепость",
    title: "Меркитская крепость",
    description: "Там можно увидеть реконструированные землянки гуннов и загадочные керексуры — древние захоронения",
  },
  {
    id: "eagle-trail",
    size: "small",
    image: "/images/fi1gej2d069ylgdhj9q0srkrvengr6pg1.png",
    imageAlt: "Орлиная экотропа",
    title: "Орлиная экотропа",
    description:
      "Уникальный маршрут длиной почти 21 км с самой длинной в России каменистой лестницей. Оттуда открывается вид",
  },
];

export function ReviewsMosaicSection({ title = "Отзывы наших пользователей", cards = defaultCards, variant = "reviews" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalImages = useMemo(
    () =>
      cards
        .filter((card) => card.image)
        .map((card) => ({
          id: card.id,
          src: card.image,
          alt: card.imageAlt || card.title || "",
        })),
    [cards],
  );

  function openGallery(card) {
    const nextIndex = modalImages.findIndex((image) => image.id === card.id);

    if (nextIndex < 0) {
      return;
    }

    setActiveIndex(nextIndex);
    setIsModalOpen(true);
  }

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
            <ReviewCard key={card.id} {...card} size="small" onClick={() => openGallery(card)} />
          ))}
        </div>
        {isModalOpen ? (
          <PhotoGalleryModal
            images={modalImages}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
            onClose={() => setIsModalOpen(false)}
          />
        ) : null}
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
            <ReviewCard key={card.id} {...card} onClick={() => openGallery(card)} />
          ))}
        </div>
      ) : null}

      {bottomRow.length > 0 ? (
        <div className={`${styles.bottomRow} ${topRow.length === 0 ? styles.bottomRowNoTop : ""}`}>
          {bottomRow.map((card) => (
            <ReviewCard key={card.id} {...card} onClick={() => openGallery(card)} />
          ))}
        </div>
      ) : null}
      {isModalOpen ? (
        <PhotoGalleryModal
          images={modalImages}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setIsModalOpen(false)}
        />
      ) : null}
    </section>
  );
}
