import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Shogun Story Academy — Learn Samurai History Through Story",
  description:
    "Explore Japan's Sengoku period and samurai culture through short, fact-based stories written in clear English. Free to start.",
  openGraph: {
    title: "Shogun Story Academy — Learn Samurai History Through Story",
    description:
      "Explore Japan's Sengoku period and samurai culture through short, fact-based stories written in clear English.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shogun Story Academy",
    description:
      "Learn samurai culture and Japan's Sengoku period through short, fact-based stories in English.",
  },
};

export default async function HomePage() {
  const featuredStories = await prisma.story.findMany({
    where: { isPremium: false },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-shogun-dark text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-shogun-gold mb-4">
          Learn History Through Story
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Explore Japan&apos;s Sengoku period and samurai culture through short,
          fact-based stories written in clear English.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/stories"
            className="bg-shogun-gold text-shogun-dark px-6 py-3 rounded font-semibold hover:bg-yellow-500 transition-colors"
          >
            Read Free Stories
          </Link>
          <Link
            href="/pricing"
            className="border border-shogun-gold text-shogun-gold px-6 py-3 rounded hover:bg-shogun-gold hover:text-shogun-dark transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-shogun-ink mb-8 text-center">
          Free Stories to Get Started
        </h2>

        {featuredStories.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            Stories coming soon. Check back shortly.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredStories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
              >
                <span className="text-xs text-shogun-red uppercase tracking-wider font-semibold">
                  {story.era}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-2 text-shogun-ink">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {story.summary}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Value Props */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: "📜",
              title: "Historically Grounded",
              body: "Every story is based on credible historical facts from Japan's Sengoku period.",
            },
            {
              icon: "📖",
              title: "Reader-Friendly English",
              body: "Clear language with vocabulary notes so anyone can enjoy samurai history.",
            },
            {
              icon: "🎯",
              title: "Learning-First",
              body: "Each story ends with clear historical takeaways and comprehension questions.",
            },
          ].map(({ icon, title, body }) => (
            <div key={title}>
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-lg mb-2 text-shogun-ink">{title}</h3>
              <p className="text-gray-600 text-sm">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
