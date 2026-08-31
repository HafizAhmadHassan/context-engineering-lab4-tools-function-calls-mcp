"use client";

import * as React from "react";
import { Check, CircleCheckBig, TriangleAlert, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhaseHeader } from "@/components/phase-header";
import { PhaseTabs } from "@/components/ui/phase-tabs";
import { CodeBlock } from "@/components/ui/code-block";
import { toolSchemas, schemaChecklist } from "@/lib/tool-schema-data";
import { designPrinciples } from "@/lib/design-principles-data";
import { jitTools } from "@/lib/jit-data";

const MAIN_TABS = [
  "Schema Comparison",
  "Design Principles",
  "JIT Instructions",
  "Lifecycle Pipeline",
] as const;

const TOOLS = ["Mission Search", "Crew Schedule", "Cargo Manifest", "Fuel Estimate"];

export function Phase1({ onComplete }: { onComplete: () => void }) {
  const [tab, setTab] = React.useState<string>("Schema Comparison");
  const [tool, setTool] = React.useState<string>("Mission Search");
  const [variant, setVariant] = React.useState<"vague" | "wellDesigned">("vague");
  const [checked, setChecked] = React.useState<boolean[]>(designPrinciples.map(() => false));
  const [jitToolIdx, setJitToolIdx] = React.useState(0);
  const [pipeStage, setPipeStage] = React.useState<number>(0);

  const schema = toolSchemas[tool];

  return (
    <div className="space-y-6">
      <PhaseHeader
        badge="Phase 1"
        title="Tool Schema Design"
        duration="~20 min"
        description="Compare vague vs well-designed tool schemas, learn the 6 design principles, and see how JIT instructions guide LLM reasoning. Good schema design is the highest-leverage investment in tool-use systems."
      />

      <PhaseTabs tabs={MAIN_TABS} active={tab} onChange={setTab} />

      {tab === "Schema Comparison" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {TOOLS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTool(t);
                  setVariant("vague");
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer border",
                  tool === t
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground border-transparent"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setVariant("vague")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2",
                  variant === "vague"
                    ? "bg-red-500/10 text-red-500 border-b-2 border-red-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <TriangleAlert className="h-4 w-4" />
                Vague Schema
              </button>
              <button
                type="button"
                onClick={() => setVariant("wellDesigned")}
                className={cn(
                  "flex-1 px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2",
                  variant === "wellDesigned"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-b-2 border-green-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CircleCheckBig className="h-4 w-4" />
                Well-Designed
              </button>
            </div>

            <div className="p-4">
              <div className="mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground">
                  {schema[variant].name}
                </span>
                <p className="text-sm text-foreground/70 mt-2">
                  {schema[variant].description}
                </p>
              </div>
              <CodeBlock code={schema[variant].schema} />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CircleCheckBig className="h-4 w-4 text-green-500" />
              Schema Score
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {schemaChecklist.map((item) => {
                const pass = variant === "wellDesigned";
                return (
                  <div
                    key={item}
                    className={cn(
                      "rounded-md px-3 py-2 text-xs",
                      pass
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 text-red-500 dark:text-red-400"
                    )}
                  >
                    {pass ? "✓" : "✗"} {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "Design Principles" && (
        <div className="space-y-3">
          <p className="text-sm text-foreground/70">
            Check off each principle as you understand it. These 6 rules will
            dramatically improve your tool schemas.
          </p>
          {designPrinciples.map((principle, i) => (
            <div
              key={principle.title}
              onClick={() =>
                setChecked((prev) => {
                  const next = [...prev];
                  next[i] = !next[i];
                  return next;
                })
              }
              className="rounded-xl border p-4 cursor-pointer transition-colors border-border bg-card hover:border-primary/20"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 mt-0.5 transition-colors",
                    checked[i] ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  )}
                >
                  {checked[i] && <Check className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">{principle.title}</h4>
                  <p className="text-xs text-foreground/70 mb-2">{principle.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-green-500/5 border border-green-500/20 p-2">
                      <span className="text-[10px] text-green-500 font-medium">Good</span>
                      <p className="text-xs font-mono text-foreground/70 mt-0.5">{principle.good}</p>
                    </div>
                    <div className="rounded-md bg-red-500/5 border border-red-500/20 p-2">
                      <span className="text-[10px] text-red-500 font-medium">Bad</span>
                      <p className="text-xs font-mono text-foreground/70 mt-0.5">{principle.bad}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center text-sm text-muted-foreground">
            {checked.filter(Boolean).length} / 6 principles checked
          </div>
        </div>
      )}

      {tab === "JIT Instructions" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-3">What are JIT Instructions?</h3>
            <p className="text-sm text-foreground/70 mb-2">
              Just-In-Time (JIT) instructions are guidance embedded in tool
              results, not tool schemas. They tell the LLM how to interpret and
              present specific data after a tool call returns.
            </p>
            <p className="text-sm text-foreground/70">
              This is a powerful context engineering technique: the tool itself
              influences the model&apos;s reasoning.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {jitTools.map((jt, i) => (
              <button
                key={jt.name}
                type="button"
                onClick={() => setJitToolIdx(i)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer border font-mono",
                  i === jitToolIdx
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground border-transparent"
                )}
              >
                {jt.name}
              </button>
            ))}
          </div>

          <p className="text-sm text-foreground/70">{jitTools[jitToolIdx].description}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Standard Result</span>
              </div>
              <CodeBlock code={jitTools[jitToolIdx].standard} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-secondary">
                  JIT-Enhanced Result
                </span>
              </div>
              <CodeBlock code={jitTools[jitToolIdx].enhanced} className="text-green-400" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-foreground/80">
              JIT (Just-In-Time) instructions are guidance injected INTO the
              tool&apos;s return value. The LLM reads them alongside the data and
              follows the instructions when composing its response. This lets
              tools influence how the LLM reasons without changing the system
              prompt.
            </p>
          </div>
        </div>
      )}

      {tab === "Lifecycle Pipeline" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-foreground/70">
              Click each stage to see how a tool call flows through the system —
              from schema injection to final response. Understanding this
              pipeline is essential for debugging tool-use issues.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold mb-4">Tool Lifecycle Pipeline</h3>
            <div className="flex items-center gap-1 mb-4 overflow-x-auto">
              {["📋", "🤔", "⚡", "📦", "💬"].map((emoji, i) => {
                const labels = ["DESCRIBE", "DECIDE", "CALL", "RETURN", "REASON"];
                return (
                  <React.Fragment key={labels[i]}>
                    {i > 0 && <div className="mx-1 text-muted-foreground text-sm">→</div>}
                    <button
                      type="button"
                      onClick={() => setPipeStage(i)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all cursor-pointer border",
                        pipeStage === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-foreground hover:border-primary/30"
                      )}
                    >
                      <span className="text-lg">{emoji}</span>
                      <span className="whitespace-nowrap">{labels[i]}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-4">
              {pipeStage === 0 && (
                <P>
                  <strong>DESCRIBE</strong> — The tool&apos;s schema and description
                  are injected into the system prompt. The model learns the full
                  tool signature: name, parameters, enums, and return shape.
                </P>
              )}
              {pipeStage === 1 && (
                <P>
                  <strong>DECIDE</strong> — Presented with the user&apos;s query, the
                  model decides whether to call a tool and with which arguments.
                  Clear schemas make this decision accurate.
                </P>
              )}
              {pipeStage === 2 && (
                <P>
                  <strong>CALL</strong> — The runtime invokes the tool with the
                  model&apos;s chosen arguments, executing the real action (search,
                  mutation, calculation) in the simulation.
                </P>
              )}
              {pipeStage === 3 && (
                <P>
                  <strong>RETURN</strong> — The tool&apos;s result — plus any JIT
                  instructions — is returned to the model as an observation.
                </P>
              )}
              {pipeStage === 4 && (
                <P>
                  <strong>REASON</strong> — The model interprets the observation,
                  follows any JIT guidance, and composes its final answer to the
                  user.
                </P>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 cursor-pointer bg-primary text-primary-foreground hover-glow-purple hover:brightness-110 px-6 py-3 text-base"
        >
          <Wrench className="h-4 w-4" />
          Complete Phase 1
        </button>
      </div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-foreground/80 leading-relaxed">{children}</p>;
}
