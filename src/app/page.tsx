"use client";

import * as React from "react";
import { useLab } from "@/providers/lab-provider";
import { Header } from "@/components/header";
import { LandingPage } from "@/components/landing-page";
import { PhaseStepper } from "@/components/phase-stepper";
import { Phase1 } from "@/components/phases/phase1";
import { Phase2 } from "@/components/phases/phase2";
import { Phase3 } from "@/components/phases/phase3";
import { Phase4 } from "@/components/phases/phase4";

export default function Home() {
  const { started, completePhase } = useLab();
  const [selectedPhase, setSelectedPhase] = React.useState<number>(1);

  const handleComplete = (phase: number) => {
    completePhase(phase);
    if (phase < 4) setSelectedPhase(phase + 1);
  };

  return (
    <div className="min-h-screen border-border bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="relative">
          {!started ? (
            <LandingPage />
          ) : (
            <div className="relative">
              <PhaseStepper activePhase={selectedPhase} onSelect={setSelectedPhase} />
              {selectedPhase === 1 && (
                <Phase1 onComplete={() => handleComplete(1)} />
              )}
              {selectedPhase === 2 && (
                <Phase2 onComplete={() => handleComplete(2)} />
              )}
              {selectedPhase === 3 && (
                <Phase3 onComplete={() => handleComplete(3)} />
              )}
              {selectedPhase === 4 && (
                <Phase4 onComplete={() => handleComplete(4)} />
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Day 4 · Tools, Function Calling &amp; MCP — Context Engineering Workshop
      </footer>
    </div>
  );
}
