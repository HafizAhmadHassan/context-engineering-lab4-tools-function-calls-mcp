"use client";

import * as React from "react";

export interface ApiKeys {
  gemini?: string;
  openai?: string;
  groq?: string;
}

interface LabContextValue {
  started: boolean;
  start: () => void;
  currentPhase: number;
  completePhase: (phase: number) => void;
  canAccessPhase: (phase: number) => boolean;
  apiKeys: ApiKeys;
  hasApiKey: boolean;
  mounted: boolean;
  setApiKeys: (keys: ApiKeys) => void;
  clearApiKeys: () => void;
  resetLab: () => void;
}

const LabContext = React.createContext<LabContextValue | undefined>(undefined);

const STORAGE_KEY = "day4-api-keys";

export function LabProvider({ children }: { children: React.ReactNode }) {
  const [started, setStarted] = React.useState(false);
  const [completedPhases, setCompletedPhases] = React.useState<number[]>([]);
  const [apiKeys, setApiKeysState] = React.useState<ApiKeys>({});
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    let stored: ApiKeys = {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        stored = JSON.parse(raw);
      } catch {
        stored = {};
      }
    }
    const id = window.requestAnimationFrame(() => {
      setApiKeysState(stored);
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const start = React.useCallback(() => setStarted(true), []);

  const currentPhase = React.useMemo(() => {
    let phase = 1;
    while (completedPhases.includes(phase)) phase++;
    return Math.min(phase, 4);
  }, [completedPhases]);

  const completePhase = React.useCallback((phase: number) => {
    setCompletedPhases((prev) => (prev.includes(phase) ? prev : [...prev, phase]));
  }, []);

  const canAccessPhase = React.useCallback(
    (phase: number) => {
      if (phase === 1) return true;
      for (let i = 1; i < phase; i++) {
        if (!completedPhases.includes(i)) return false;
      }
      return true;
    },
    [completedPhases]
  );

  const hasApiKey = Boolean(apiKeys.gemini || apiKeys.openai || apiKeys.groq);

  const setApiKeys = React.useCallback((keys: ApiKeys) => {
    setApiKeysState(keys);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  }, []);

  const clearApiKeys = React.useCallback(() => {
    setApiKeysState({});
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }, []);

  const resetLab = React.useCallback(() => {
    setCompletedPhases([]);
    setStarted(false);
  }, []);

  return (
    <LabContext.Provider
      value={{
        started,
        start,
        currentPhase,
        completePhase,
        canAccessPhase,
        apiKeys,
        hasApiKey,
        mounted,
        setApiKeys,
        clearApiKeys,
        resetLab,
      }}
    >
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  const ctx = React.useContext(LabContext);
  if (!ctx) throw new Error("useLab must be used within LabProvider");
  return ctx;
}
