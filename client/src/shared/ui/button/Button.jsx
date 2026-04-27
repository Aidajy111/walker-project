import { classNames } from "../../lib/classNames";
import styles from "./Button.module.css";

export function Button({ variant = "primary", className, children, ...props }) {
  return (
    <button className={classNames(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
