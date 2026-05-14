import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchMe,
  forgotPasswordRequest,
  loginRequest,
  mapStrapiUser,
  registerRequest,
  resetPasswordRequest,
} from "../../shared/api/authApi";

const STORAGE_KEY = "walker-auth";

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [isReady, setIsReady] = useState(false);

  function persist(nextJwt, nextUser) {
    if (nextJwt && nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ jwt: nextJwt, user: nextUser }));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function applySession(token, strapiUser) {
    const mapped = mapStrapiUser(strapiUser);
    setJwt(token);
    setUser(mapped);
    persist(token, mapped);
  }

  function clearSession() {
    setJwt(null);
    setUser(null);
    persist(null, null);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const stored = readStoredAuth();
      if (!stored?.jwt) {
        if (!cancelled) setIsReady(true);
        return;
      }

      try {
        const me = await fetchMe(stored.jwt);
        const mapped = mapStrapiUser(me);
        if (!cancelled && mapped) {
          setJwt(stored.jwt);
          setUser(mapped);
          persist(stored.jwt, mapped);
        }
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await loginRequest(email, password);
    if (!data?.jwt || !data?.user) {
      throw new Error("Неверный ответ сервера при входе.");
    }
    applySession(data.jwt, data.user);
    return mapStrapiUser(data.user);
  }, []);

  const register = useCallback(async ({ email, password }) => {
    const username = email.trim().toLowerCase();
    const data = await registerRequest({ username, email, password });
    if (data?.jwt && data?.user) {
      applySession(data.jwt, data.user);
      return { sessionStarted: true };
    }
    return {
      sessionStarted: false,
      hint:
        "Если в Strapi включено подтверждение email, откройте письмо и активируйте аккаунт, затем войдите.",
    };
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const forgotPassword = useCallback(async ({ email }) => {
    await forgotPasswordRequest(email);
  }, []);

  const resetPassword = useCallback(async ({ code, password, passwordConfirmation }) => {
    const data = await resetPasswordRequest(code, password, passwordConfirmation);
    if (data?.jwt && data?.user) {
      applySession(data.jwt, data.user);
      return true;
    }
    return false;
  }, []);

  const getAuthHeaders = useCallback(() => {
    return jwt ? { Authorization: `Bearer ${jwt}` } : {};
  }, [jwt]);

  const value = useMemo(
    () => ({
      user,
      jwt,
      isAuthenticated: Boolean(jwt && user),
      isReady,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      getAuthHeaders,
    }),
    [forgotPassword, getAuthHeaders, isReady, jwt, login, logout, register, resetPassword, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
