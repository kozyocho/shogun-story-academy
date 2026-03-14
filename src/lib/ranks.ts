export const RANK_THRESHOLDS = [0, 100, 300, 600, 1000, 1500];
export const RANK_NAMES = ["Ashigaru", "Bushi", "Samurai", "Hatamoto", "Daimyo", "Shogun"];

export function calcRank(busho: number): number {
  let rank = 0;
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (busho >= RANK_THRESHOLDS[i]) {
      rank = i;
      break;
    }
  }
  return rank;
}

export const SCROLL_DEFS: Record<string, { name: string; flavor: string }> = {
  FIRST_BLOOD: {
    name: "初陣の巻",
    flavor: "A warrior's path begins with a single step.",
  },
  STREAK_3: {
    name: "三日坊主破りの巻",
    flavor: "Three suns have risen over your training ground.",
  },
  STREAK_7: {
    name: "一週間の鍛錬の巻",
    flavor: "Your blade grows sharper with each passing day.",
  },
  PERFECT_QUIZ: {
    name: "無双の巻",
    flavor: "Not one blow was wasted. A flawless demonstration.",
  },
  ALL_FREE: {
    name: "入門完了の巻",
    flavor: "You have mastered the basics. The deeper path awaits.",
  },
  DOJO_MASTER: {
    name: "道場皆伝の巻",
    flavor: "The words of the ancients now live within you.",
  },
};
