import { Header } from "../widgets/header/ui/Header";
import { Footer } from "../widgets/footer/ui/Footer";
import { CookieConsent } from "../widgets/cookie-consent/ui/CookieConsent";
import { AppPreloader } from "../shared/ui/app-preloader/AppPreloader";
import { AppRouter } from "./providers/router";
import { ScrollToTop } from "./providers/ScrollToTop";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <ScrollToTop />
        <AppRouter />
      </main>
      <Footer />
      <CookieConsent />
      <AppPreloader />
    </div>
  );
}
