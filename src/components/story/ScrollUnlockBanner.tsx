"use client";

import { useState, useEffect } from "react";

interface ScrollItem {
  type: string;
  name: string;
  flavor: string;
}

interface Props {
  scrolls: ScrollItem[];
}

const SCROLL_ICONS: Record<string, string> = {
  FIRST_BLOOD: "⚔️",
  STREAK_3: "🔥",
  STREAK_7: "🏯",
  PERFECT_QUIZ: "🎯",
  ALL_FREE: "📜",
  DOJO_MASTER: "🗡️",
};

export function ScrollUnlockBanner({ scrolls }: Props) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(scrolls.length > 0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (scrolls.length === 0) return;
    setVisible(true);
    setAnimating(true);
  }, [scrolls]);

  if (!visible || scrolls.length === 0) return null;

  const scroll = scrolls[current];

  const handleNext = () => {
    setAnimating(false);
    setTimeout(() => {
      if (current + 1 < scrolls.length) {
        setCurrent((c) => c + 1);
        setAnimating(true);
      } else {
        setVisible(false);
      }
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={handleNext}
    >
      <div
        className={`w-full max-w-sm bg-shogun-ink text-white rounded-2xl p-6 text-center shadow-2xl transition-all duration-300 ${
          animating ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-shogun-gold uppercase tracking-widest mb-3 font-semibold">
          New Scroll Earned
        </p>
        <div className="text-5xl mb-3">{SCROLL_ICONS[scroll.type] ?? "📜"}</div>
        <p className="text-xl font-bold mb-1">{scroll.name}</p>
        <p className="text-sm text-gray-300 italic mb-5">&ldquo;{scroll.flavor}&rdquo;</p>
        <button
          onClick={handleNext}
          className="w-full bg-shogun-gold text-white font-bold py-3 rounded-xl text-sm min-h-[44px] active:scale-95 transition-transform"
        >
          {current + 1 < scrolls.length ? "Next →" : "Continue"}
        </button>
        {scrolls.length > 1 && (
          <p className="text-xs text-gray-500 mt-2">
            {current + 1} / {scrolls.length}
          </p>
        )}
      </div>
    </div>
  );
}
