import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/ui/button/Button";
import { classNames } from "../../../shared/lib/classNames";
import styles from "./Header.module.css";

/* Ассеты из Figma walker (обновлено по node 0:313 / 0:323 — старые mcp/asset UUID протухают) */
const logoImage = "https://www.figma.com/api/mcp/asset/fe78098f-64ac-47ea-9d2a-253bc8ae45ca";
const leftDecor = "https://www.figma.com/api/mcp/asset/00a792f4-cdb2-41c2-9ae1-28585f98455b";
const rightDecor = "https://www.figma.com/api/mcp/asset/2d43d15d-b141-4a61-af22-30e6834327cc";
const routeIconMask = "https://www.figma.com/api/mcp/asset/80915a15-d31f-4c87-ac43-27e73a714287";
const routeIconFill = "https://www.figma.com/api/mcp/asset/54722ece-2140-4dec-adf0-302c60c62eb9";
const profileIcon = "https://www.figma.com/api/mcp/asset/f47b4d69-bc08-4742-9d0e-a24ce6c14c5b";

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLightNav = pathname === "/" || pathname.startsWith("/place");

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
                <span className={styles.routeIconMask} style={{ maskImage: `url('${routeIconMask}')` }}>
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
        <a className={styles.navLink} href="/#routes">
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
