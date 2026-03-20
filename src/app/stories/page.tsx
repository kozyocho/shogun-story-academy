import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { TrainingStreakBadge } from "@/components/TrainingStreakBadge";
import { RANK_NAMES } from "@/lib/ranks";

export const metadata: Metadata = {
  title: "Chronicles | Shogun Story Academy",
  description:
    "Browse all samurai and Sengoku period stories. Free starter stories plus a premium library covering key battles, figures, and culture.",
  openGraph: {
    title: "Chronicles | Shogun Story Academy",
    description:
      "Browse all samurai and Sengoku period stories. Free and premium content.",
    url: "/stories",
  },
};

export default async function StoriesPage() {
  const user = await getUser();

  const [subscription, progress, dbUser] = await Promise.all([
    user?.id
      ? prisma.subscription.findUnique({ where: { userId: user.id } })
      : null,
    user?.id
      ? prisma.storyProgress.findMany({
          where: { userId: user.id, completed: true },
          select: { storyId: true },
        })
      : [],
    user?.id
      ? prisma.user.findUnique({
          where: { id: user.id },
          select: { currentStreak: true, rank: true },
        })
      : null,
  ]);

  const completedIds = new Set(progress.map((p) => p.storyId));

  const isPremium =
    subscription?.status === "ACTIVE" ||
    subscription?.status === "TRIALING" ||
    subscription?.status === "LIFETIME";

  const stories = await prisma.story.findMany({
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
  });

  const freeStories = stories.filter((s) => !s.isPremium);
  const premiumStories = stories.filter((s) => s.isPremium);

  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const dailyStory = stories.length > 0 ? stories[dayOfYear % stories.length] : null;
  const dailyCompleted = dailyStory ? completedIds.has(dailyStory.id) : false;
  const dailyLocked = dailyStory ? dailyStory.isPremium && !isPremium : false;

  return (
    <div className="min-h-screen bg-shogun-dark relative">
      {/* Subtle atmospheric kanji watermark */}
      <div
        aria-hidden="true"
        className="fixed inset-0 flex items-center justify-end pr-[5vw] pointer-events-none select-none overflow-hidden"
      >
        <span
          className="text-shogun-gold font-display leading-none"
          style={{ fontSize: "52vw", opacity: 0.018 }}
        >
          記
        </span>
      </div>

      {/* Top gold rule */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-shogun-gold/30 to-transparent"
      />

      <div className="relative max-w-5xl mx-auto px-4 py-10 md:px-6 md:py-14">

        {/* ── Page Header ── */}
        <header className="mb-10">
          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-shogun-red" />
            <span className="text-shogun-red text-[11px] font-bold tracking-[0.35em] uppercase">
              CHRONICLES · 戦記
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight tracking-tight mb-3">
            All Chronicles
          </h1>
          <p className="text-gray-400 font-garamond italic text-lg leading-relaxed max-w-xl">
            Explore Japan&apos;s Sengoku period through fact-based narratives —
            battles, betrayal, and the code of Bushido.
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px w-12 bg-gradient-to-r from-shogun-gold/50 to-transparent" />
            <span className="text-shogun-gold/40 text-sm">⚔</span>
            <div className="h-px w-12 bg-gradient-to-l from-shogun-gold/50 to-transparent" />
          </div>
        </header>

        {/* ── Training Streak Badge ── */}
        {user?.id && (
          <TrainingStreakBadge
            streak={dbUser?.currentStreak ?? 0}
            rankName={RANK_NAMES[dbUser?.rank ?? 0]}
          />
        )}

        {/* ── TODAY'S CHALLENGE ── */}
        {dailyStory && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base">🔥</span>
              <h2 className="text-[11px] font-bold text-shogun-gold uppercase tracking-[0.3em]">
                TODAY&apos;S CHALLENGE · 今日の一話
              </h2>
              {dbUser && dbUser.currentStreak > 0 && (
                <span className="text-[10px] bg-shogun-gold/15 text-shogun-gold font-bold px-2.5 py-0.5 rounded-full border border-shogun-gold/30 tracking-wide">
                  {dbUser.currentStreak} day streak
                </span>
              )}
            </div>

            {dailyLocked ? (
              <div className="relative border border-shogun-gold/30 rounded-xl p-5 bg-black/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-shadow duration-300">
                <div className="absolute top-3 right-3 text-xl opacity-60">🔒</div>
                <span className="text-[10px] text-shogun-red uppercase tracking-[0.25em] font-bold">
                  {dailyStory.era}
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-2 mb-1 pr-8">
                  {dailyStory.title}
                </h3>
                <p className="text-sm text-gray-400 font-garamond line-clamp-2 mb-4">
                  {dailyStory.summary}
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 bg-shogun-gold text-[#0d0b08] font-display font-bold px-5 py-2.5 text-xs tracking-wider uppercase hover:bg-yellow-400 transition-colors duration-200"
                >
                  Unlock with Premium
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ) : dailyCompleted ? (
              <div className="border border-shogun-gold/20 rounded-xl p-5 bg-black/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-shogun-gold/15 border border-shogun-gold/30 flex items-center justify-center shrink-0">
                  <span className="text-shogun-gold text-base">✓</span>
                </div>
                <div>
                  <p className="font-display font-bold text-shogun-gold text-sm tracking-wide">
                    Today&apos;s challenge complete!
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 font-garamond">
                    {dailyStory.title} — Come back tomorrow for a new story.
                  </p>
                </div>
              </div>
            ) : (
              <Link href={`/stories/${dailyStory.slug}`} className="group block">
                <div className="relative border border-shogun-gold/30 rounded-xl overflow-hidden bg-black/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-shogun-gold/60 transition-all duration-300 cursor-pointer">
                  {/* Animated top accent */}
                  <div className="h-[2px] w-0 bg-gradient-to-r from-shogun-red via-shogun-gold to-transparent group-hover:w-full transition-all duration-500" />

                  {dailyStory.imageUrl && (
                    <div className="relative w-full h-44 bg-gray-900">
                      <Image
                        src={dailyStory.imageUrl}
                        alt={dailyStory.title}
                        fill
                        unoptimized
                        sizes="100vw"
                        className="object-cover object-center opacity-70 group-hover:opacity-80 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-5">
                        <span className="text-[10px] text-white/70 uppercase tracking-[0.25em] font-bold">
                          {dailyStory.era}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {!dailyStory.imageUrl && (
                      <span className="text-[10px] text-shogun-red uppercase tracking-[0.25em] font-bold block mb-2">
                        {dailyStory.era}
                      </span>
                    )}
                    <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-shogun-gold transition-colors duration-300">
                      {dailyStory.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-garamond line-clamp-2 mb-4">
                      {dailyStory.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-shogun-gold font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                        Start Today&apos;s Story
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-[10px] text-gray-500 tracking-wide">
                        +50 武功 on completion
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </section>
        )}

        {/* ── Free Stories ── */}
        <section className="mb-14">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-6 bg-shogun-gold/40" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide">
              入門 · Starter Stories
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-shogun-gold/20 to-transparent" />
            <span className="text-[10px] text-shogun-gold/50 uppercase tracking-[0.25em] font-bold shrink-0">
              Free
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {freeStories.length === 0 ? (
              <p className="text-gray-500 font-garamond italic col-span-2">Coming soon.</p>
            ) : (
              freeStories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  locked={false}
                  completed={completedIds.has(story.id)}
                  index={index}
                />
              ))
            )}
          </div>
        </section>

        {/* ── Premium Stories ── */}
        <section>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-6 bg-shogun-gold/40" />
            <h2 className="font-display font-bold text-xl text-white tracking-wide">
              奥義 · Full Library
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-shogun-gold/20 to-transparent" />
            <span className="text-[10px] text-shogun-gold/50 uppercase tracking-[0.25em] font-bold shrink-0">
              Premium
            </span>
          </div>

          {!isPremium && (
            <div className="mb-5 bg-black/40 border border-shogun-gold/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-gray-300 text-sm font-garamond">
                Unlock the full library with a Premium subscription.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-shogun-gold font-bold text-xs tracking-[0.2em] uppercase hover:text-yellow-400 transition-colors duration-200 shrink-0"
              >
                View Plans
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {premiumStories.length === 0 ? (
              <p className="text-gray-500 font-garamond italic col-span-2">Coming soon.</p>
            ) : (
              premiumStories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  locked={!isPremium}
                  completed={completedIds.has(story.id)}
                  index={index}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StoryCard({
  story,
  locked,
  completed,
  index,
}: {
  story: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    era: string;
    figure: string | null;
    imageUrl: string | null;
  };
  locked: boolean;
  completed: boolean;
  index: number;
}) {
  const card = (
    <div
      className={`group relative rounded-lg border overflow-hidden transition-all duration-300 ${
        locked
          ? "bg-gray-900 border-gray-800 opacity-60"
          : completed
          ? "bg-gray-900 border-shogun-gold/30 hover:border-shogun-gold/60 hover:shadow-[0_0_16px_rgba(212,175,55,0.1)] cursor-pointer"
          : "bg-gray-900 border-gray-800 hover:border-shogun-gold/40 hover:shadow-[0_0_16px_rgba(212,175,55,0.1)] cursor-pointer"
      }`}
    >
      {/* Animated top accent line */}
      {!locked && (
        <div className="h-[2px] w-0 bg-gradient-to-r from-shogun-red via-shogun-gold to-transparent group-hover:w-full transition-all duration-500" />
      )}

      {/* Cover image */}
      {story.imageUrl && (
        <div className="relative w-full h-36 sm:h-40 bg-gray-950">
          <Image
            src={story.imageUrl}
            alt={story.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover object-center transition-opacity duration-300 ${
              locked ? "opacity-30" : "opacity-60 group-hover:opacity-75"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
          {locked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-black/60 border border-gray-600 flex items-center justify-center">
                <span className="text-gray-400 text-base">🔒</span>
              </div>
            </div>
          )}
          {/* Index watermark */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 right-3 font-display font-bold text-5xl leading-none select-none text-white/[0.06] group-hover:text-shogun-gold/[0.08] transition-colors duration-300"
          >
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>
      )}

      <div className="p-4 relative">
        {/* Completed badge */}
        {completed && (
          <span className="absolute top-3 right-3 bg-shogun-gold/20 text-shogun-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-shogun-gold/30 tracking-wide">
            ✓ Done
          </span>
        )}

        {/* Era + figure */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] text-shogun-red uppercase tracking-[0.25em] font-bold">
            {story.era}
          </span>
          {story.figure && (
            <span className="text-[10px] text-gray-600">— {story.figure}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-display font-bold text-white mb-2 leading-snug pr-14 group-hover:text-shogun-gold transition-colors duration-300">
          {story.title}
          {locked && !story.imageUrl && (
            <span className="text-gray-600 text-sm ml-2">🔒</span>
          )}
        </h3>

        {/* Summary */}
        <p className="text-sm text-gray-400 font-garamond line-clamp-2 leading-relaxed">
          {story.summary}
        </p>

        {/* Read arrow — only when unlocked */}
        {!locked && (
          <div className="mt-3 flex items-center gap-1.5 text-shogun-gold/60 group-hover:text-shogun-gold transition-colors duration-300">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Read Story</span>
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  if (locked) return card;

  return <Link href={`/stories/${story.slug}`}>{card}</Link>;
}
