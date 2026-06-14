import type { Quiz } from "@/types";

export type QuizPhase = "upcoming" | "open" | "closed";

export function getQuizWindow(quiz: Quiz) {
  const start = new Date(quiz.startAt);
  const end = new Date(start.getTime() + quiz.durationMinutes * 60_000);
  return { start, end };
}

export function getQuizPhase(quiz: Quiz, now = new Date()): QuizPhase {
  if (quiz.status === "closed") return "closed";
  const { start, end } = getQuizWindow(quiz);
  if (now < start) return "upcoming";
  if (now >= end) return "closed";
  return "open";
}

export function getWindowRemainingSeconds(quiz: Quiz, now = new Date()): number {
  const { end } = getQuizWindow(quiz);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
}

export function getAttemptSeconds(
  quiz: Quiz,
  attemptStartedAt: Date,
  now = new Date()
): number {
  const elapsed = Math.floor((now.getTime() - attemptStartedAt.getTime()) / 1000);
  const fromDuration = quiz.durationMinutes * 60 - elapsed;
  const fromWindow = getWindowRemainingSeconds(quiz, now);
  return Math.max(0, Math.min(fromDuration, fromWindow));
}

export function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ar-PS", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function calculateQuizScore(
  questions: Quiz["questions"],
  answers: number[]
): { score: number; maxScore: number } {
  const maxScore = questions.length;
  const score = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
  return { score, maxScore };
}
