import { useState } from "react";
import { Button } from "../../../shared/ui/button/Button";
import { RouteReviewCard } from "../../route-review-card/ui/RouteReviewCard";
import { useSaveRoute } from "../../../shared/hooks/useSaveRoute";
import styles from "./RouteDescriptionCard.module.css";

function renderTextNode(node, key) {
  const text = node?.text || "";
  let content = text;

  if (node?.bold) content = <strong key={`${key}-b`}>{content}</strong>;
  if (node?.italic) content = <em key={`${key}-i`}>{content}</em>;
  if (node?.underline) content = <u key={`${key}-u`}>{content}</u>;
  if (node?.strikethrough) content = <s key={`${key}-s`}>{content}</s>;
  if (node?.code) content = <code key={`${key}-c`}>{content}</code>;

  return <span key={key}>{content}</span>;
}

function renderInline(children, keyPrefix) {
  if (!Array.isArray(children)) return null;
  return children.map((child, index) => {
    const key = `${keyPrefix}-${index}`;
    if (child?.type === "text") return renderTextNode(child, key);
    if (Array.isArray(child?.children)) return <span key={key}>{renderInline(child.children, key)}</span>;
    return null;
  });
}

function renderBlock(block, index) {
  const key = `block-${index}`;
  const content = renderInline(block?.children, key);

  if (block?.type === "heading") {
    const level = Math.min(Math.max(Number(block?.level) || 3, 1), 6);
    const Tag = `h${level}`;
    return (
      <Tag key={key} className={styles.heading}>
        {content}
      </Tag>
    );
  }

  if (block?.type === "list" && Array.isArray(block?.children)) {
    const ListTag = block?.format === "ordered" ? "ol" : "ul";
    return (
      <ListTag key={key} className={styles.list}>
        {block.children.map((item, itemIndex) => (
          <li key={`${key}-item-${itemIndex}`}>{renderInline(item?.children, `${key}-item-${itemIndex}`)}</li>
        ))}
      </ListTag>
    );
  }

  return (
    <p key={key} className={styles.text}>
      {content}
    </p>
  );
}

export function RouteDescriptionCard({ summary, reviews = [], routeDocumentId }) {
  const bodyBlocks = Array.isArray(summary?.bodyBlocks) ? summary.bodyBlocks : [];
  const { saveRouteByDocumentId } = useSaveRoute();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function handleSaveRoute() {
    setNotice("");
    if (!routeDocumentId) {
      setNotice("Нельзя сохранить маршрут без идентификатора.");
      return;
    }
    setSaving(true);
    try {
      const result = await saveRouteByDocumentId(routeDocumentId);
      if (result.ok) {
        setNotice("Маршрут сохранён в разделе «Мои маршруты».");
      } else if (result.error !== "auth") {
        setNotice(result.error);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{summary.title}</h2>

      <div className={styles.body}>{bodyBlocks.length > 0 ? bodyBlocks.map(renderBlock) : <p className={styles.text}>Описание отсутствует.</p>}</div>

      <div className={styles.tags}>
        {(summary.tags || []).map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
          </span>
        ))}
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          className={styles.saveButton}
          onClick={handleSaveRoute}
          disabled={saving || !routeDocumentId}
        >
          {saving ? "Сохранение…" : "Сохранить маршрут"}
        </Button>
        <Button variant="secondary" className={styles.reviewButton}>
          Добавить отзыв
        </Button>
      </div>

      {notice ? (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      ) : null}

      <h3 className={styles.reviewsTitle}>Отзывы к маршруту</h3>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <RouteReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
