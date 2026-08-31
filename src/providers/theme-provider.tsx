"use client";

import * as React from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  mounted: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const stored =
      window.localStorage.getItem("theme") === "light" ? "light" : "dark";
    applyTheme(stored);
    const id = window.requestAnimationFrame(() => {
      setTheme(stored);
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      window.localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
