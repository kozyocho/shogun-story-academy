"use client";

import { useState } from "react";
import { ScrollUnlockBanner } from "./ScrollUnlockBanner";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number;
};

type ScrollItem = { type: string; name: string; flavor: string };

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

type Phase = "intro" | "fighting" | "result" | "defeat";

const RANK_THRESHOLDS = [0, 100, 300, 600, 1000, 1500];

function rankProgress(totalBusho: number, rank: number) {
  const base = RANK_THRESHOLDS[rank] ?? 0;
  const next =
    RANK_THRESHOLDS[rank + 1] ??
    RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
  return { current: totalBusho - base, needed: next - base };
}

function Hearts({
  current,
  max,
  flip,
}: {
  current: number;
  max: number;
  flip?: boolean;
}) {
  return (
    <div className={`flex gap-1 ${flip ? "flex-row-reverse" : ""}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`text-xl leading-none transition-all duration-300 ${
            i < current ? "" : "grayscale opacity-25"
          }`}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

export function DuelMode({
  questions,
  storyId,
  userId,
  dojoCompleted,
  figure,
}: {
  questions: Question[];
  storyId: string;
  userId?: string;
  dojoCompleted?: boolean;
  figure?: string | null;
}) {
  const maxEnemyHp = questions.length;
  const maxPlayerHp = 3;

  const [phase, setPhase] = useState<Phase>("intro");
  const [playerHp, setPlayerHp] = useState(maxPlayerHp);
  const [enemyHp, setEnemyHp] = useState(maxEnemyHp);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [anim, setAnim] = useState<"slash" | "hit" | null>(null);
  const [result, setResult] = useState<CompletionData | null>(null);

  const opponent = figure ?? "Enemy General";

  function startDuel() {
    setPlayerHp(maxPlayerHp);
    setEnemyHp(maxEnemyHp);
    setQIdx(0);
    setScore(0);
    setAnim(null);
    setResult(null);
    setPhase("fighting");
  }

  async function handleAnswer(optIdx: number) {
    if (anim !== null) return;
    const q = questions[qIdx];
    const correct = optIdx === q.answer;

    if (correct) {
      const ns = score + 1;
      const ne = enemyHp - 1;
      setScore(ns);
      setEnemyHp(ne);
      setAnim("slash");
      setTimeout(() => {
        setAnim(null);
        const last = qIdx + 1 >= questions.length;
        if (ne <= 0 || last) {
          submit(ns, questions.length);
        } else {
          setQIdx(qIdx + 1);
        }
      }, 700);
    } else {
      const np = playerHp - 1;
      setPlayerHp(np);
      setAnim("hit");
      setTimeout(() => {
        setAnim(null);
        if (np <= 0) {
          setPhase("defeat");
        } else if (qIdx + 1 >= questions.length) {
          submit(score, questions.length);
        } else {
          setQIdx(qIdx + 1);
        }
      }, 700);
    }
  }

  async function submit(finalScore: number, total: number) {
    if (userId) {
      try {
        const res = await fetch(`/api/story/${storyId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: finalScore, total, dojoCompleted }),
        });
        if (res.ok) {
          const data = (await res.json()) as CompletionData;
          setResult(data);
        }
      } catch {
        /* ignore */
      }
    }
    setPhase("result");
  }

  // ── INTRO ──────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="mt-10 rounded-xl bg-shogun-ink overflow-hidden shadow-xl">
        <div className="px-5 py-7 text-center text-white">
          <p className="text-xs text-shogun-gold uppercase tracking-widest font-bold mb-6">
            ⚔️ Duel for Mastery
          </p>
          <div className="flex items-center justify-center gap-10 mb-6">
            {/* Enemy */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-900/60 border-2 border-red-700 flex items-center justify-center text-3xl mx-auto mb-2">
                🪖
              </div>
              <p className="text-sm font-bold text-red-300 max-w-[90px] leading-tight">
                {opponent}
              </p>
              <p className="text-base mt-1">
                {Array(maxEnemyHp).fill("❤️").join("")}
              </p>
            </div>

            <div className="text-2xl font-black text-shogun-gold">VS</div>

            {/* Player */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-3xl mx-auto mb-2">
                ⚔️
              </div>
              <p className="text-sm font-bold text-gray-300">You</p>
              <p className="text-base mt-1">❤️❤️❤️</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Answer correctly to strike. A wrong answer leaves you open.
          </p>

          <button
            onClick={startDuel}
            className="bg-shogun-gold text-shogun-dark font-bold px-10 py-3 rounded-lg text-lg min-h-[52px] hover:bg-yellow-400 active:scale-95 transition-all"
          >
            Begin Duel
          </button>
        </div>
      </div>
    );
  }

  // ── FIGHTING ───────────────────────────────────────────────────────────
  if (phase === "fighting") {
    const q = questions[qIdx];
    return (
      <div className="mt-10 rounded-xl overflow-hidden shadow-xl relative">
        <style>{`
          @keyframes duel-slash {
            0%   { left: -25%; opacity: 1; }
            100% { left: 115%; opacity: 0; }
          }
          @keyframes duel-hit {
            0%, 100% { transform: translateX(0); }
            20%  { transform: translateX(-12px); }
            45%  { transform: translateX(12px); }
            65%  { transform: translateX(-8px); }
            80%  { transform: translateX(8px); }
          }
        `}</style>

        {/* Slash overlay */}
        {anim === "slash" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div
              style={{
                position: "absolute",
                height: "4px",
                width: "60%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,230,100,0.95), transparent)",
                boxShadow: "0 0 14px 5px rgba(255,200,50,0.5)",
                top: "38%",
                transform: "skewX(-30deg)",
                animation: "duel-slash 0.55s ease-in forwards",
              }}
            />
          </div>
        )}

        {/* Battle bar */}
        <div
          className="bg-shogun-ink px-5 pt-4 pb-3"
          style={
            anim === "hit"
              ? { animation: "duel-hit 0.45s ease-in-out" }
              : {}
          }
        >
          <div className="flex justify-between items-center">
            {/* Enemy */}
            <div>
              <p className="text-xs font-bold text-red-400 mb-1.5">
                {opponent}
              </p>
              <Hearts current={enemyHp} max={maxEnemyHp} />
            </div>

            {/* Round counter */}
            <div className="text-center">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                Round
              </p>
              <p className="text-xl font-black text-shogun-gold leading-none mt-0.5">
                {qIdx + 1}
                <span className="text-gray-600 text-sm font-normal">
                  /{questions.length}
                </span>
              </p>
            </div>

            {/* Player */}
            <div className="text-right">
              <p className="text-xs font-bold text-sky-400 mb-1.5">You</p>
              <Hearts current={playerHp} max={maxPlayerHp} flip />
            </div>
          </div>
        </div>

        {/* Question + Options */}
        <div className="bg-gray-950 px-5 py-5">
          <p className="text-white font-semibold text-base leading-snug mb-5">
            {q.question}
          </p>
          <div className="space-y-2.5">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={anim !== null}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-800 text-gray-200 text-sm min-h-[52px] flex items-start gap-3 hover:border-shogun-gold hover:bg-gray-900 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="font-mono text-xs text-shogun-gold shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── DEFEAT ─────────────────────────────────────────────────────────────
  if (phase === "defeat") {
    return (
      <div className="mt-10 rounded-xl bg-gray-950 border border-red-900/60 p-8 text-center shadow-xl">
        <p className="text-5xl mb-4">💀</p>
        <p className="text-2xl font-black text-red-400 mb-2">Defeated</p>
        <p className="text-gray-500 text-sm mb-6">
          Your opponent was stronger this time. Return to train harder.
        </p>
        <button
          onClick={startDuel}
          className="bg-shogun-red text-white px-8 py-3 rounded-lg font-bold min-h-[44px] hover:bg-red-700 active:scale-95 transition-all"
        >
          ⚔️ Challenge Again
        </button>
      </div>
    );
  }

  // ── RESULT / VICTORY ───────────────────────────────────────────────────
  return (
    <>
      <div className="mt-10 rounded-xl overflow-hidden shadow-xl">
        {/* Victory banner */}
        <div className="bg-gradient-to-br from-shogun-gold via-yellow-400 to-amber-500 p-5 text-center text-shogun-dark">
          <p className="text-4xl mb-2">⚔️</p>
          <p className="text-3xl font-black mb-1">Victory!</p>
          {result && result.bushoEarned > 0 ? (
            <>
              <p className="text-2xl font-bold">+{result.bushoEarned} 武功</p>
              <p className="text-sm font-medium opacity-70 mt-1">
                {score === questions.length
                  ? "Flawless. A true samurai scholar."
                  : "Progress recorded. Sharpen your blade."}
              </p>
            </>
          ) : result ? (
            <p className="text-lg font-bold">Already mastered ⚔</p>
          ) : null}
          {!userId && (
            <p className="text-sm opacity-70 mt-2">
              Sign in to save progress and earn 武功.
            </p>
          )}
        </div>

        {/* Rank + Streak */}
        {result && (
          <div className="bg-shogun-ink text-white px-5 py-4">
            {(() => {
              const { current, needed } = rankProgress(
                result.totalBusho,
                result.rank
              );
              const pct = Math.min(
                100,
                Math.round((current / needed) * 100)
              );
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
                  <div className="mt-4 pt-3 border-t border-gray-700 flex items-center gap-3 text-sm">
                    <span className="text-orange-400 font-bold">
                      🔥{" "}
                      {result.currentStreak > 0
                        ? `${result.currentStreak} day${result.currentStreak === 1 ? "" : "s"} of training`
                        : "First day!"}
                    </span>
                    {result.longestStreak > result.currentStreak && (
                      <span className="text-gray-500 text-xs">
                        · best: {result.longestStreak}d
                      </span>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {result && result.newScrolls.length > 0 && (
        <ScrollUnlockBanner scrolls={result.newScrolls} />
      )}
    </>
  );
}
