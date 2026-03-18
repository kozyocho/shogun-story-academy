"use client";

import { useState } from "react";

type Decision = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctOption: number;
  historicalNote: string;
  wrongNote: string;
};

type State = "idle" | "selected";

const OPTION_LABELS = ["A", "B", "C"];

export function StoryDecisionCard({ decision }: { decision: Decision }) {
  const [state, setState] = useState<State>("idle");
  const [picked, setPicked] = useState<number | null>(null);

  const options = [decision.optionA, decision.optionB, decision.optionC];
  const isCorrect = picked === decision.correctOption;

  function handlePick(idx: number) {
    if (state !== "idle") return;
    setPicked(idx);
    setState("selected");
  }

  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-shogun-ink px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">⚔️</span>
          <span className="text-xs font-bold text-shogun-gold uppercase tracking-widest">
            Historical Decision
          </span>
        </div>
        <p className="text-white font-semibold text-base leading-snug">
          {decision.question}
        </p>
      </div>

      {/* Options */}
      <div className="bg-gray-900 px-5 py-4 space-y-2.5">
        {options.map((opt, idx) => {
          let cls =
            "w-full text-left px-4 py-3 rounded-lg text-sm border-2 transition-all duration-200 min-h-[52px] flex items-start gap-3 ";

          if (state === "idle") {
            cls +=
              "border-gray-700 text-gray-200 hover:border-shogun-gold hover:bg-gray-800 active:scale-[0.98] cursor-pointer";
          } else if (idx === decision.correctOption) {
            cls += "border-shogun-gold bg-yellow-900/40 text-shogun-gold font-medium";
          } else if (idx === picked) {
            cls += "border-red-500 bg-red-900/30 text-red-300";
          } else {
            cls += "border-gray-800 text-gray-600 cursor-default";
          }

          return (
            <button
              key={idx}
              disabled={state !== "idle"}
              onClick={() => handlePick(idx)}
              className={cls}
            >
              <span className="font-mono text-xs font-bold shrink-0 mt-0.5 text-shogun-gold">
                {OPTION_LABELS[idx]}.
              </span>
              <span>{opt}</span>
              {state !== "idle" && idx === decision.correctOption && (
                <span className="ml-auto shrink-0">✓</span>
              )}
              {state !== "idle" && idx === picked && idx !== decision.correctOption && (
                <span className="ml-auto shrink-0">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reveal */}
      {state === "selected" && (
        <div
          className={`px-5 py-4 border-t-2 ${
            isCorrect
              ? "bg-gradient-to-br from-yellow-900/60 to-amber-900/40 border-shogun-gold"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          <p
            className={`font-bold text-sm mb-2 ${
              isCorrect ? "text-shogun-gold" : "text-red-400"
            }`}
          >
            {isCorrect
              ? "⚔️ Your instincts match history!"
              : "The history unfolded differently…"}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {isCorrect ? decision.historicalNote : decision.wrongNote}
          </p>
          <p className="text-gray-500 text-xs mt-3 italic">
            Continue reading to see what happened next ↓
          </p>
        </div>
      )}
    </div>
  );
}
