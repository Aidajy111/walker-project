import { Link, useLocation } from "react-router-dom";
import { Button } from "../../../shared/ui/button/Button";
import { classNames } from "../../../shared/lib/classNames";
import styles from "./Header.module.css";

const logoImage = "https://www.figma.com/api/mcp/asset/72a71bbc-086e-4c65-a64e-facfd15e4034";
const leftDecor = "https://www.figma.com/api/mcp/asset/ec13cd40-37ee-4716-b2fe-bcaebe777190";
const rightDecor = "https://www.figma.com/api/mcp/asset/3e521a08-a6f7-4728-861b-456e5476d5c1";
const routeIconMask = "https://www.figma.com/api/mcp/asset/454f58ea-6bc3-45ed-b05f-89902b72044b";
const routeIconFill = "https://www.figma.com/api/mcp/asset/8689bdb9-20c2-4e81-b8af-396ed12c0165";
const profileIcon = "https://www.figma.com/api/mcp/asset/5e8392b6-c260-4f8d-b96c-f56e9078d285";

export function Header() {
  const { pathname } = useLocation();
  const isLightNav = pathname === "/" || pathname === "/place";

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
            <Button variant="secondary" className={styles.routeButton}>
              <span className={styles.routeIconWrap}>
                <span className={styles.routeIconMask} style={{ maskImage: `url('${routeIconMask}')` }}>
                  <img src={routeIconFill} alt="" />
                </span>
              </span>
              Мои маршруты
            </Button>
            <Button className={styles.profileButton}>
              <img className={styles.profileIcon} src={profileIcon} alt="" />
              Профиль
            </Button>
          </div>
        </div>
      </div>
      <nav className={classNames(styles.nav, isLightNav ? styles.navLight : styles.navDark)}>
        <a className={styles.navLink} href="#routes">
          Готовые маршруты
        </a>
        <a className={styles.navLink} href="#support">
          Поддержка
        </a>
        <a className={styles.navLink} href="#about">
          О приложении
        </a>
      </nav>
    </header>
  );
}
