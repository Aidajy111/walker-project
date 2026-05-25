import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/button/Button";
import { classNames } from "../../../shared/lib/classNames";
import styles from "./Header.module.css";

/* Ассеты из Figma walker (обновлено по node 0:313 / 0:323 — старые mcp/asset UUID протухают) */
const logoImage = "/images/logo.svg";
const leftDecor = "/images/logo-bg (1).png";
const rightDecor = "/images/header-button-bg.png";
const routeIconMask = "/images/route-header-btn-icon.svg";
const routeIconFill = "/images/route-header-btn-icon.svg";
const profileIcon = "/images/profile-icon.svg";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isPlaceDetailsPage = pathname === "/place" || pathname.startsWith("/place/");
  const isLightNav = pathname === "/" || isPlaceDetailsPage;

  return (
    <header className={styles.header}>
      <div className={styles.fixedLayer}>
        <div className={styles.leftCard}>
          <img className={styles.leftDecor} src={leftDecor} alt="" />
          <Link to="/" className={styles.logo}>
            <img src={logoImage} alt="Walker" />
          </Link>
        </div>
        <div className={styles.rightCard}>
          <img className={styles.rightDecor} src={rightDecor} alt="" />
          <div className={styles.actions}>
            <Button variant="secondary" className={styles.routeButton} onClick={() => navigate("/my-routes")}>
              <span className={styles.routeIconWrap}>
                <span className={styles.routeIconMask}>
                  <img src={routeIconFill} alt="" />
                </span>
              </span>
              Мои маршруты
            </Button>
            <Button className={styles.profileButton} onClick={() => navigate("/profile")}>
              <img className={styles.profileIcon} src={profileIcon} alt="" />
              Профиль
            </Button>
          </div>
        </div>
      </div>
      <nav className={classNames(styles.nav, isLightNav ? styles.navLight : styles.navDark)}>
        <a className={styles.navLink} href="/search">
          Готовые маршруты
        </a>
        <a className={styles.navLink} href="/#support">
          Поддержка
        </a>
        <a className={styles.navLink} href="/#about">
          О приложении
        </a>
      </nav>
    </header>
  );
}
