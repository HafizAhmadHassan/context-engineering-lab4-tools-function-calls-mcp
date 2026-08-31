"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PhaseTabsProps {
  tabs: readonly string[];
  active: string;
  onChange: (tab: string) => void;
}

export function PhaseTabs({ tabs, active, onChange }: PhaseTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(
            "relative rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer flex-1 whitespace-nowrap shrink-0",
            active === t
              ? "bg-card text-foreground border border-border"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
