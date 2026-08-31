"use client";

import * as React from "react";
import { RotateCcw, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhaseHeader } from "@/components/phase-header";
import { PhaseTabs } from "@/components/ui/phase-tabs";
import { scenarios } from "@/lib/react-scenarios-data";

const MAIN_TABS = ["Scenarios", "Reasoning Comparison"] as const;

const TYPE_STYLES: Record<string, { label: string; color: string; border: string }> = {
  thought: { label: "THOUGHT", color: "text-primary", border: "border-primary/20" },
  action: { label: "ACTION", color: "text-secondary", border: "border-secondary/20" },
  observation: { label: "OBSERVATION", color: "text-session-3", border: "border-session-3/20" },
  answer: { label: "ANSWER", color: "text-green-500", border: "border-green-500/20" },
};

export function Phase3({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = React.useState<string>("Scenarios");
  const [scenarioIdx, setScenarioIdx] = React.useState(0);
  const [step, setStep] = React.useState(0);

  const scenario = scenarios[scenarioIdx];
  const allSteps = scenario.steps;
  const visibleSteps = allSteps.slice(0, step + 1);
  const cost = visibleSteps.reduce((sum, s) => sum + s.tokens, 0);
  const totalSteps = allSteps.length;
  const isComplete = step >= totalSteps - 1;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const reset = () => setStep(0);

  const switchScenario = (i: number) => {
    setScenarioIdx(i);
    setStep(0);
  };

  return (
    <div className="space-y-6">
      <PhaseHeader
        badge="Phase 3"
        title="ReAct Agent Loop"
        duration="~15 min"
        description="Step through ReAct (Reason + Act) traces to see how agents chain tool calls with explicit reasoning. Compare traces with and without Thought steps to understand why structured reasoning matters."
      />

      <PhaseTabs tabs={MAIN_TABS} active={tab} onChange={setTab} />

      {tab === "Scenarios" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {scenarios.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => switchScenario(i)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer border",
                  i === scenarioIdx
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground border-transparent"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-mono text-muted-foreground">
              {scenario.id}
            </span>
            <h3 className="mt-2 text-sm font-semibold">{scenario.label}</h3>
            <p className="text-sm text-foreground/70">{scenario.description}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm">
              <span className="text-muted-foreground">User Query </span>
              <span className="text-foreground font-medium">{scenario.query}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Cumulative Token Cost </span>
                <span className="font-mono text-foreground">{cost} / {scenario.maxTokens}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {visibleSteps.map((s, i) => {
                const style = TYPE_STYLES[s.type];
                return (
                  <div key={i} className={cn("rounded-lg border p-4", style.border, "bg-muted/30")}>
                    <div className="mb-1 flex items-center gap-2 text-xs">
                      <span className={cn("font-semibold", style.color)}>{style.label}</span>
                      <span className="text-muted-foreground">+{s.tokens} tokens</span>
                    </div>
                    <p className="font-mono text-sm text-foreground/90">{s.content}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={next}
                disabled={isComplete}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition-all disabled:opacity-40"
              >
                Next Step ({Math.min(step + 1, totalSteps)}/{totalSteps})
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <span className="text-sm text-muted-foreground">
                {Math.min(step + 1, totalSteps)}/{totalSteps} steps viewed
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === "Reasoning Comparison" && <ReasoningComparison />}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 cursor-pointer bg-primary text-primary-foreground hover-glow-purple hover:brightness-110 px-6 py-3 text-base"
        >
          <Wrench className="h-4 w-4" />
          Complete Phase 3
        </button>
      </div>
    </div>
  );
}

function ReasoningComparison() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-sm">
          <span className="text-muted-foreground">Query </span>
          <span className="text-foreground font-medium">
            “Is it safe to launch from Cape Canaveral tomorrow?”
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-primary/30 bg-card p-6">
          <div className="mb-3 text-sm font-semibold text-primary">
            With Thought Steps
          </div>
          <div className="space-y-3">
            <StepRow type="thought" text={"Thought: The user is asking about launch safety for Cape Canaveral. I need to check the weather forecast. 'Tomorrow' means I need today's date to determine the correct date parameter."} />
            <StepRow type="action" text={'Action: get_weather_forecast(location="Cape Canaveral", date="2026-03-11")'} />
            <StepRow type="observation" text={'Observation: {"conditions": "Thunderstorms", "windSpeed": 45, "launchSafe": false}'} />
            <StepRow type="thought" text="Thought: The weather report shows thunderstorms with 45 km/h winds and launchSafe is false. I must clearly state it's unsafe and suggest alternatives per the JIT instructions." />
            <StepRow type="answer" text="Answer: No, it is NOT safe to launch from Cape Canaveral tomorrow. The forecast shows thunderstorms with 45 km/h winds. I recommend checking Vandenberg SFB or Tanegashima as alternatives." />
          </div>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-card p-6">
          <div className="mb-3 text-sm font-semibold text-red-500">
            Without Thought Steps
          </div>
          <div className="space-y-3 opacity-80">
            <StepRow type="action" text={'Action: get_weather_forecast(location="Cape Canaveral", date="2026-03-11")'} />
            <StepRow type="observation" text={'Observation: {"conditions": "Thunderstorms", "windSpeed": 45, "launchSafe": false}'} />
            <StepRow type="answer" text="Answer: The weather shows thunderstorms. You might want to wait for it to clear up and try again later." />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-foreground/80 leading-relaxed">
          With explicit Thought steps, the agent correctly interprets
          &apos;tomorrow&apos;, follows JIT instructions (no &apos;waiting for weather to
          clear&apos;), and suggests specific alternatives. Without Thought steps,
          the agent gives a vague response and violates the safety policy by
          suggesting to &apos;wait for it to clear.&apos;
        </p>
      </div>
    </div>
  );
}

function StepRow({ type, text }: { type: string; text: string }) {
  const style = TYPE_STYLES[type];
  return (
    <div className={cn("rounded-lg border p-3 bg-muted/30", style.border)}>
      <div className={cn("mb-1 text-xs font-semibold", style.color)}>{style.label}</div>
      <p className="font-mono text-xs text-foreground/90 leading-relaxed">{text}</p>
    </div>
  );
}
