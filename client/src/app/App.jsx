import { Header } from "../widgets/header/ui/Header";
import { Footer } from "../widgets/footer/ui/Footer";
import { AppRouter } from "./providers/router";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}
