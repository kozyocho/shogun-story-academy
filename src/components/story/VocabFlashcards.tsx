"use client";

import { useState } from "react";

type VocabItem = {
  id: string;
  term: string;
  reading: string | null;
  definition: string;
  culturalNote: string | null;
};

export function VocabFlashcards({ items }: { items: VocabItem[] }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const flippedCount = Object.values(flipped).filter(Boolean).length;

  return (
    <div>
      <p className="text-xs text-gray-400 mb-4">
        {flippedCount}/{items.length} revealed — tap each card to see the definition
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((v) => {
          const isFlipped = !!flipped[v.id];
          return (
            <button
              key={v.id}
              onClick={() => setFlipped((f) => ({ ...f, [v.id]: !f[v.id] }))}
              className="relative h-36 text-left focus-visible:outline-2 focus-visible:outline-shogun-gold rounded-xl"
              style={{ perspective: "1000px" }}
              aria-label={isFlipped ? `${v.term}: ${v.definition}` : `Reveal definition for ${v.term}`}
            >
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.45s cubic-bezier(0.4,0.2,0.2,1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-white border-2 border-shogun-gold rounded-xl p-4 flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div>
                    <p className="font-bold text-shogun-ink text-lg leading-tight">{v.term}</p>
                    {v.reading && (
                      <p className="text-sm text-gray-500 mt-1">{v.reading}</p>
                    )}
                  </div>
                  <p className="text-xs text-shogun-gold font-medium">Tap to reveal →</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-amber-50 border-2 border-shogun-gold rounded-xl p-4 flex flex-col justify-between overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-sm text-shogun-ink leading-snug">{v.definition}</p>
                  {v.culturalNote && (
                    <p className="text-xs text-gray-500 italic border-t border-amber-200 pt-2 mt-2">
                      {v.culturalNote}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
