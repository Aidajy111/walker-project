import { useEffect, useRef, useState } from "react";
import { classNames } from "../../lib/classNames";
import styles from "./BlurField.module.css";

export function BlurField({ label, value, options = [], iconSrc, iconAlt = "", onChange, className, variant = "glass" }) {
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef(null);

  useEffect(() => {
    function onDocumentClick(event) {
      if (fieldRef.current && !fieldRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  function handleSelect(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div className={classNames(styles.field, className)} ref={fieldRef}>
      <p className={classNames(styles.label, variant === "light" && styles.labelLight)}>{label}</p>
      <button
        type="button"
        className={classNames(
          styles.control,
          variant === "light" && styles.controlLight,
          isOpen && styles.controlActive,
          isOpen && variant === "light" && styles.controlLightActive,
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className={classNames(styles.value, variant === "light" && styles.valueLight)}>{value}</p>
        {iconSrc ? (
          <img
            className={classNames(styles.icon, variant === "light" && styles.iconLight, isOpen && styles.iconOpen)}
            src={iconSrc}
            alt={iconAlt}
          />
        ) : null}
      </button>
      {isOpen ? (
        <div className={classNames(styles.dropdown, variant === "light" && styles.dropdownLight)}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={classNames(styles.option, variant === "light" && styles.optionLight)}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
