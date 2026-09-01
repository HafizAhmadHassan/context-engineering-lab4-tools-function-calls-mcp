"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, RefreshCw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QUIZ_QUESTIONS,
  SECTION_COLORS,
  DEFAULT_COLOR,
} from "@/lib/quiz-data";
import { PhaseTabs } from "@/components/ui/phase-tabs";

type AnswerMap = Record<number, string>;
type View = "quiz" | "results";

const OPTION_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  A: { border: "#a5d8ff", bg: "rgba(165,216,255,0.08)", text: "#a5d8ff" },
  B: { border: "#eebefa", bg: "rgba(238,190,250,0.08)", text: "#eebefa" },
  C: { border: "#ffd8a8", bg: "rgba(255,216,168,0.08)", text: "#ffd8a8" },
  D: { border: "#b2f2bb", bg: "rgba(178,242,187,0.08)", text: "#b2f2bb" },
};

export function Quiz() {
  const sections = React.useMemo(
    () => Array.from(new Set(QUIZ_QUESTIONS.map((q) => q.section))),
    []
  );
  const [activeSection, setActiveSection] = React.useState(sections[0]);
  const [qIndex, setQIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [view, setView] = React.useState<View>("quiz");
  const [answers, setAnswers] = React.useState<AnswerMap>({});

  const currentQuestions = React.useMemo(
    () => QUIZ_QUESTIONS.filter((q) => q.section === activeSection),
    [activeSection]
  );
  const question = currentQuestions[qIndex];
  const total = currentQuestions.length;

  const correctCount = React.useMemo(
    () =>
      QUIZ_QUESTIONS.filter((q) => answers[q.id] === q.correctAnswer).length,
    [answers]
  );

  const selectSection = (section: string) => {
    setActiveSection(section);
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setView("quiz");
  };

  const prevQuestion = () => {
    setQIndex((i) => Math.max(0, i - 1));
    const prev = currentQuestions[Math.max(0, qIndex - 1)];
    setSelected(prev ? (answers[prev.id] ?? null) : null);
    const answered = prev ? answers[prev.id] !== undefined : false;
    setRevealed(answered);
  };

  const nextQuestion = () => {
    if (qIndex >= total - 1) {
      setView("results");
      return;
    }
    setQIndex(qIndex + 1);
    const next = currentQuestions[qIndex + 1];
    setSelected(next ? (answers[next.id] ?? null) : null);
    setRevealed(next ? answers[next.id] !== undefined : false);
  };

  const pick = (label: string) => {
    if (revealed) return;
    setSelected(label);
  };

  const submit = () => {
    if (!selected || revealed) return;
    setAnswers((prev) => ({ ...prev, [question.id]: selected }));
    setRevealed(true);
  };

  const resetSection = () => {
    const sectionIds = currentQuestions.map((q) => q.id);
    setAnswers((prev) => {
      const next = { ...prev };
      sectionIds.forEach((id) => delete next[id]);
      return next;
    });
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setView("quiz");
  };

  if (view === "results") {
    const sectionResults = sections.map((section) => {
      const qs = QUIZ_QUESTIONS.filter((q) => q.section === section);
      return {
        section,
        total: qs.length,
        correct: qs.filter((q) => answers[q.id] === q.correctAnswer).length,
      };
    });
    const percent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const emoji = percent >= 80 ? "🏆" : percent >= 60 ? "👏" : percent >= 40 ? "💪" : "📚";

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mb-4 text-7xl">{emoji}</div>
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            Quiz Complete!
          </h1>
          <p className="text-lg text-muted-foreground">
            Day 4 — Tools, Function Calling &amp; MCP
          </p>
          <div className="mx-auto my-8 flex items-center justify-center gap-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[var(--session-4)] text-center">
              <div>
                <div className="text-2xl font-bold">{percent}%</div>
                <div className="text-xs text-muted-foreground">accuracy</div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-5xl font-bold text-[var(--session-4)]">
                {correctCount}/{QUIZ_QUESTIONS.length}
              </div>
              <div className="text-[#a3a3a3]">correct answers</div>
            </div>
          </div>
        </div>

        {sectionResults.map((s) => {
          const color = SECTION_COLORS[s.section] || DEFAULT_COLOR;
          return (
            <div
              key={s.section}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: color }}
                />
                <h3
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color }}
                >
                  {s.section}
                </h3>
                <span className="ml-auto text-sm text-muted-foreground">
                  {s.correct}/{s.total}
                </span>
              </div>
              <div className="space-y-2">
                {QUIZ_QUESTIONS.filter((q) => q.section === s.section).map(
                  (q) => {
                    const ans = answers[q.id];
                    const isCorrect = ans === q.correctAnswer;
                    const unanswered = ans === undefined;
                    const qGlobal =
                      QUIZ_QUESTIONS.findIndex((qq) => qq.id === q.id);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setView("quiz");
                          selectSection(s.section);
                          setQIndex(
                            QUIZ_QUESTIONS.filter(
                              (qq) => qq.section === s.section
                            ).findIndex((qq) => qq.id === q.id)
                          );
                        }}
                        className="w-full rounded-lg border px-4 py-3 text-left transition-colors"
                        style={{
                          borderColor: unanswered
                            ? "rgba(255,255,255,0.1)"
                            : isCorrect
                              ? "rgba(34,197,94,0.3)"
                              : "rgba(239,68,68,0.3)",
                          background: unanswered
                            ? "rgba(255,255,255,0.02)"
                            : isCorrect
                              ? "rgba(34,197,94,0.05)"
                              : "rgba(239,68,68,0.05)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {String(qGlobal + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm">{q.question}</span>
                          <span className="ml-auto shrink-0 text-sm">
                            {unanswered ? "—" : isCorrect ? "✓" : "✗"}
                          </span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setActiveSection(sections[0]);
              setQIndex(0);
              setSelected(null);
              setRevealed(false);
              setView("quiz");
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-card cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PhaseTabs tabs={sections} active={activeSection} onChange={selectSection} />

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: SECTION_COLORS[activeSection],
              color: SECTION_COLORS[activeSection],
            }}
          >
            {activeSection}
          </span>
          <span className="text-xs text-muted-foreground">
            Question {qIndex + 1} of {total}
          </span>
        </div>

        <h2 className="mb-5 text-lg font-semibold leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isCorrect = revealed && opt.label === question.correctAnswer;
            const isWrong = revealed && opt.label === selected && opt.label !== question.correctAnswer;
            const style = OPTION_STYLES[opt.label];
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => pick(opt.label)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors cursor-pointer",
                  !revealed && selected === opt.label && "brightness-125"
                )}
                style={{
                  borderColor: isCorrect
                    ? "rgba(34,197,94,0.5)"
                    : isWrong
                      ? "rgba(239,68,68,0.5)"
                      : selected === opt.label
                        ? style.border
                        : "rgba(255,255,255,0.1)",
                  background: isCorrect
                    ? "rgba(34,197,94,0.08)"
                    : isWrong
                      ? "rgba(239,68,68,0.08)"
                      : selected === opt.label
                        ? style.bg
                        : "rgba(255,255,255,0.02)",
                }}
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                  style={{
                    border: `1px solid ${style.border}`,
                    color: style.text,
                    background: selected === opt.label || isCorrect ? style.bg : "transparent",
                  }}
                >
                  {opt.label}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div
            className="mt-4 rounded-lg border p-4"
            style={{
              borderColor:
                selected === question.correctAnswer
                  ? "rgba(34,197,94,0.3)"
                  : "rgba(239,68,68,0.3)",
              background:
                selected === question.correctAnswer
                  ? "rgba(34,197,94,0.05)"
                  : "rgba(239,68,68,0.05)",
            }}
          >
            <div className="mb-1 text-sm font-semibold">
              {selected === question.correctAnswer
                ? "✓ Correct"
                : `✗ Incorrect — correct answer: ${question.correctAnswer}`}
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={prevQuestion}
            disabled={qIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {revealed ? (
            <button
              type="button"
              onClick={nextQuestion}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--session-4)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 cursor-pointer"
            >
              {qIndex >= total - 1 ? "See Results" : "Next Question"}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!selected}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--session-4)] px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <Trophy className="h-4 w-4" />
              Submit Answer
            </button>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={resetSection}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset this section
          </button>
        </div>
      </div>
    </div>
  );
}
