"use client";

import * as React from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QUIZ_QUESTIONS,
  SECTION_COLORS,
  DEFAULT_COLOR,
} from "@/lib/quiz-data";

type AnswerMap = Record<number, string>;
type View = "quiz" | "results";
type Difficulty = "easy" | "medium" | "hard" | "tricky";

const OPTION_STYLES: Record<string, { border: string; bg: string; text: string }> = {
  A: { border: "#a5d8ff", bg: "rgba(165,216,255,0.08)", text: "#a5d8ff" },
  B: { border: "#eebefa", bg: "rgba(238,190,250,0.08)", text: "#eebefa" },
  C: { border: "#ffd8a8", bg: "rgba(255,216,168,0.08)", text: "#ffd8a8" },
  D: { border: "#b2f2bb", bg: "rgba(178,242,187,0.08)", text: "#b2f2bb" },
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "#22c55e",
  medium: "#facc15",
  hard: "#f97316",
  tricky: "#ef4444",
};

const SECTION_ORDER = [
  "Tool Fundamentals & Schema Design",
  "JIT Instructions & Safety",
  "ReAct Pattern & Agent Behavior",
  "MCP Architecture & Protocol",
  "Production Concerns",
];

export function Quiz() {
  const sections = React.useMemo(
    () =>
      SECTION_ORDER.filter((s) =>
        QUIZ_QUESTIONS.some((q) => q.section === s)
      ),
    []
  );
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [qIndex, setQIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [view, setView] = React.useState<View>("quiz");
  const [answers, setAnswers] = React.useState<AnswerMap>({});

  const currentQuestions = React.useMemo(
    () =>
      activeSection
        ? QUIZ_QUESTIONS.filter((q) => q.section === activeSection)
        : QUIZ_QUESTIONS,
    [activeSection]
  );
  const question = currentQuestions[qIndex];
  const total = currentQuestions.length;
  const score = currentQuestions.filter(
    (q) => answers[q.id] === q.correctAnswer
  ).length;
  const totalCorrect = React.useMemo(
    () =>
      QUIZ_QUESTIONS.filter((q) => answers[q.id] === q.correctAnswer).length,
    [answers]
  );
  const answeredCount = currentQuestions.filter(
    (q) => answers[q.id] !== undefined
  ).length;

  const viewQuestion = (q: (typeof QUIZ_QUESTIONS)[number]) => {
    setSelected(answers[q.id] ?? null);
    setRevealed(answers[q.id] !== undefined);
    setView("quiz");
  };

  const pickSection = (section: string | null) => {
    setActiveSection(section);
    const first = section
      ? QUIZ_QUESTIONS.filter((q) => q.section === section)[0]
      : QUIZ_QUESTIONS[0];
    setQIndex(0);
    viewQuestion(first);
  };

  const goToIndex = (i: number) => {
    const q = currentQuestions[i];
    if (!q) return;
    setQIndex(i);
    setSelected(answers[q.id] ?? null);
    setRevealed(answers[q.id] !== undefined);
  };

  const prevQuestion = () => {
    if (qIndex === 0) return;
    goToIndex(qIndex - 1);
  };

  const nextQuestion = () => {
    if (qIndex >= total - 1) {
      setView("results");
      return;
    }
    goToIndex(qIndex + 1);
  };

  const pick = (label: string) => {
    if (revealed) return;
    setSelected(label);
  };

  const submit = () => {
    if (!selected || revealed || !question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: selected }));
    setRevealed(true);
  };

  const restartScope = () => {
    const ids = currentQuestions.map((q) => q.id);
    setAnswers((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setView("quiz");
  };

  const restartAll = () => {
    setAnswers({});
    setActiveSection(null);
    setQIndex(0);
    setSelected(null);
    setRevealed(false);
    setView("quiz");
  };

  if (!question) return null;

  if (view === "results") {
    const percent = Math.round((totalCorrect / QUIZ_QUESTIONS.length) * 100);
    const emoji =
      percent >= 80 ? "🏆" : percent >= 60 ? "👏" : percent >= 40 ? "💪" : "📚";
    const sectionResults = sections.map((section) => {
      const qs = QUIZ_QUESTIONS.filter((q) => q.section === section);
      return {
        section,
        total: qs.length,
        correct: qs.filter((q) => answers[q.id] === q.correctAnswer).length,
      };
    });

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
                {totalCorrect}/{QUIZ_QUESTIONS.length}
              </div>
              <div className="text-muted-foreground">correct answers</div>
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
              <div className="mb-3 flex items-center gap-2">
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
              <div className="flex flex-wrap gap-1.5">
                {QUIZ_QUESTIONS.filter((q) => q.section === s.section).map(
                  (q) => {
                    const ans = answers[q.id];
                    const isCorrect = ans === q.correctAnswer;
                    const unanswered = ans === undefined;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setActiveSection(s.section);
                          const idx = QUIZ_QUESTIONS.filter(
                            (qq) => qq.section === s.section
                          ).findIndex((qq) => qq.id === q.id);
                          setQIndex(idx);
                          viewQuestion(q);
                        }}
                        title={`Q${q.id} — ${q.question}`}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition-all hover:brightness-125 cursor-pointer",
                          isCorrect && "border-green-500/40 bg-green-500/15",
                          !unanswered &&
                            !isCorrect &&
                            "border-red-500/40 bg-red-500/10",
                          unanswered &&
                            "border-border bg-muted/50 text-muted-foreground"
                        )}
                      >
                        {unanswered ? (
                          q.id
                        ) : isCorrect ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
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
            onClick={restartAll}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-card cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const sectionColor = activeSection
    ? SECTION_COLORS[activeSection] || DEFAULT_COLOR
    : DEFAULT_COLOR;
  const isCorrect = revealed && selected === question.correctAnswer;

  return (
    <div className="space-y-5">
      {/* Section chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => pickSection(null)}
          className="rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer"
          style={
            activeSection === null
              ? {
                  background: DEFAULT_COLOR,
                  color: "#000",
                  border: `1px solid ${DEFAULT_COLOR}`,
                }
              : {
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                  border: "1px solid var(--border)",
                }
          }
        >
          All ({QUIZ_QUESTIONS.length})
        </button>
        {sections.map((s) => {
          const count = QUIZ_QUESTIONS.filter((q) => q.section === s).length;
          const color = SECTION_COLORS[s] || DEFAULT_COLOR;
          const isActive = activeSection === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => pickSection(s)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer"
              style={
                isActive
                  ? { background: color, color: "#000", border: `1px solid ${color}` }
                  : {
                      background: "var(--muted)",
                      color: "var(--muted-foreground)",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {s.split(" & ")[0].split(" ").slice(0, 2).join(" ")} ({count})
            </button>
          );
        })}
      </div>

      {/* Question number grid */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {currentQuestions.map((q, i) => {
          const ans = answers[q.id];
          const answered = ans !== undefined;
          const isCurrent = i === qIndex;
          const correct = answered && ans === q.correctAnswer;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => goToIndex(i)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-all hover:brightness-125 cursor-pointer",
                isCurrent &&
                  "border-2 border-[var(--session-4)] text-foreground",
                !isCurrent && correct && "border-2 border-green-500/40 bg-green-500/15 text-green-500",
                !isCurrent && answered && !correct && "border-2 border-red-500/40 bg-red-500/10 text-red-500",
                !isCurrent && !answered && "border border-border bg-muted/50 text-muted-foreground"
              )}
            >
              {q.id}
            </button>
          );
        })}
      </div>

      {/* Question header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
              Q {qIndex + 1}
              <span className="text-muted-foreground/60"> / {total}</span>
            </span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(answeredCount / total) * 100}%`,
                  background: sectionColor,
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{
                background: `${DIFFICULTY_COLORS[question.difficulty]}15`,
                color: DIFFICULTY_COLORS[question.difficulty],
              }}
            >
              {question.difficulty}
            </span>
            <span
              className="rounded-md px-2.5 py-1 text-xs font-medium"
              style={{
                background: `${sectionColor}15`,
                color: sectionColor,
              }}
            >
              {question.topic}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-green-500" />
            <span className="font-mono text-sm font-bold text-green-500">
              {score}
            </span>
          </div>
        </div>

        <h2
          key={question.id}
          className="quiz-question-enter mb-6 text-xl font-semibold leading-relaxed tracking-tight md:text-[24px]"
        >
          {question.question}
        </h2>

        {/* Options */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {question.options.map((opt) => {
            const style = OPTION_STYLES[opt.label];
            const isSel = selected === opt.label;
            const isAns = opt.label === question.correctAnswer;
            let borderColor = "#262626";
            let bg = "var(--card-hover)";
            if (revealed && isAns) {
              borderColor = "#22c55e";
              bg = "rgba(34,197,94,0.08)";
            } else if (revealed && isSel && !isAns) {
              borderColor = "#ef4444";
              bg = "rgba(239,68,68,0.08)";
            } else if (isSel) {
              borderColor = style.border;
              bg = style.bg;
            }
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => pick(opt.label)}
                disabled={revealed}
                className={cn(
                  "relative flex min-h-[120px] cursor-pointer items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors disabled:cursor-default",
                  !revealed && "hover:border-[var(--session-4)]"
                )}
                style={{
                  borderColor,
                  background: bg || "var(--card-hover)",
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold"
                  style={{
                    background:
                      revealed && isAns
                        ? "#22c55e"
                        : revealed && isSel && !isAns
                          ? "#ef4444"
                          : isSel
                            ? style.border
                            : "#1f1f1f",
                    color:
                      revealed && (isAns || (isSel && !isAns))
                        ? "#000"
                        : isSel
                          ? "#000"
                          : style.text,
                  }}
                >
                  {revealed && isAns ? (
                    <Check size={20} strokeWidth={3} />
                  ) : revealed && isSel && !isAns ? (
                    <X size={20} strokeWidth={3} />
                  ) : (
                    opt.label
                  )}
                </div>
                <span className="pt-1.5 text-[15px] leading-relaxed">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div
            className="mb-5 rounded-xl border p-5"
            style={{
              borderColor: isCorrect
                ? "rgba(34,197,94,0.3)"
                : "rgba(239,68,68,0.3)",
              background: isCorrect
                ? "rgba(34,197,94,0.05)"
                : "rgba(239,68,68,0.05)",
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              {isCorrect ? (
                <>
                  <Check size={20} className="text-green-500" strokeWidth={3} />
                  <span className="text-sm font-bold uppercase tracking-wider text-green-500">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <X size={20} className="text-red-500" strokeWidth={3} />
                  <span className="text-sm font-bold uppercase tracking-wider text-red-500">
                    Not quite — the answer is {question.correctAnswer}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Footer nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevQuestion}
              disabled={qIndex === 0}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={15} />
              Prev
            </button>
            <button
              type="button"
              onClick={restartScope}
              title={`Restart ${activeSection ?? "All"} questions`}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              <RotateCcw size={14} />
              Restart
            </button>
          </div>
          <div className="flex items-center gap-3">
            {!revealed ? (
              <>
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                >
                  Skip
                  <ChevronRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!selected}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:brightness-110 cursor-pointer bg-[var(--session-4)] text-white"
                >
                  Lock In Answer
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={nextQuestion}
                className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-110 cursor-pointer bg-[var(--session-4)] text-white"
              >
                {qIndex >= total - 1 ? (
                  <>
                    See Results
                    <Trophy size={16} />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}