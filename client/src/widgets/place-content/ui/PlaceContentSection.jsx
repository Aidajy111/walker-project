import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/button/Button";
import styles from "./PlaceContentSection.module.css";

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
    if (typeof child?.text === "string") return renderTextNode(child, key);
    if (Array.isArray(child?.children)) return <span key={key}>{renderInline(child.children, key)}</span>;
    return null;
  });
}

function renderBodyBlock(block, index) {
  const key = `body-${index}`;
  const content = renderInline(block?.children, key);

  if (block?.type === "heading") {
    const level = Math.min(Math.max(Number(block?.level) || 3, 1), 6);
    const Tag = `h${level}`;
    return (
      <Tag key={key} className={styles.bodyHeading}>
        {content}
      </Tag>
    );
  }

  if (block?.type === "list" && Array.isArray(block?.children)) {
    const ListTag = block?.format === "ordered" ? "ol" : "ul";
    return (
      <ListTag key={key} className={styles.bodyList}>
        {block.children.map((item, itemIndex) => (
          <li key={`${key}-li-${itemIndex}`}>{renderInline(item?.children, `${key}-li-${itemIndex}`)}</li>
        ))}
      </ListTag>
    );
  }

  if (block?.type === "image" && block?.image?.url) {
    return (
      <figure key={key} className={styles.bodyImageWrap}>
        <img src={block.image.url} alt={block.image.alternativeText || ""} />
      </figure>
    );
  }

  if (block?.type === "html" && typeof block?.html === "string") {
    return <div key={key} className={styles.text} dangerouslySetInnerHTML={{ __html: block.html }} />;
  }

  return (
    <p key={key} className={styles.text}>
      {content}
    </p>
  );
}

export function PlaceContentSection({ bodyBlocks = [], searchTag = "" }) {
  const navigate = useNavigate();

  function handleFindRoute() {
    const searchParams = new URLSearchParams();
    searchParams.set("tags", searchTag);
    searchParams.set("page", "1");
    navigate(`/search?${searchParams.toString()}`);
  }

  return (
    <section className={styles.section}>
      <div className={styles.body}>
        {Array.isArray(bodyBlocks) && bodyBlocks.length > 0 ? (
          bodyBlocks.map(renderBodyBlock)
        ) : (
          <p className={styles.text}>Контент точки пока не заполнен.</p>
        )}
      </div>

      <Button className={styles.ctaButton} onClick={handleFindRoute}>
        Найти маршрут
      </Button>
    </section>
  );
}
