"use client";

import {
  createContext,
  startTransition,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  clearStoredSession,
  getStoredSession,
  saveStoredSession,
  type AuthSession,
} from "@/lib/auth/session-storage";

type AuthContextValue = {
  isReady: boolean;
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [session, setSessionState] = useState<AuthSession | null>(null);

  useEffect(() => {
    startTransition(() => {
      setSessionState(getStoredSession());
      setIsReady(true);
    });
  }, []);

  const value: AuthContextValue = {
    isReady,
    session,
    setSession(nextSession) {
      saveStoredSession(nextSession);
      setSessionState(nextSession);
    },
    clearSession() {
      clearStoredSession();
      setSessionState(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
