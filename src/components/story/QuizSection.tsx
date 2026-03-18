"use client";

import { useState } from "react";
import { ScrollUnlockBanner } from "./ScrollUnlockBanner";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

type ScrollItem = {
  type: string;
  name: string;
  flavor: string;
};

type CompletionData = {
  bushoEarned: number;
  totalBusho: number;
  rank: number;
  rankName: string;
  rankUp: boolean;
  currentStreak: number;
  longestStreak: number;
  newScrolls: ScrollItem[];
};

type Props = {
  questions: Question[];
  storyId: string;
  userId?: string;
  dojoCompleted?: boolean;
};

type State = "idle" | "submitting" | "done";

const RANK_THRESHOLDS = [0, 100, 300, 600, 1000, 1500];

function rankProgress(totalBusho: number, rank: number): { current: number; needed: number } {
  const base = RANK_THRESHOLDS[rank] ?? 0;
  const next = RANK_THRESHOLDS[rank + 1] ?? RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
  return { current: totalBusho - base, needed: next - base };
}

export function QuizSection({ questions, storyId, userId, dojoCompleted }: Props) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<CompletionData | null>(null);

  const allAnswered = questions.every((q) => q.id in selected);
  const score = questions.filter((q) => selected[q.id] === q.answer).length;
  const total = questions.length;

  async function handleComplete() {
    if (!userId || state !== "idle") return;
    setState("submitting");
    try {
      const res = await fetch(`/api/story/${storyId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, total, dojoCompleted }),
      });
      if (res.ok) {
        const data = (await res.json()) as CompletionData;
        setResult(data);
        setState("done");
      }
    } catch {
      setState("idle");
    }
  }

  return (
    <div>
      <div className="space-y-5">
        {questions.map((q, i) => {
          const picked = selected[q.id];
          const answered = q.id in selected;

          return (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-xl p-5 transition-shadow"
            >
              <p className="font-semibold text-shogun-ink mb-3 text-base">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  let cls =
                    "w-full text-left px-4 py-3 rounded-lg text-sm border-2 transition-all duration-200 min-h-[44px] ";
                  if (!answered) {
                    cls +=
                      "border-gray-200 text-gray-700 hover:border-shogun-gold hover:bg-yellow-50 active:scale-[0.98] cursor-pointer";
                  } else if (idx === q.answer) {
                    cls += "border-green-500 bg-green-50 text-green-800 font-medium";
                  } else if (idx === picked) {
                    cls += "border-red-400 bg-red-50 text-red-700";
                  } else {
                    cls += "border-gray-100 text-gray-400 cursor-default";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={answered}
                      onClick={() => setSelected((s) => ({ ...s, [q.id]: idx }))}
                      className={cls}
                    >
                      <span className="font-mono mr-2 text-xs">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                      {answered && idx === q.answer && <span className="ml-2">✓</span>}
                      {answered && idx === picked && idx !== q.answer && (
                        <span className="ml-2">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <p
                  className={`mt-3 text-sm font-medium ${
                    picked === q.answer ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {picked === q.answer
                    ? "Correct!"
                    : `The correct answer was ${String.fromCharCode(65 + q.answer)}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete button */}
      {allAnswered && state !== "done" && (
        <div className="mt-6 p-5 bg-shogun-ink rounded-xl text-center text-white">
          <p className="text-2xl font-bold mb-1">
            {score}/{total} correct
          </p>
          <p className="text-sm text-gray-300 mb-4">
            {score === total
              ? "Perfect score! Outstanding!"
              : score >= Math.ceil(total / 2)
              ? "Well done! Keep it up."
              : "Good effort — re-read to master this story."}
          </p>
          {userId ? (
            <button
              onClick={handleComplete}
              disabled={state === "submitting"}
              className="bg-shogun-gold text-shogun-dark px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors min-h-[44px] disabled:opacity-60"
            >
              {state === "submitting" ? "Saving…" : "Complete Story ⚔"}
            </button>
          ) : (
            <p className="text-xs text-gray-400">
              Sign in to save your progress and earn 武功.
            </p>
          )}
        </div>
      )}

      {/* Completion card */}
      {state === "done" && result !== null && (
        <>
          <div className="mt-6 rounded-xl overflow-hidden shadow-lg">
            {/* Top: busho earned */}
            <div className="bg-gradient-to-br from-shogun-gold via-yellow-400 to-amber-500 p-5 text-center text-shogun-dark">
              {result.bushoEarned > 0 ? (
                <>
                  <p className="text-4xl font-black mb-0.5">+{result.bushoEarned} 武功</p>
                  <p className="text-sm font-semibold opacity-75">
                    {score === total
                      ? "Flawless. A true samurai scholar."
                      : "Progress saved. Return to sharpen your knowledge."}
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold">Already mastered ⚔</p>
              )}
            </div>

            {/* Middle: rank bar */}
            <div className="bg-shogun-ink text-white px-5 py-4">
              {(() => {
                const { current, needed } = rankProgress(result.totalBusho, result.rank);
                const pct = Math.min(100, Math.round((current / needed) * 100));
                return (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        位階 · Rank
                      </span>
                      {result.rankUp && (
                        <span className="text-xs bg-shogun-gold text-shogun-dark px-2 py-0.5 rounded-full font-bold animate-pulse">
                          RANK UP!
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-lg text-shogun-gold mb-2">
                      {result.rankName}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-shogun-gold h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {result.totalBusho} 武功
                      {result.rank < 5 && (
                        <> · next rank at {RANK_THRESHOLDS[result.rank + 1]}</>
                      )}
                    </p>
                  </>
                );
              })()}

              {/* Streak */}
              <div className="mt-4 pt-3 border-t border-gray-700 flex items-center gap-3 text-sm">
                <span className="text-orange-400 font-bold">
                  🔥{" "}
                  {result.currentStreak > 0
                    ? `${result.currentStreak}${result.currentStreak === 1 ? " day" : " days"} of training`
                    : "First day!"}
                </span>
                {result.longestStreak > result.currentStreak && (
                  <span className="text-gray-500 text-xs">
                    · best: {result.longestStreak}d
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Scroll unlock banner */}
          {result.newScrolls.length > 0 && (
            <ScrollUnlockBanner scrolls={result.newScrolls} />
          )}
        </>
      )}
    </div>
  );
}
