"use client";

import { useState } from "react";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

type Props = {
  questions: Question[];
  storyId: string;
  userId?: string;
};

type State = "idle" | "submitting" | "done";

export function QuizSection({ questions, storyId, userId }: Props) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [state, setState] = useState<State>("idle");
  const [xp, setXp] = useState<number | null>(null);

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
        body: JSON.stringify({ score, total }),
      });
      if (res.ok) {
        const data = (await res.json()) as { xp: number; alreadyCompleted?: boolean };
        setXp(data.xp);
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
                      onClick={() =>
                        setSelected((s) => ({ ...s, [q.id]: idx }))
                      }
                      className={cls}
                    >
                      <span className="font-mono mr-2 text-xs">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                      {answered && idx === q.answer && (
                        <span className="ml-2">✓</span>
                      )}
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

      {/* Score & complete button */}
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
              Sign in to save your progress and earn XP.
            </p>
          )}
        </div>
      )}

      {/* XP celebration */}
      {state === "done" && xp !== null && (
        <div className="mt-6 p-6 rounded-xl text-center text-shogun-dark bg-gradient-to-br from-shogun-gold via-yellow-400 to-amber-500 shadow-lg">
          {xp > 0 ? (
            <>
              <p className="text-4xl font-black mb-1">+{xp} XP</p>
              <p className="text-lg font-bold">Story Complete! ⚔</p>
              <p className="text-sm mt-1 opacity-75">
                {score === total
                  ? "Flawless. A true samurai scholar."
                  : "Progress saved. Return to sharpen your knowledge."}
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold">Already completed ⚔</p>
              <p className="text-sm mt-1 opacity-75">Your progress is saved.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
