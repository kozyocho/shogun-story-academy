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

const DUEL_STYLES = `
  @keyframes duel-slash {
    0%   { left: -25%; opacity: 1; }
    100% { left: 115%; opacity: 0; }
  }
  @keyframes duel-hit {
    0%, 100% { transform: translateX(0); }
    20%  { transform: translateX(-14px); }
    45%  { transform: translateX(14px); }
    65%  { transform: translateX(-9px); }
    80%  { transform: translateX(9px); }
  }
  @keyframes flash-gold {
    0%   { opacity: 0.7; }
    100% { opacity: 0; }
  }
  @keyframes flash-red {
    0%   { opacity: 0.5; }
    100% { opacity: 0; }
  }
  @keyframes verdict-pop {
    0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
    40%  { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
  }
  @keyframes rankup-scale {
    0%   { transform: scale(0.5); opacity: 0; }
    60%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes rankup-glow {
    0%, 100% { text-shadow: 0 0 20px rgba(201,168,76,0.8); }
    50%       { text-shadow: 0 0 60px rgba(201,168,76,1), 0 0 100px rgba(180,120,0,0.6); }
  }
  @keyframes particle-float {
    0%   { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-120px) scale(0); opacity: 0; }
  }
  @keyframes busho-float {
    0%   { transform: translateY(0) scale(0.8); opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: translateY(-40px) scale(1.1); opacity: 0; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes sword-appear {
    0%   { opacity: 0; transform: translateY(20px) rotate(-5deg); }
    100% { opacity: 1; transform: translateY(0) rotate(0deg); }
  }
  @keyframes vs-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.7; transform: scale(1.08); }
  }
  @keyframes hp-drain {
    0%   { filter: brightness(1.5); }
    100% { filter: brightness(1); }
  }
  @keyframes border-flicker {
    0%, 100% { border-color: rgba(201,168,76,0.4); }
    50%       { border-color: rgba(201,168,76,0.8); }
  }
`;

function PlayerHeart({ active }: { active: boolean }) {
  return (
    <span
      className="text-lg leading-none transition-all duration-300"
      style={{ filter: active ? "none" : "grayscale(1)", opacity: active ? 1 : 0.2 }}
    >
      💛
    </span>
  );
}

