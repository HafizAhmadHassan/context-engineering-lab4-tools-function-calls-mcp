"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLab } from "@/providers/lab-provider";

const PHASES = [
  { num: "Phase 1", label: "Tool Schemas" },
  { num: "Phase 2", label: "MCP Server" },
  { num: "Phase 3", label: "ReAct Loop" },
  { num: "Phase 4", label: "Synthesis" },
];

interface PhaseStepperProps {
  activePhase: number;
  onSelect: (phase: number) => void;
}

export function PhaseStepper({ activePhase, onSelect }: PhaseStepperProps) {
  const { canAccessPhase } = useLab();

  return (
    <div className="w-full mb-8">
      <div className="flex items-start justify-between max-w-3xl mx-auto">
        {PHASES.map((phase, i) => {
          const num = i + 1;
          const accessible = canAccessPhase(num);
          const isActive = activePhase === num;
          const isDone = num < activePhase;

          return (
            <React.Fragment key={phase.num}>
              <button
                type="button"
                onClick={() => accessible && onSelect(num)}
                disabled={!accessible}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all cursor-pointer",
                  !accessible && "cursor-default opacity-40"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isActive && "border-primary bg-primary text-primary-foreground",
                    isDone && !isActive && "border-primary bg-primary/10 text-primary",
                    !isActive && !isDone && "border-border text-muted-foreground"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : num}
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-muted-foreground">{phase.num}</div>
                  <div className="text-[10px] text-muted-foreground hidden sm:block">
                    {phase.label}
                  </div>
                </div>
              </button>
              {i < PHASES.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-full self-start mt-4 rounded",
                    num < activePhase ? "bg-primary/50" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
