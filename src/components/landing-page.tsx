"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers, MousePointerClick, Server, Workflow } from "lucide-react";
import { useLab } from "@/providers/lab-provider";
import { cn } from "@/lib/utils";

const LABS = [
  {
    num: "Lab 1",
    title: "Tool Schemas",
    desc: "Compare vague vs well-designed schemas for 4 AstroLog tools. Learn the 6 design principles and explore JIT instructions.",
    tag: "API key enhances (optional)",
    tagColor: "text-secondary",
    icon: MousePointerClick,
  },
  {
    num: "Lab 2",
    title: "MCP Server",
    desc: "Explore the MCP architecture, build a server configuration, and watch JSON-RPC messages flow between client and server.",
    tag: "No API key needed",
    tagColor: "text-green-500",
    icon: Server,
  },
  {
    num: "Lab 3",
    title: "ReAct Loop",
    desc: "Step through 3 ReAct scenarios of increasing difficulty. Compare reasoning with and without explicit Thought steps.",
    tag: "API key enhances (optional)",
    tagColor: "text-secondary",
    icon: Workflow,
  },
];

export function LandingPage() {
  const { start } = useLab();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-4">
          Session 4 of 8
        </span>
        <h1 className="text-3xl font-bold mb-3">
          Tools, <span className="gradient-text">Function Calling</span> &amp;{" "}
          <span className="gradient-text">MCP</span>
        </h1>
        <p className="text-foreground/70 max-w-2xl mx-auto text-base">
          Design tool schemas that guide LLMs, simulate MCP servers, and build
          ReAct agent loops with{" "}
          <span className="font-medium text-foreground">AstroLog</span> — a
          fictional space logistics startup.
        </p>
      </div>

      {/* Why Tools Matter */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Why Tools Matter</h2>
        <p className="text-sm text-foreground/80 mb-3">
          Tools extend what an LLM can do, not just what it knows. While RAG
          (Day 3) gives models access to external knowledge, tools give them the
          ability to take actions — search databases, call APIs, run
          calculations, and update records.
        </p>
        <p className="text-sm text-foreground/80 mb-3">
          This lab uses AstroLog, a fictional space logistics startup, as the
          domain. You&apos;ll design tool schemas, build an MCP server
          configuration, and trace ReAct agent loops — all running client-side
          in your browser.
        </p>
        <p className="text-sm text-foreground/80">
          The key insight:{" "}
          <span className="font-medium text-foreground">
            schema design is context engineering for tools
          </span>
          . The same tool with a vague schema vs a well-designed schema produces
          dramatically different LLM behavior.
        </p>
      </div>

      {/* Lab cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {LABS.map((lab) => (
          <div
            key={lab.num}
            className="rounded-xl border border-border bg-card p-5 hover:border-session-4 transition-colors"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {lab.num}
              </span>
              <lab.icon className="h-5 w-5 text-session-4" />
            </div>
            <h3 className="mb-2 font-semibold">{lab.title}</h3>
            <p className="mb-3 text-sm text-foreground/70">{lab.desc}</p>
            <span className={cn("text-xs", lab.tagColor)}>{lab.tag}</span>
          </div>
        ))}
      </div>

      {/* How this lab works */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Layers className="h-5 w-5 text-session-4" />
          How this lab works
        </h2>
        <ul className="space-y-2 text-sm text-foreground/80">
          <li className="flex gap-2">
            <span className="text-session-4">•</span>
            <span>
              All tool simulations run in your browser — no backend, no server,
              no setup needed.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-session-4">•</span>
            <span>
              The 6 AstroLog tools use predefined data (missions, crew, cargo,
              weather) to simulate real tool behavior including error handling
              and JIT instructions.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-session-4">•</span>
            <span>
              Labs 1 &amp; 3 optionally call an LLM API for enhanced
              comparisons.
            </span>
          </li>
        </ul>
      </div>

      {/* Start button */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={start}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 glow-purple cursor-pointer"
        >
          Start the lab
          <ArrowRight className="h-4 w-4" />
        </button>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--session-4)] hover:bg-card cursor-pointer"
        >
          <BookOpen className="h-4 w-4 text-[var(--session-4)]" />
          Take the Quiz
        </Link>
      </div>
    </div>
  );
}
