import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Shogun Story Academy — Learn Samurai History Through Story",
  description:
    "Inspired by Netflix's SHOGUN? Explore the real history — samurai, ninja, betrayal, and honor — through short, fact-based stories in English.",
  openGraph: {
    title: "Shogun Story Academy — Learn Samurai History Through Story",
    description:
      "Inspired by Netflix's SHOGUN? Explore the real history — samurai, ninja, betrayal, and honor — through short, fact-based stories in English.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shogun Story Academy",
    description:
      "Inspired by Netflix's SHOGUN? Explore the real history — samurai, ninja, betrayal, and honor — through short, fact-based stories in English.",
  },
};

export default async function HomePage() {
  const featuredStories = await prisma.story.findMany({
    where: {
      slug: {
        in: [
          "yasuke-the-african-samurai",
          "hattori-hanzo-and-the-ninja-of-iga",
          "the-forty-seven-ronin",
        ],
      },
    },
    orderBy: { order: "asc" },
  });

  const totalStories = await prisma.story.count();

  return (
    <div>
      {/* Hero */}
      <section className="bg-shogun-dark py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4">
          <span className="bg-shogun-red/20 text-shogun-red text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1 inline-block mb-4">
            ⚔ Inspired by Netflix&apos;s SHOGUN?
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            The Real History Behind the{" "}
            <span className="text-shogun-gold">Samurai</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mb-8">
            14 fact-based stories covering Japan&apos;s Sengoku period —
            battles, betrayals, ninja, and the code of Bushido. Written in
            clear English, with vocabulary notes and comprehension challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              href="/stories"
              className="bg-shogun-gold text-shogun-dark font-bold px-8 py-4 rounded hover:bg-yellow-500 transition-colors min-h-[44px] flex items-center"
            >
              Start Reading — It&apos;s Free
            </Link>
            <Link
              href="/stories"
              className="text-shogun-gold underline underline-offset-4 hover:text-yellow-400 transition-colors min-h-[44px] flex items-center"
            >
              View All Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-shogun-gold py-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex divide-x divide-shogun-dark/20">
            <div className="flex-1 text-center px-4">
              <div className="text-2xl font-bold text-shogun-dark">
                {totalStories} Stories
              </div>
              <div className="text-xs text-shogun-dark opacity-70">
                and growing
              </div>
            </div>
            <div className="flex-1 text-center px-4">
              <div className="text-2xl font-bold text-shogun-dark">
                Free to Start
              </div>
              <div className="text-xs text-shogun-dark opacity-70">
                no sign-up required
              </div>
            </div>
            <div className="flex-1 text-center px-4">
              <div className="text-2xl font-bold text-shogun-dark">
                Vocab + Quiz
              </div>
              <div className="text-xs text-shogun-dark opacity-70">
                in every story
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-shogun-ink">
            Stories Worth Reading
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            A taste of what&apos;s inside
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {featuredStories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6"
            >
              <span className="text-xs text-shogun-red uppercase tracking-wider font-semibold">
                {story.era}
              </span>
              <h3 className="text-lg font-bold text-shogun-ink mt-2 mb-2">
                {story.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {story.summary}
              </p>
              <span className="text-shogun-gold text-sm font-semibold">
                Read story →
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/stories"
            className="text-shogun-gold font-semibold hover:underline inline-block"
          >
            Browse all {totalStories} stories →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-2xl font-bold text-shogun-ink text-center mb-10">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          {[
            {
              step: "1",
              title: "Read a Story",
              body: "Short, fact-based stories about real samurai, battles, and events. 5–8 minutes each.",
            },
            {
              step: "2",
              title: "Test Your Knowledge",
              body: "Each story ends with a historical decision challenge and comprehension questions.",
            },
            {
              step: "3",
              title: "Go Deeper",
              body: "Vocabulary notes and cultural context explain the history behind every story.",
            },
          ].map(({ step, title, body }) => (
            <div key={step}>
              <div className="w-10 h-10 rounded-full bg-shogun-gold text-shogun-dark font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                {step}
              </div>
              <h3 className="font-bold text-lg mb-2 text-shogun-ink">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-shogun-dark py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-shogun-gold mb-4">
          Start with Two Free Stories
        </h2>
        <p className="text-gray-300 mb-8">
          No account required. Just pick a story and start reading.
        </p>
        <Link
          href="/stories"
          className="bg-shogun-gold text-shogun-dark font-bold px-8 py-4 rounded hover:bg-yellow-500 transition-colors inline-block min-h-[44px]"
        >
          Read Free Stories
        </Link>
      </section>
    </div>
  );
}
