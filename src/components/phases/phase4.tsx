"use client";

import * as React from "react";
import { Wrench } from "lucide-react";
import { PhaseHeader } from "@/components/phase-header";

const RESULTS = [
  {
    label: "Tool Schemas",
    score: "7 / 7",
    detail: "6/6 principles identified",
  },
  {
    label: "MCP Server",
    score: "5 / 5",
    detail: "4 tools, 1 resources, 1 prompts",
  },
  {
    label: "ReAct Loop",
    score: "6 / 6",
    detail: "3/3 scenarios explored",
  },
];

const TAKEAWAYS = [
  {
    title: "Schema design is the highest-leverage investment",
    body: "The same tool with a vague schema vs a well-designed schema produces dramatically different LLM behavior. Verb-noun naming, clear descriptions, enum constraints, and return documentation guide the model to make correct tool selections and pass valid arguments. This is context engineering for tools.",
  },
  {
    title: "MCP standardizes the tool integration layer",
    body: "The Model Context Protocol separates concerns: servers expose capabilities, clients manage connections, and hosts enforce policy. The three primitives (Tools, Resources, Prompts) map to who controls what — model-controlled tools, app-controlled resources, and user-controlled prompts.",
  },
  {
    title: "ReAct's explicit reasoning prevents tool misuse",
    body: "The Thought-Action-Observation loop forces the model to reason before acting and interpret results before responding. Without explicit Thought steps, agents skip reasoning, ignore JIT instructions, and produce superficial answers. Error recovery especially benefits from structured reasoning.",
  },
];

export function Phase4({ onComplete }: { onComplete: () => void }) {
  const myScore = parseInt(RESULTS[0].score.split(" / ")[0]) +
    parseInt(RESULTS[1].score.split(" / ")[0]) +
    parseInt(RESULTS[2].score.split(" / ")[0]);
  const maxScore =
    parseInt(RESULTS[0].score.split(" / ")[1]) +
    parseInt(RESULTS[1].score.split(" / ")[1]) +
    parseInt(RESULTS[2].score.split(" / ")[1]);

  return (
    <div className="space-y-6">
      <PhaseHeader
        badge="Phase 4"
        title="Synthesis"
        description="Review your results from all 3 labs and the key takeaways for building production tool integrations."
      />

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold">Your Results</h3>
        <div className="space-y-3">
          {RESULTS.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4"
            >
              <div>
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-xs text-muted-foreground">{r.detail}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{r.score}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="text-sm font-semibold">Total Score</div>
            <div className="text-lg font-bold text-primary">
              {myScore} / {maxScore}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold">Key Takeaways</h3>
        <div className="space-y-4">
          {TAKEAWAYS.map((t, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="mb-1 text-sm font-semibold text-secondary">
                {i + 1}. {t.title}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-2 text-sm font-semibold">What&apos;s Next</h3>
        <p className="text-sm text-foreground/80 leading-relaxed">
          <span className="font-medium text-primary">Day 5: Compress &amp; Isolate</span>{" "}
          — manage context windows efficiently with summarization, sliding
          windows, and sub-agent architectures.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 cursor-pointer bg-primary text-primary-foreground hover-glow-purple hover:brightness-110 px-6 py-3 text-base"
        >
          <Wrench className="h-4 w-4" />
          Complete Phase 4
        </button>
      </div>
    </div>
  );
}
