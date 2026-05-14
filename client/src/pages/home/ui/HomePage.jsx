import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlurField } from "../../../shared/ui/blur-field/BlurField";
import { Button } from "../../../shared/ui/button/Button";
import {
  CITY_OPTIONS,
  REGION_OPTIONS,
  SEASON_OPTIONS,
} from "../../../shared/config/routeFilters";
import { GastronomyBannerSection } from "../../../widgets/gastronomy-banner/ui/GastronomyBannerSection";
import { ReadyRoutesSection } from "../../../widgets/ready-routes/ui/ReadyRoutesSection";
import { ReviewsMosaicSection } from "../../../widgets/reviews-mosaic/ui/ReviewsMosaicSection";
import { SummerDestinationsSection } from "../../../widgets/summer-destinations/ui/SummerDestinationsSection";
import styles from "./HomePage.module.css";

const heroBackground = "https://www.figma.com/api/mcp/asset/7b348536-3bf4-4eaf-8672-ad1e2dd3c3a1";
const chevronIcon = "https://www.figma.com/api/mcp/asset/69142f3e-660b-4cc7-a49b-42c46706e3aa";
const leftBottomDecor = "https://www.figma.com/api/mcp/asset/f502387b-a22f-46d8-bc5a-5107b769945a";
const rightBottomDecor = "https://www.figma.com/api/mcp/asset/51bd924c-a7c0-4f5f-8d35-db58a8835fff";

export function HomePage() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("Республика Бурятия");
  const [city, setCity] = useState("Улан-Удэ");
  const [budget, setBudget] = useState("");
  const [season, setSeason] = useState("Лето");
  const [tags, setTags] = useState("");

  function handleFindRoute() {
    const searchParams = new URLSearchParams();
    searchParams.set("region", region);
    searchParams.set("city", city);
    searchParams.set("budget", budget);
    searchParams.set("season", season);
    searchParams.set("tags", tags);
    searchParams.set("page", "1");
    navigate(`/search?${searchParams.toString()}`);
  }

  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        <img className={styles.heroBackground} src={heroBackground} alt="" />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Планируйте <span className={styles.underlined}>путешествие</span> с удовольствием
          </h1>
          <div className={styles.filters}>
            <BlurField
              className={styles.selectField}
              label="Регион"
              value={region}
              onChange={setRegion}
              iconSrc={chevronIcon}
              options={REGION_OPTIONS}
            />
            <BlurField
              className={styles.selectField}
              label="Выберите город/поселок/местность"
              value={city}
              onChange={setCity}
              iconSrc={chevronIcon}
              options={CITY_OPTIONS}
            />
            <div className={styles.inputField}>
              <p className={styles.inputLabel}>Бюджет от и до</p>
              <input
                type="text"
                className={styles.inputControl}
                placeholder="Например: 20 000 - 50 000"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
              />
            </div>
            <BlurField
              className={styles.selectField}
              label="Сезон"
              value={season}
              onChange={setSeason}
              iconSrc={chevronIcon}
              options={SEASON_OPTIONS}
            />
            <div className={styles.inputField}>
              <p className={styles.inputLabel}>Теги</p>
              <input
                type="text"
                className={styles.inputControl}
                placeholder="Введите теги через запятую"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </div>
            <div className={styles.searchButtonWrap}>
              <Button className={styles.searchButton} onClick={handleFindRoute}>
                Найти маршрут
              </Button>
            </div>
          </div>
        </div>
        <p className={styles.subtitle}>
          От ваших желаний до точек на карте — один маленький шаг. Заполните поля и выберите подходящий маршрут по
          Солнечной Бурятии
        </p>
        <img className={styles.leftBottomDecor} src={leftBottomDecor} alt="" />
        <img className={styles.rightBottomDecor} src={rightBottomDecor} alt="" />
      </div>
      <SummerDestinationsSection />
      <div id="routes" className={styles.routeAnchor}>
        <ReadyRoutesSection />
      </div>
      <GastronomyBannerSection />
      <ReviewsMosaicSection />
    </section>
  );
}
