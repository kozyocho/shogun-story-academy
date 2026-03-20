import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { SengokuMap } from "@/components/SengokuMap";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Conquest Map — Shogun Story Academy",
  description:
    "Track your progress across Sengoku Japan. Conquer each territory by completing its story.",
};

export default async function MapPage() {
  const user = await getUser();

  const stories = await prisma.story.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      figure: true,
      isPremium: true,
      order: true,
    },
    orderBy: { order: "asc" },
  });

  let completedSlugs: string[] = [];
  let isPremium = false;

  if (user?.id) {
    const [progress, subscription] = await Promise.all([
      prisma.storyProgress.findMany({
        where: { userId: user.id, completed: true },
        select: { storyId: true },
      }),
      prisma.subscription.findUnique({ where: { userId: user.id } }),
    ]);

    const slugById = new Map(stories.map((s) => [s.id, s.slug]));
    completedSlugs = progress
      .map((p) => slugById.get(p.storyId))
      .filter(Boolean) as string[];

    isPremium =
      subscription?.status === "ACTIVE" ||
      subscription?.status === "TRIALING" ||
      subscription?.status === "LIFETIME";
  }

  const conquered = completedSlugs.length;
  const total = stories.length;

  return (
    <main className="min-h-screen bg-shogun-dark max-w-lg mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/stories"
          className="text-sm text-shogun-gold hover:text-yellow-400 transition-colors inline-flex items-center gap-1.5 mb-4 min-h-[44px] font-medium tracking-wide"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Chronicles
        </Link>
        <h1 className="font-display text-2xl font-black text-white">
          ⚔️ Conquest Map
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {conquered > 0
            ? `${conquered} of ${total} territories conquered`
            : "Begin your campaign. Tap a location to enter the story."}
        </p>

        {/* Progress bar */}
        {conquered > 0 && (
          <div className="mt-3 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-shogun-gold h-2 rounded-full transition-all duration-700"
              style={{ width: `${Math.round((conquered / total) * 100)}%` }}
            />
          </div>
        )}
        {conquered > 0 && (
          <p className="text-xs text-gray-300 mt-1.5 text-right">
            {Math.round((conquered / total) * 100)}% complete
          </p>
        )}
      </div>

      {/* Map */}
      <SengokuMap
        stories={stories}
        completedSlugs={completedSlugs}
        isPremium={isPremium}
      />

      {/* Story list */}
      <div className="mt-8 space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-4">
          All Territories
        </h2>
        {stories.map((story) => {
          const done = completedSlugs.includes(story.slug);
          const locked = story.isPremium && !isPremium;
          return (
            <Link
              key={story.slug}
              href={locked ? "/pricing" : `/stories/${story.slug}`}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 min-h-[56px] ${
                done
                  ? "border-shogun-gold/40 bg-shogun-gold/5 hover:bg-shogun-gold/10"
                  : locked
                  ? "border-gray-700 bg-gray-900 opacity-60"
                  : "border-gray-800 bg-gray-900 hover:border-shogun-gold/60 hover:bg-gray-800"
              }`}
            >
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    done
                      ? "text-shogun-gold"
                      : locked
                      ? "text-gray-500"
                      : "text-white"
                  }`}
                >
                  {story.title}
                </p>
                {story.figure && (
                  <p className="text-xs text-gray-400 mt-0.5">{story.figure}</p>
                )}
              </div>
              <span className="shrink-0 ml-3 text-xs font-bold">
                {done ? (
                  <span className="text-shogun-gold">✦</span>
                ) : locked ? (
                  <span className="text-gray-600">🔒</span>
                ) : (
                  <span className="text-gray-500">→</span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
