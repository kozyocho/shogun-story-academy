import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Browse all samurai and Sengoku period stories. Free starter stories plus a premium library covering key battles, figures, and culture.",
  openGraph: {
    title: "Stories | Shogun Story Academy",
    description:
      "Browse all samurai and Sengoku period stories. Free and premium content.",
    url: "/stories",
  },
};

export default async function StoriesPage() {
  const user = await getUser();

  const [subscription, progress] = await Promise.all([
    user?.id
      ? prisma.subscription.findUnique({ where: { userId: user.id } })
      : null,
    user?.id
      ? prisma.storyProgress.findMany({
          where: { userId: user.id, completed: true },
          select: { storyId: true },
        })
      : [],
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold text-shogun-ink mb-2">All Stories</h1>
      <p className="text-gray-600 mb-10">
        Explore Japan&apos;s Sengoku period through fact-based narratives.
      </p>

      {/* Free Stories */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-shogun-ink mb-4 flex items-center gap-2">
          <span className="text-green-600 text-sm font-normal bg-green-100 px-2 py-0.5 rounded">
            FREE
          </span>
          Starter Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {freeStories.length === 0 ? (
            <p className="text-gray-500 col-span-2">Coming soon.</p>
          ) : (
            freeStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                locked={false}
                completed={completedIds.has(story.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* Premium Stories */}
      <section>
        <h2 className="text-xl font-semibold text-shogun-ink mb-4 flex items-center gap-2">
          <span className="text-shogun-gold text-sm font-normal bg-yellow-100 px-2 py-0.5 rounded">
            PREMIUM
          </span>
          Full Library
        </h2>
        {!isPremium && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-shogun-ink">
            Premium stories require a subscription.{" "}
            <Link href="/pricing" className="text-shogun-red underline">
              View plans →
            </Link>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          {premiumStories.length === 0 ? (
            <p className="text-gray-500 col-span-2">Coming soon.</p>
          ) : (
            premiumStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                locked={!isPremium}
                completed={completedIds.has(story.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function StoryCard({
  story,
  locked,
  completed,
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
}) {
  const card = (
    <div
      className={`rounded-lg border transition-shadow relative overflow-hidden ${
        locked
          ? "bg-gray-50 border-gray-200 opacity-75"
          : completed
          ? "bg-white border-green-300 hover:shadow-md cursor-pointer"
          : "bg-white border-gray-200 hover:shadow-md cursor-pointer"
      }`}
    >
      {/* Cover image */}
      {story.imageUrl && (
        <div className="relative w-full h-36 sm:h-40 bg-gray-100">
          <Image
            src={story.imageUrl}
            alt={story.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
          {locked && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-white text-2xl">🔒</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {completed && (
          <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
            ✓ Done
          </span>
        )}
        <span className="text-xs text-shogun-red uppercase tracking-wider font-semibold">
          {story.era}
        </span>
        {story.figure && (
          <span className="text-xs text-gray-500 ml-2">— {story.figure}</span>
        )}
        <h3 className="text-base font-bold mt-1 mb-1 text-shogun-ink flex items-center gap-2 pr-14">
          {story.title}
          {locked && !story.imageUrl && (
            <span className="text-gray-400 text-sm">🔒</span>
          )}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">{story.summary}</p>
      </div>
    </div>
  );

  if (locked) return card;

  return <Link href={`/stories/${story.slug}`}>{card}</Link>;
}
