import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Quiz } from "@/components/quiz/quiz";

export const metadata: Metadata = {
  title: "Quiz — Day 4: Tools, Function Calling & MCP",
  description: "Test your knowledge of tool schemas, MCP, and ReAct agent loops",
};

export default function QuizPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lab
        </Link>
      </div>
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-4">
          Check your understanding
        </span>
        <h1 className="text-3xl font-bold">
          Knowledge <span className="gradient-text">Quiz</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/70">
          {`35 questions across 5 sections covering tool schemas, JIT instructions,
          ReAct agent loops, the MCP protocol, and production concerns.`}
        </p>
      </div>
      <Quiz />
    </div>
  );
}
