import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { ReadingProgressBar } from "@/components/story/ReadingProgressBar";
import { StoryBody } from "@/components/story/StoryBody";
import { VocabFlashcards } from "@/components/story/VocabFlashcards";
import { GameSection } from "@/components/story/GameSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await prisma.story.findUnique({ where: { slug } });
  if (!story) return {};
  return {
    title: story.title,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary,
      url: `/stories/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.summary,
    },
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const user = await getUser();

  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      vocabulary: true,
      questions: true,
      timelineEvent: true,
      decisions: { orderBy: { afterParagraph: "asc" } },
    },
  });

  if (!story) notFound();

  let isPremiumUser = false;
  if (user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });
    isPremiumUser =
      subscription?.status === "ACTIVE" ||
      subscription?.status === "TRIALING" ||
      subscription?.status === "LIFETIME";
  }

  const isLocked = story.isPremium && !isPremiumUser;

  console.log("[StoryPage] slug:", slug, "| isPremium:", story.isPremium, "| isPremiumUser:", isPremiumUser, "| isLocked:", isLocked);

  const totalStories = await prisma.story.count();

  const paragraphs = story.content
    .split(/\n\n+/)
    .map((p) => p.replace(/<[^>]*>/g, "").trim())
    .filter(Boolean);

  const quizQuestions = story.questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options) as string[],
    answer: q.answer,
  }));

  const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://shogun-story-academy.vercel.app";

  return (
    <>
      <ReadingProgressBar />

      <article className="max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/stories"
          className="inline-flex items-center text-sm text-shogun-red hover:underline min-h-[44px]"
        >
          ← Back to Stories
        </Link>

        {/* Hero image */}
        {story.imageUrl && (
          <div className="relative w-full h-52 md:h-72 rounded-xl overflow-hidden mt-6 bg-gray-100">
            <Image
              src={story.imageUrl}
              alt={story.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <header className={`${story.imageUrl ? "mt-4" : "mt-6"} mb-8`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-shogun-red uppercase tracking-wider font-semibold">
              {story.era}
            </span>
            {story.figure && (
              <span className="text-xs text-gray-500">— {story.figure}</span>
            )}
            {story.isPremium && (
              <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded">
                PREMIUM
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-shogun-ink mt-2">
            {story.title}
          </h1>
          <p className="text-gray-600 mt-2 text-base md:text-lg leading-relaxed">
            {story.summary}
          </p>
        </header>

        {/* Animated story body with interleaved decision points */}
        <StoryBody
          paragraphs={paragraphs}
          decisions={story.decisions}
          isLocked={isLocked}
        />

        {isLocked && (
          <div className="relative z-10 -mt-32">
            <div className="h-32 bg-gradient-to-b from-transparent to-white" />
            <div className="bg-white pt-4 pb-10 text-center px-4">
              <p className="text-2xl mb-2">⚔</p>
              <h2 className="text-xl font-bold text-shogun-ink mb-2">
                Continue Reading with Premium
              </h2>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Unlock all {totalStories} stories including vocabulary notes,
                historical decision challenges, and comprehension quizzes.
              </p>
              <Link
                href="/pricing"
                className="inline-block bg-shogun-gold text-shogun-dark font-bold px-8 py-3 rounded hover:bg-yellow-500 transition-colors"
              >
                View Plans →
              </Link>
              <p className="text-xs text-gray-400 mt-3">
                Monthly · Annual · Lifetime — cancel anytime
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {story.timelineEvent && (
          <section className="mt-10 p-5 bg-yellow-50 border-l-4 border-shogun-gold rounded-r-lg">
            <p className="text-xs font-bold text-shogun-gold uppercase tracking-wider mb-1">
              Historical Context
            </p>
            <p className="font-bold text-shogun-ink">
              {story.timelineEvent.year} — {story.timelineEvent.title}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {story.timelineEvent.description}
            </p>
          </section>
        )}

        {!isLocked && (
          <>
            {/* Vocabulary flashcards */}
            {story.vocabulary.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-shogun-ink mb-1">
                  Vocabulary &amp; Cultural Notes
                </h2>
                <VocabFlashcards items={story.vocabulary} />
              </section>
            )}

            {/* Vocab dojo + duel system */}
            <GameSection
              vocabItems={story.vocabulary.map((v) => ({
                id: v.id,
                term: v.term,
                definition: v.definition,
              }))}
              questions={quizQuestions}
              storyId={story.id}
              userId={user?.id}
              figure={story.figure}
            />

            {/* Continue Your Journey */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm font-semibold text-shogun-ink mb-4">
                Continue Your Journey
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/stories"
                  className="flex-1 text-center border border-shogun-gold text-shogun-gold px-4 py-3 rounded font-semibold hover:bg-shogun-gold hover:text-shogun-dark transition-colors"
                >
                  ← Browse All Stories
                </Link>
                <Link
                  href="/pricing"
                  className="flex-1 text-center bg-shogun-gold text-shogun-dark px-4 py-3 rounded font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Unlock Full Library ⚔
                </Link>
              </div>
            </section>

            {/* Share */}
            <section className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm font-semibold text-shogun-ink mb-3">
                Share this story
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${story.title}" — ${story.summary}`)}&url=${encodeURIComponent(`${APP_URL}/stories/${story.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] hover:bg-gray-800 transition-colors"
                >
                  𝕏 Share on X
                </a>
                <a
                  href={`https://www.reddit.com/submit?url=${encodeURIComponent(`${APP_URL}/stories/${story.slug}`)}&title=${encodeURIComponent(story.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] hover:bg-orange-700 transition-colors"
                >
                  Reddit
                </a>
              </div>
            </section>
          </>
        )}
      </article>
    </>
  );
}
