import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollWithDefaultBehavior(callback) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;

  root.style.scrollBehavior = "auto";
  callback();
  root.style.scrollBehavior = previousBehavior;
}

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    scrollWithDefaultBehavior(() => {
      if (!hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      window.requestAnimationFrame(() => {
        const id = decodeURIComponent(hash.slice(1));
        const target = document.getElementById(id);

        if (target) {
          target.scrollIntoView({ block: "start", behavior: "auto" });
        }
      });
    });
  }, [pathname, search, hash]);

  return null;
}
