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

      <article className="bg-shogun-dark min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Back link */}
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-shogun-gold hover:text-yellow-400 transition-colors duration-200 min-h-[44px] font-medium tracking-wide"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Chronicles
          </Link>

          {/* Hero image */}
          {story.imageUrl && (
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mt-6 bg-gray-900">
              <Image
                src={story.imageUrl}
                alt={story.title}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover object-center opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-shogun-dark via-black/30 to-transparent" />

              {/* Era label overlaid on image */}
              <div className="absolute bottom-4 left-5">
                <span className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-bold">
                  {story.era}
                </span>
              </div>
            </div>
          )}

          {/* Story header */}
          <header className={`${story.imageUrl ? "mt-5" : "mt-6"} mb-8`}>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {!story.imageUrl && (
                <span className="text-[10px] text-shogun-red uppercase tracking-[0.3em] font-bold">
                  {story.era}
                </span>
              )}
              {story.figure && (
                <span className="text-xs text-gray-500 font-garamond">— {story.figure}</span>
              )}
              {story.isPremium && (
                <span className="text-[10px] bg-shogun-gold/20 text-shogun-gold font-bold px-2 py-0.5 rounded-full border border-shogun-gold/30 tracking-wider uppercase">
                  Premium
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mt-1 mb-3">
              {story.title}
            </h1>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-shogun-gold/30" />
              <span className="text-shogun-gold/30 text-xs">⚔</span>
            </div>

            <p className="text-gray-300 font-garamond text-base md:text-lg leading-relaxed">
              {story.summary}
            </p>
          </header>

          {/* Story body */}
          <div className="text-gray-200 leading-relaxed">
            <StoryBody
              paragraphs={paragraphs}
              decisions={story.decisions}
              isLocked={isLocked}
            />
          </div>

          {/* Soft paywall overlay */}
          {isLocked && (
            <div className="relative z-10 -mt-32">
              <div className="h-32 bg-gradient-to-b from-transparent to-shogun-dark" />
              <div className="bg-shogun-dark pt-4 pb-10 text-center px-4">
                <div className="bg-shogun-dark border border-shogun-gold/30 rounded-xl p-8 max-w-sm mx-auto">
                  <p className="text-3xl mb-3">⚔</p>
                  <h2 className="font-display font-bold text-xl text-white mb-2">
                    Continue Reading with Premium
                  </h2>
                  <p className="text-gray-400 font-garamond text-sm mb-6 leading-relaxed">
                    Unlock all {totalStories} stories including vocabulary notes,
                    historical decision challenges, and comprehension quizzes.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 bg-shogun-gold text-shogun-dark font-display font-bold px-8 py-3 rounded hover:bg-yellow-400 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] tracking-wider text-sm"
                  >
                    View Plans
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <p className="text-xs text-gray-600 mt-4 font-garamond">
                    Monthly · Annual · Lifetime — cancel anytime
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Historical Context */}
          {story.timelineEvent && (
            <section className="mt-10 bg-black/40 border-l-4 border-shogun-gold rounded-r-lg p-5">
              <p className="text-[10px] font-bold text-shogun-gold uppercase tracking-[0.3em] mb-2">
                Historical Context
              </p>
              <p className="font-display font-bold text-white text-sm">
                {story.timelineEvent.year} — {story.timelineEvent.title}
              </p>
              <p className="text-gray-300 font-garamond text-sm mt-1.5 leading-relaxed">
                {story.timelineEvent.description}
              </p>
            </section>
          )}

          {!isLocked && (
            <>
              {/* Vocabulary flashcards */}
              {story.vocabulary.length > 0 && (
                <section className="mt-10">
                  <h2 className="font-display font-bold text-xl text-white mb-4">
                    Vocabulary &amp; Cultural Notes
                  </h2>
                  <VocabFlashcards items={story.vocabulary} />
                </section>
              )}

              {/* Game section */}
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
              <section className="mt-12 pt-8 border-t border-shogun-gold/20">
                <p className="text-xs font-bold text-shogun-gold uppercase tracking-[0.25em] mb-4">
                  Continue Your Journey
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/stories"
                    className="flex-1 text-center border border-shogun-gold text-shogun-gold px-4 py-3 rounded font-bold text-sm tracking-wider hover:bg-shogun-gold hover:text-shogun-dark transition-all duration-200 min-h-[44px] flex items-center justify-center"
                  >
                    ← Browse All Chronicles
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex-1 text-center bg-shogun-gold text-shogun-dark px-4 py-3 rounded font-bold text-sm tracking-wider hover:bg-yellow-400 transition-all duration-200 min-h-[44px] flex items-center justify-center"
                  >
                    Unlock Full Library ⚔
                  </Link>
                </div>
              </section>

              {/* Share */}
              <section className="mt-10 pt-8 border-t border-gray-800">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-4">
                  Share this story
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${story.title}" — ${story.summary}`)}&url=${encodeURIComponent(`${APP_URL}/stories/${story.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black border border-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] hover:border-gray-500 transition-colors"
                  >
                    𝕏 Share on X
                  </a>
                  <a
                    href={`https://www.reddit.com/submit?url=${encodeURIComponent(`${APP_URL}/stories/${story.slug}`)}&title=${encodeURIComponent(story.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-600/40 text-orange-400 px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] hover:bg-orange-600/30 transition-colors"
                  >
                    Reddit
                  </a>
                </div>
              </section>
            </>
          )}
        </div>
      </article>
    </>
  );
}