function EnemyHeart({ active }: { active: boolean }) {
  return (
    <span
      className="text-lg leading-none transition-all duration-300"
      style={{ filter: active ? "none" : "grayscale(1)", opacity: active ? 1 : 0.2 }}
    >
      ❤️
    </span>
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
  const [showRankUp, setShowRankUp] = useState(false);

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
    let completionData: CompletionData | null = null;
    if (userId) {
      try {
        const res = await fetch(`/api/story/${storyId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: finalScore, total, dojoCompleted }),
        });
        if (res.ok) {
          completionData = (await res.json()) as CompletionData;
          setResult(completionData);
          if (completionData.rankUp) setShowRankUp(true);
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
      <div
        className="mt-10 overflow-hidden shadow-2xl"
        style={{ background: "#0a0906", border: "1px solid rgba(201,168,76,0.15)" }}
      >
        <style>{DUEL_STYLES}</style>

        {/* Top label */}
        <div
          className="px-5 pt-6 pb-0 text-center"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}
        >
          <p
            className="text-shogun-gold uppercase font-bold mb-5"
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              animation: "sword-appear 0.6s ease-out forwards",
            }}
          >
            ⚔ DUEL FOR MASTERY
          </p>
        </div>

        {/* VS Section */}
        <div className="px-5 py-8">
          <div className="flex items-center justify-center gap-6 mb-8">
            {/* Enemy */}
            <div className="text-center" style={{ animation: "sword-appear 0.5s ease-out 0.1s both" }}>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-3"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #3d0a0a, #1a0404)",
                  border: "2px solid #7f1d1d",
                  boxShadow: "0 0 20px rgba(127,29,29,0.4), inset 0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                🪖
              </div>
              <p className="text-red-300 font-bold text-sm max-w-[90px] leading-tight mx-auto">
                {opponent}
              </p>
              <div className="flex gap-0.5 justify-center mt-2">
                {Array.from({ length: maxEnemyHp }).map((_, i) => (
                  <EnemyHeart key={i} active={true} />
                ))}
              </div>
            </div>

            {/* VS */}
            <div
              className="text-shogun-gold font-black"
              style={{
                fontSize: "2rem",
                animation: "vs-pulse 2s ease-in-out infinite",
                textShadow: "0 0 20px rgba(201,168,76,0.6)",
              }}
            >
              VS
            </div>

            {/* Player */}
            <div className="text-center" style={{ animation: "sword-appear 0.5s ease-out 0.2s both" }}>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-3"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #1a1a14, #0d0d09)",
                  border: "2px solid rgba(201,168,76,0.4)",
                  boxShadow: "0 0 20px rgba(201,168,76,0.1), inset 0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                ⚔️
              </div>
              <p className="text-gray-400 font-bold text-sm">You</p>
              <div className="flex gap-0.5 justify-center mt-2">
                {Array.from({ length: maxPlayerHp }).map((_, i) => (
                  <PlayerHeart key={i} active={true} />
                ))}
              </div>
            </div>
          </div>

          {/* Divider line */}
          <div
            className="mx-auto mb-6"
            style={{
              height: "1px",
              maxWidth: "200px",
              background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)",
            }}
          />

          {/* Flavor text */}
          <p
            className="text-gray-500 text-xs text-center max-w-xs mx-auto mb-8 leading-relaxed"
            style={{ animation: "sword-appear 0.5s ease-out 0.3s both" }}
          >
            Answer correctly to strike. A wrong answer leaves you open to a counter-attack.
          </p>

          {/* Begin Duel button */}
          <div className="text-center" style={{ animation: "sword-appear 0.5s ease-out 0.4s both" }}>
            <button
              onClick={startDuel}
              className="text-shogun-dark font-black text-lg px-12 py-4 uppercase transition-all duration-200 hover:scale-105 active:scale-[0.97] min-h-[56px]"
              style={{
                background: "linear-gradient(135deg, #d4a832 0%, #c9a84c 50%, #b8922a 100%)",
                letterSpacing: "0.2em",
                boxShadow: "0 4px 20px rgba(201,168,76,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              Begin Duel
            </button>
            {/* Red line decoration */}
            <div
              className="mx-auto mt-1"
              style={{
                height: "2px",
                width: "120px",
                background: "linear-gradient(90deg, transparent, #7f1d1d, transparent)",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── FIGHTING ───────────────────────────────────────────────────────────
  if (phase === "fighting") {
    const q = questions[qIdx];
    return (
      <div
        className="mt-10 overflow-hidden shadow-2xl relative"
        style={{ background: "#0a0906" }}
      >
        <style>{DUEL_STYLES}</style>

        {/* Gold flash overlay (correct) */}
        {anim === "slash" && (
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              background: "rgba(201,168,76,0.12)",
              animation: "flash-gold 0.5s ease-out forwards",
            }}
          />
        )}

        {/* Red flash overlay (wrong) */}
        {anim === "hit" && (
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              background: "rgba(180,20,20,0.2)",
              animation: "flash-red 0.5s ease-out forwards",
            }}
          />
        )}

        {/* Slash line effect */}
        {anim === "slash" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
            <div
              style={{
                position: "absolute",
                height: "3px",
                width: "65%",
                background: "linear-gradient(90deg, transparent, rgba(255,230,100,0.95), rgba(255,255,200,1), transparent)",
                boxShadow: "0 0 18px 6px rgba(255,200,50,0.6)",
                top: "40%",
                transform: "skewX(-35deg)",
                animation: "duel-slash 0.55s ease-in forwards",
              }}
            />
          </div>
        )}

        {/* Verdict text overlay */}
        {anim === "slash" && (
          <div
            className="fixed z-40 pointer-events-none font-black"
            style={{
              top: "45%",
              left: "50%",
              fontSize: "2.2rem",
              color: "#c9a84c",
              textShadow: "0 0 30px rgba(201,168,76,0.8)",
              animation: "verdict-pop 0.7s ease-out forwards",
              letterSpacing: "0.1em",
            }}
          >
            ✦ 正解
          </div>
        )}
        {anim === "hit" && (
          <div
            className="fixed z-40 pointer-events-none font-black"
            style={{
              top: "45%",
              left: "50%",
              fontSize: "2.2rem",
              color: "#ef4444",
              textShadow: "0 0 30px rgba(239,68,68,0.8)",
              animation: "verdict-pop 0.7s ease-out forwards",
              letterSpacing: "0.1em",
            }}
          >
            ✕ 不正解
          </div>
        )}

        {/* Status bar */}
        <div
          style={
            anim === "hit"
              ? { animation: "duel-hit 0.45s ease-in-out", background: "#0d0a07", borderBottom: "1px solid #1f1f1f" }
              : { background: "#0d0a07", borderBottom: "1px solid #1f1f1f" }
          }
          className="px-5 pt-4 pb-3"
        >
          <div className="flex justify-between items-center">
            {/* Enemy HP */}
            <div>
              <p className="text-xs font-bold text-red-400 mb-1.5 truncate max-w-[90px]">
                {opponent}
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: maxEnemyHp }).map((_, i) => (
                  <EnemyHeart key={i} active={i < enemyHp} />
                ))}
              </div>
            </div>

            {/* Round counter */}
            <div className="text-center">
              <p className="text-gray-600 uppercase" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
                Round
              </p>
              <p
                className="font-black text-shogun-gold leading-none mt-0.5"
                style={{ fontSize: "1.4rem" }}
              >
                {qIdx + 1}
                <span className="text-gray-600 font-normal" style={{ fontSize: "0.85rem" }}>
                  /{questions.length}
                </span>
              </p>
            </div>

            {/* Player HP */}
            <div className="text-right">
              <p className="text-xs font-bold text-yellow-400 mb-1.5">You</p>
              <div className="flex gap-0.5 flex-row-reverse">
                {Array.from({ length: maxPlayerHp }).map((_, i) => (
                  <PlayerHeart key={i} active={i < playerHp} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question + Options */}
        <div className="px-5 py-5" style={{ background: "#0a0906" }}>
          <div
            className="pt-5 mb-5"
            style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}
          >
            <p
              className="text-white font-semibold text-base leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {q.question}
            </p>
          </div>

          <div className="space-y-2.5">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={anim !== null}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left px-4 py-4 text-gray-300 text-sm min-h-[52px] flex items-start gap-3 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(75,75,65,0.6)",
                }}
                onMouseEnter={(e) => {
                  if (anim === null) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.7)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,168,76,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(75,75,65,0.6)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "";
                }}
              >
                <span
                  className="font-mono shrink-0 mt-0.5 text-shogun-gold"
                  style={{ fontSize: "11px" }}
                >
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
      <div
        className="mt-10 p-10 text-center shadow-2xl"
        style={{
          background: "#0a0906",
          border: "1px solid rgba(127,29,29,0.4)",
        }}
      >
        <style>{DUEL_STYLES}</style>
        <div style={{ animation: "sword-appear 0.5s ease-out forwards" }}>
          <p className="mb-5" style={{ fontSize: "4.5rem", lineHeight: 1 }}>💀</p>
          <p
            className="text-red-500 font-black mb-3 uppercase"
            style={{ fontSize: "2.2rem", letterSpacing: "0.2em" }}
          >
            DEFEATED
          </p>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Your opponent was stronger this time.<br />Return to train harder.
          </p>
          <button
            onClick={startDuel}
            className="text-red-400 px-8 py-3 font-bold uppercase transition-all hover:bg-red-950 active:scale-95 min-h-[44px]"
            style={{
              border: "2px solid #7f1d1d",
              letterSpacing: "0.15em",
            }}
          >
            ⚔ Challenge Again
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT / VICTORY ───────────────────────────────────────────────────
  return (
    <>
      <style>{DUEL_STYLES}</style>

      {showRankUp && result && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.93)" }}
          onClick={() => setShowRankUp(false)}
        >
          {/* Family crest SVG background */}
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5"
            aria-hidden
          >
            <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
              <circle cx="160" cy="160" r="155" stroke="#c9a84c" strokeWidth="2" />
              <circle cx="160" cy="160" r="130" stroke="#c9a84c" strokeWidth="1" />
              <circle cx="160" cy="160" r="105" stroke="#c9a84c" strokeWidth="1.5" />
              <line x1="160" y1="5" x2="160" y2="315" stroke="#c9a84c" strokeWidth="0.5" />
              <line x1="5" y1="160" x2="315" y2="160" stroke="#c9a84c" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="270" y2="270" stroke="#c9a84c" strokeWidth="0.5" />
              <line x1="270" y1="50" x2="50" y2="270" stroke="#c9a84c" strokeWidth="0.5" />
              <polygon points="160,40 180,140 280,140 200,200 225,300 160,240 95,300 120,200 40,140 140,140" stroke="#c9a84c" strokeWidth="1" fill="none" />
            </svg>
          </div>

          <div style={{ animation: "rankup-scale 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <p
              className="text-shogun-gold text-center font-bold mb-5 uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.35em" }}
            >
              位階昇進 · Rank Up
            </p>
            <p
              className="text-shogun-gold text-center font-black"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
                fontFamily: "Georgia, serif",
                animation: "rankup-glow 2s ease-in-out infinite",
              }}
            >
              {result.rankName}
            </p>
            <div className="flex justify-center gap-2 mt-7">
              {Array.from({ length: result.rank + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-shogun-gold"
                  style={{
                    animation: `particle-float 1s ease-out ${i * 0.15}s forwards`,
                  }}
                />
              ))}
            </div>
            <p
              className="text-center mt-10 uppercase"
              style={{
                color: "rgba(201,168,76,0.4)",
                fontSize: "10px",
                letterSpacing: "0.3em",
              }}
            >
              — Tap to continue —
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 overflow-hidden shadow-2xl">
        {/* Victory banner */}
        <div
          className="p-6 text-center"
          style={{
            background: "linear-gradient(to bottom, rgba(201,168,76,0.18) 0%, rgba(10,9,6,0) 100%)",
            borderTop: "1px solid rgba(201,168,76,0.3)",
            borderLeft: "1px solid rgba(201,168,76,0.15)",
            borderRight: "1px solid rgba(201,168,76,0.15)",
            borderBottom: "none",
            backgroundColor: "#0a0906",
          }}
        >
          <div style={{ animation: "sword-appear 0.5s ease-out forwards" }}>
            <p
              className="mb-3"
              style={{
                fontSize: "3.5rem",
                lineHeight: 1,
                animation: "vs-pulse 3s ease-in-out infinite",
              }}
            >
              ⚔️
            </p>
            <p
              className="text-shogun-gold font-black uppercase"
              style={{
                fontSize: "clamp(2rem, 8vw, 3rem)",
                letterSpacing: "0.2em",
                textShadow: "0 0 30px rgba(201,168,76,0.5)",
              }}
            >
              VICTORY
            </p>

            {result && result.bushoEarned > 0 ? (
              <>
                <div className="relative inline-block mt-2">
                  <p
                    className="text-white font-black"
                    style={{
                      fontSize: "1.8rem",
                      animation: "busho-float 1.5s ease-out 0.3s forwards",
                      opacity: 0,
                    }}
                  >
                    +{result.bushoEarned} 武功
                  </p>
                </div>
                <p
                  className="text-sm mt-2"
                  style={{ color: "rgba(201,168,76,0.55)" }}
                >
                  {score === questions.length
                    ? "Flawless. A true samurai scholar."
                    : "Progress recorded. Sharpen your blade."}
                </p>
              </>
            ) : result ? (
              <p className="text-shogun-gold/60 text-base font-bold mt-2">
                Already mastered ⚔
              </p>
            ) : null}

            {!userId && (
              <p className="text-gray-500 text-sm mt-3">
                Sign in to save progress and earn 武功.
              </p>
            )}
          </div>
        </div>

        {/* Rank + Streak */}
        {result && (
          <div
            className="text-white px-5 py-5"
            style={{
              background: "#0d0a07",
              border: "1px solid rgba(201,168,76,0.2)",
              borderTop: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            {(() => {
              const { current, needed } = rankProgress(result.totalBusho, result.rank);
              const pct = Math.min(100, Math.round((current / needed) * 100));
              return (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className="text-gray-500 uppercase"
                      style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                    >
                      位階 · Rank
                    </span>
                    {result.rankUp && (
                      <span
                        className="text-shogun-dark font-bold animate-pulse px-2 py-0.5"
                        style={{
                          background: "linear-gradient(90deg, #d4a832, #c9a84c)",
                          fontSize: "10px",
                          letterSpacing: "0.1em",
                        }}
                      >
                        RANK UP!
                      </span>
                    )}
                  </div>
                  <p
                    className="text-shogun-gold font-black mb-3"
                    style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif" }}
                  >
                    {result.rankName}
                  </p>

                  {/* Progress bar */}
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      height: "12px",
                      border: "1px solid rgba(201,168,76,0.1)",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #8a6520, #c9a84c, #d4a832)",
                        transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s ease-in-out 1.5s infinite",
                      }}
                    />
                  </div>
                  <p
                    className="text-right mt-1"
                    style={{ color: "rgba(120,100,60,1)", fontSize: "11px" }}
                  >
                    {result.totalBusho} 武功
                    {result.rank < 5 && (
                      <> · next rank at {RANK_THRESHOLDS[result.rank + 1]}</>
                    )}
                  </p>

                  {/* Streak */}
                  <div
                    className="mt-4 pt-3 flex items-center gap-3 text-sm"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="font-bold" style={{ color: "#f97316" }}>
                      🔥{" "}
                      {result.currentStreak > 0
                        ? `${result.currentStreak} day${result.currentStreak === 1 ? "" : "s"} of training`
                        : "First day!"}
                    </span>
                    {result.longestStreak > result.currentStreak && (
                      <span className="text-gray-600 text-xs">
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
