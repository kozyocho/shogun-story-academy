interface Props {
  streak: number;
  rankName: string;
}

export function TrainingStreakBadge({ streak, rankName }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap bg-shogun-ink/5 border border-shogun-ink/10 rounded-xl px-4 py-3 mb-6">
      <span className="text-sm font-semibold text-shogun-ink">
        {streak > 0 ? (
          <>
            <span className="text-orange-500">🔥</span>{" "}
            <span className="text-orange-600 font-bold">{streak}</span>
            {streak === 1 ? " day" : " days"} of training
          </>
        ) : (
          <span className="text-gray-500">⚔️ Begin your training today</span>
        )}
      </span>
      <span className="text-gray-300">·</span>
      <span className="text-sm text-gray-500">
        Rank:{" "}
        <span className="font-semibold text-shogun-ink">{rankName}</span>
      </span>
    </div>
  );
}
