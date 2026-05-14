import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";
import { Button } from "../../../shared/ui/button/Button";
import { classNames } from "../../../shared/lib/classNames";
import styles from "./ProfileAuthPage.module.css";

const MIN_PASSWORD_LENGTH = 8;

export function ProfileAuthPage() {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const resetCode = searchParams.get("code");

  const { login, register, forgotPassword, resetPassword, logout, isAuthenticated, isReady, user } = useAuth();

  const redirectTo = typeof location.state?.from === "string" ? location.state.from : "/my-routes";

  useEffect(() => {
    if (resetCode) {
      setMode("reset");
      setMessage("");
      setError("");
    }
  }, [resetCode]);

  const title = useMemo(() => {
    if (mode === "register") return "Регистрация";
    if (mode === "forgot") return "Восстановление пароля";
    if (mode === "reset") return "Новый пароль";
    return "Вход в профиль";
  }, [mode]);

  function switchMode(next) {
    setMode(next);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    if (mode === "forgot") {
      setLoading(true);
      try {
        await forgotPassword({ email: payload.email });
      } catch {
        /* не раскрываем наличие аккаунта */
      } finally {
        setLoading(false);
      }
      setMessage("Если указанный email зарегистрирован, мы отправили инструкцию по восстановлению.");
      return;
    }

    if (mode === "reset") {
      if (!resetCode) {
        setError("Ссылка восстановления недействительна или устарела. Запросите письмо ещё раз.");
        return;
      }
      if (payload.password !== payload.passwordConfirm) {
        setError("Пароли не совпадают.");
        return;
      }
      if ((payload.password || "").length < MIN_PASSWORD_LENGTH) {
        setError(`Пароль не короче ${MIN_PASSWORD_LENGTH} символов.`);
        return;
      }
      setLoading(true);
      try {
        const sessionStarted = await resetPassword({
          code: resetCode,
          password: payload.password,
          passwordConfirmation: payload.passwordConfirm,
        });
        if (sessionStarted) {
          navigate(redirectTo, { replace: true });
        } else {
          navigate("/profile", { replace: true });
          switchMode("login");
          setMessage("Пароль обновлён. Войдите с новым паролем.");
        }
      } catch (err) {
        setError(err?.message || "Не удалось сменить пароль. Запросите новую ссылку.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "register") {
      if (payload.password !== payload.passwordConfirm) {
        setError("Пароли не совпадают.");
        return;
      }
      if ((payload.password || "").length < MIN_PASSWORD_LENGTH) {
        setError(`Пароль не короче ${MIN_PASSWORD_LENGTH} символов.`);
        return;
      }
      setLoading(true);
      try {
        const result = await register({
          email: payload.email,
          password: payload.password,
        });
        if (result.sessionStarted) {
          navigate(redirectTo, { replace: true });
          return;
        }
        setMessage(result.hint || "Регистрация выполнена.");
        switchMode("login");
      } catch (err) {
        setError(err?.message || "Не удалось зарегистрироваться.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      await login({ email: payload.email, password: payload.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Неверный email или пароль.");
    } finally {
      setLoading(false);
    }
  }

  if (!isReady) {
    return (
      <section className={styles.page}>
        <div className={styles.card}>
          <p className={styles.message}>Проверка сессии…</p>
        </div>
      </section>
    );
  }

  if (isAuthenticated && mode !== "reset") {
    return (
      <section className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Профиль</h1>
          <p className={styles.accountEmail}>{user?.email}</p>
          <div className={styles.accountActions}>
            <Button type="button" className={styles.submitButton} onClick={() => navigate("/my-routes")}>
              Мои маршруты
            </Button>
            <Button type="button" variant="secondary" className={styles.secondaryButton} onClick={() => logout()}>
              Выйти
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const showTabs = mode !== "forgot" && mode !== "reset";

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        {showTabs ? (
          <div className={styles.tabs}>
            <button
              type="button"
              className={classNames(styles.tab, mode === "login" && styles.activeTab)}
              onClick={() => switchMode("login")}
            >
              Вход
            </button>
            <button
              type="button"
              className={classNames(styles.tab, mode === "register" && styles.activeTab)}
              onClick={() => switchMode("register")}
            >
              Регистрация
            </button>
          </div>
        ) : null}

        <h1 className={styles.title}>{title}</h1>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {mode === "register" ? (
            <label className={styles.field}>
              <span className={styles.label}>Имя</span>
              <input className={styles.input} type="text" name="name" autoComplete="name" placeholder="Как к вам обращаться" />
            </label>
          ) : null}

          {mode !== "reset" ? (
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="example@mail.com"
                required
                disabled={loading}
              />
            </label>
          ) : null}

          {mode !== "forgot" && mode !== "reset" ? (
            <label className={styles.field}>
              <span className={styles.label}>Пароль</span>
              <input
                className={styles.input}
                type="password"
                name="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                placeholder="Введите пароль"
                required
                disabled={loading}
                minLength={MIN_PASSWORD_LENGTH}
              />
            </label>
          ) : null}

          {mode === "reset" ? (
            <>
              <label className={styles.field}>
                <span className={styles.label}>Новый пароль</span>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Не короче 8 символов"
                  required
                  disabled={loading}
                  minLength={MIN_PASSWORD_LENGTH}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Повторите пароль</span>
                <input
                  className={styles.input}
                  type="password"
                  name="passwordConfirm"
                  autoComplete="new-password"
                  placeholder="Повторите пароль"
                  required
                  disabled={loading}
                  minLength={MIN_PASSWORD_LENGTH}
                />
              </label>
            </>
          ) : null}

          {mode === "register" ? (
            <>
              <label className={styles.field}>
                <span className={styles.label}>Повторите пароль</span>
                <input
                  className={styles.input}
                  type="password"
                  name="passwordConfirm"
                  autoComplete="new-password"
                  placeholder="Повторите пароль"
                  required
                  disabled={loading}
                  minLength={MIN_PASSWORD_LENGTH}
                />
              </label>
              <label className={styles.checkboxRow}>
                <input type="checkbox" name="privacyAccepted" required disabled={loading} />
                <span>
                  Я согласен(а) с{" "}
                  <Link to="/privacy-policy" target="_blank" rel="noreferrer">
                    политикой обработки персональных данных
                  </Link>{" "}
                  и условиями использования
                </span>
              </label>
            </>
          ) : null}

          <Button type="submit" className={styles.submitButton} disabled={loading}>
            {loading
              ? "Подождите…"
              : mode === "register"
                ? "Создать аккаунт"
                : mode === "forgot"
                  ? "Отправить ссылку"
                  : mode === "reset"
                    ? "Сохранить пароль"
                    : "Войти"}
          </Button>
        </form>

        {mode === "login" ? (
          <button type="button" className={styles.forgotLink} onClick={() => switchMode("forgot")}>
            Забыли пароль?
          </button>
        ) : null}

        {mode === "forgot" ? (
          <button type="button" className={styles.forgotLink} onClick={() => switchMode("login")}>
            Вернуться ко входу
          </button>
        ) : null}

        {mode === "reset" ? (
          <button type="button" className={styles.forgotLink} onClick={() => navigate("/profile", { replace: true })}>
            Вернуться ко входу
          </button>
        ) : null}

        {error ? <p className={styles.error}>{error}</p> : null}
        {message ? <p className={styles.message}>{message}</p> : null}
      </div>
    </section>
  );
}
