"use client";

import * as React from "react";
import Link from "next/link";
import { Key, Moon, Sun, Wrench, BookOpen } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useLab } from "@/providers/lab-provider";
import { ApiKeysModal } from "@/components/api-keys-modal";

export function Header() {
  const { theme, mounted, toggleTheme } = useTheme();
  const { hasApiKey, mounted: keysMounted } = useLab();
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Wrench className="h-5 w-5 text-session-4" />
            <span className="text-sm sm:text-base">
              Day 4: Tools, Function Calling &amp; MCP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[var(--session-4)] hover:text-foreground cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quiz</span>
            </Link>
            <div className="flex items-center gap-1.5 text-xs">
              {keysMounted && hasApiKey ? (
                <span className="text-green-500">API key set</span>
              ) : keysMounted ? (
                <span className="text-yellow-500">No API keys</span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              title="API Keys"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-card transition-colors cursor-pointer"
            >
              <Key className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-card transition-colors cursor-pointer"
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              ))}
            </button>
          </div>
        </div>
      </nav>
      <ApiKeysModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
