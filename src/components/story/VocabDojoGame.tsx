"use client";

import { useState, useCallback } from "react";

interface VocabItem {
  id: string;
  term: string;
  definition: string;
}

interface Props {
  items: VocabItem[];
  onComplete?: () => void;
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function VocabDojoGame({ items, onComplete }: Props) {
  const capped = items.slice(0, 4); // max 4 pairs
  const [termOrder] = useState(() => shuffle(capped));
  const [defOrder] = useState(() => shuffle(capped));
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null); // "termId-defId"
  const [completed, setCompleted] = useState(false);

  const handleTerm = useCallback(
    (id: string) => {
      if (matched.has(id) || completed) return;
      setSelectedTerm((prev) => (prev === id ? null : id));
      setWrongPair(null);
    },
    [matched, completed]
  );

  const handleDef = useCallback(
    (id: string) => {
      if (matched.has(id) || completed) return;
      setWrongPair(null);

      if (!selectedTerm) {
        setSelectedDef((prev) => (prev === id ? null : id));
        return;
      }

      const termId = selectedTerm;
      if (termId === id) {
        // Correct match
        const next = new Set(matched);
        next.add(id);
        setMatched(next);
        setSelectedTerm(null);
        setSelectedDef(null);
        if (next.size === capped.length) {
          setCompleted(true);
          onComplete?.();
        }
      } else {
        // Wrong match
        setWrongPair(`${termId}-${id}`);
        setSelectedTerm(null);
        setSelectedDef(null);
        setTimeout(() => setWrongPair(null), 600);
      }
    },
    [selectedTerm, matched, completed, capped.length, onComplete]
  );

  if (capped.length < 2) return null;

  return (
    <div className="mt-10">
      <div className="mb-3">
        <p className="text-xs text-shogun-gold uppercase tracking-wider font-semibold mb-0.5">
          単語道場 · Vocab Dojo
        </p>
        <h2 className="text-xl font-bold text-shogun-ink">Word Matching</h2>
        <p className="text-sm text-gray-500 mt-1">
          Your sensei has given you a scroll. Match each term to its meaning.
        </p>
      </div>

      {completed ? (
        <div className="text-center py-8 px-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-3xl mb-2">⚔️</p>
          <p className="font-bold text-shogun-ink text-lg">道場クリア！</p>
          <p className="text-sm text-gray-600 mt-1">
            All terms mastered. +20 武功 awarded.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {/* Terms column */}
          <div className="flex flex-col gap-2">
            {termOrder.map((item) => {
              const isMatched = matched.has(item.id);
              const isSelected = selectedTerm === item.id;
              const isWrong =
                wrongPair?.startsWith(item.id + "-") ?? false;
              return (
                <button
                  key={`term-${item.id}`}
                  onClick={() => handleTerm(item.id)}
                  disabled={isMatched}
                  className={`text-left px-3 py-3 rounded-lg border text-sm font-semibold min-h-[44px] transition-all
                    ${
                      isMatched
                        ? "bg-green-50 border-green-300 text-green-700 opacity-50 cursor-default"
                        : isWrong
                        ? "bg-red-50 border-red-400 text-red-700 scale-95"
                        : isSelected
                        ? "bg-shogun-ink text-white border-shogun-ink scale-[1.02] shadow-md"
                        : "bg-white border-gray-200 text-shogun-ink hover:border-shogun-gold active:scale-95"
                    }`}
                >
                  {isMatched ? "✓ " : ""}{item.term}
                </button>
              );
            })}
          </div>

          {/* Definitions column */}
          <div className="flex flex-col gap-2">
            {defOrder.map((item) => {
              const isMatched = matched.has(item.id);
              const isSelected = selectedDef === item.id;
              const isWrong =
                wrongPair?.endsWith("-" + item.id) ?? false;
              return (
                <button
                  key={`def-${item.id}`}
                  onClick={() => handleDef(item.id)}
                  disabled={isMatched}
                  className={`text-left px-3 py-3 rounded-lg border text-xs min-h-[44px] transition-all leading-snug
                    ${
                      isMatched
                        ? "bg-green-50 border-green-300 text-green-700 opacity-50 cursor-default"
                        : isWrong
                        ? "bg-red-50 border-red-400 text-red-700 scale-95"
                        : isSelected
                        ? "bg-shogun-gold/10 border-shogun-gold text-shogun-ink scale-[1.02] shadow-md"
                        : "bg-white border-gray-200 text-gray-600 hover:border-shogun-gold active:scale-95"
                    }`}
                >
                  {item.definition.length > 80
                    ? item.definition.slice(0, 80) + "…"
                    : item.definition}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!completed && (
        <p className="text-center text-xs text-gray-400 mt-3">
          {matched.size} / {capped.length} matched
        </p>
      )}
    </div>
  );
}
