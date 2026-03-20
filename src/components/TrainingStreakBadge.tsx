interface Props {
  streak: number;
  rankName: string;
}

export function TrainingStreakBadge({ streak, rankName }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap bg-shogun-dark/60 border border-shogun-gold/20 rounded-xl px-4 py-3 mb-8">
      <span className="text-sm font-semibold text-white">
        {streak > 0 ? (
          <>
            <span className="text-orange-400">🔥</span>{" "}
            <span className="text-shogun-gold font-bold">{streak}</span>
            <span className="text-gray-300">{streak === 1 ? " day" : " days"} of training</span>
          </>
        ) : (
          <span className="text-gray-400">⚔️ Begin your training today</span>
        )}
      </span>
      <span className="text-shogun-gold/30">·</span>
      <span className="text-sm text-gray-500 font-garamond">
        Rank:{" "}
        <span className="font-semibold text-gray-300">{rankName}</span>
      </span>
    </div>
  );
}
