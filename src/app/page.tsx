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
    <div className="bg-[#0d0b08] text-white overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden grain-overlay">
        {/* Atmospheric background kanji 将 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-end pr-[5vw] pointer-events-none select-none overflow-hidden"
        >
          <span
            className="text-shogun-gold font-display leading-none"
            style={{ fontSize: "52vw", opacity: 0.032 }}
          >
            将
          </span>
        </div>

        {/* Right edge crimson veil */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-shogun-red/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-shogun-red/8 to-transparent"
        />

        {/* Top rule */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-shogun-gold/20 to-transparent"
        />

        <div className="relative max-w-5xl mx-auto px-6 py-28 md:py-36 w-full">
          {/* Eyebrow badge */}
          <div
            className="home-fadein flex items-center gap-3 mb-8"
            style={{ animationDelay: "0ms" }}
          >
            <div className="h-px w-10 bg-shogun-red" />
            <span className="text-shogun-red text-[11px] font-bold tracking-[0.35em] uppercase">
              Inspired by Netflix&apos;s Shogun
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="home-fadein font-display font-bold leading-[0.92] tracking-tight mb-8"
            style={{ animationDelay: "120ms" }}
          >
            <span className="block text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              THE REAL
            </span>
            <span className="block text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              HISTORY OF
            </span>
            <span className="block home-gold-shimmer text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              THE SAMURAI
            </span>
          </h1>

          {/* Ornamental divider */}
          <div
            className="home-fadein flex items-center gap-4 mb-8"
            style={{ animationDelay: "240ms" }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-shogun-gold/60 to-transparent" />
            <span className="text-shogun-gold/50 text-base">⚔</span>
            <div className="h-px w-16 bg-gradient-to-l from-shogun-gold/60 to-transparent" />
          </div>

          {/* Subtitle */}
          <p
            className="home-fadein font-garamond italic text-lg md:text-xl text-[#c4b89a] max-w-lg leading-relaxed mb-10"
            style={{ animationDelay: "320ms" }}
          >
            {totalStories} fact-based chronicles of Japan&apos;s Sengoku era —
            battles, betrayal, ninja, and the code of Bushido. Written in clear
            English, with vocabulary notes and comprehension challenges.
          </p>

          {/* CTA Buttons */}
          <div
            className="home-fadein flex flex-col sm:flex-row gap-4"
            style={{ animationDelay: "420ms" }}
          >
            <Link
              href="/stories"
              className="group relative inline-flex items-center justify-center gap-3 bg-shogun-gold text-[#0d0b08] font-display font-bold px-8 py-4 text-sm tracking-wider uppercase overflow-hidden min-h-[52px] transition-all duration-300 hover:bg-yellow-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Reading — Free</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 border border-shogun-gold/40 text-shogun-gold px-8 py-4 text-sm tracking-wider uppercase min-h-[52px] hover:border-shogun-gold hover:bg-shogun-gold/10 transition-all duration-300"
            >
              Full Access →
            </Link>
          </div>

          {/* Quick stats row */}
          <div
            className="home-fadein flex gap-10 mt-14 pt-8 border-t border-white/8"
            style={{ animationDelay: "520ms" }}
          >
            <div>
              <div className="text-3xl font-bold text-shogun-gold font-display leading-none">
                {totalStories}
              </div>
              <div className="text-[10px] text-white/35 tracking-[0.2em] uppercase mt-2">
                Stories
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-shogun-gold font-display leading-none">
                Free
              </div>
              <div className="text-[10px] text-white/35 tracking-[0.2em] uppercase mt-2">
                To Start
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-shogun-gold font-display leading-none">
                5–8
                <span className="text-base font-normal ml-0.5">min</span>
              </div>
              <div className="text-[10px] text-white/35 tracking-[0.2em] uppercase mt-2">
                Per Story
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Stories ── */}
      <section className="pt-6 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-shogun-red text-[11px] font-bold tracking-[0.35em] uppercase mb-3">
                Featured Chronicles
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">
                Stories Worth
                <br />
                Reading
              </h2>
            </div>
            <Link
              href="/stories"
              className="hidden sm:inline-flex items-center gap-2 text-shogun-gold/60 hover:text-shogun-gold text-sm tracking-wider uppercase transition-colors duration-200 shrink-0"
            >
              All {totalStories} Stories
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Story Cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {featuredStories.map((story, index) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group block relative bg-shogun-dark/80 border border-shogun-gold/20 hover:border-shogun-gold/60 hover:shadow-[0_0_24px_rgba(212,175,55,0.15)] transition-all duration-300 overflow-hidden"
              >
                {/* Index watermark */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-4 right-4 font-display font-bold text-[72px] leading-none select-none text-white/[0.04] group-hover:text-shogun-gold/[0.07] transition-colors duration-400"
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Animated top accent */}
                <div className="h-[2px] w-0 bg-gradient-to-r from-shogun-red via-shogun-gold to-transparent group-hover:w-full transition-all duration-500" />

                <div className="relative p-6 pt-5">
                  <span className="text-[10px] text-shogun-red uppercase tracking-[0.25em] font-bold">
                    {story.era}
                  </span>
                  <h3 className="font-display font-bold text-[17px] text-white mt-3 mb-3 leading-snug group-hover:text-shogun-gold transition-colors duration-300">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-6 font-garamond">
                    {story.summary}
                  </p>
                  <div className="flex items-center gap-2 text-shogun-gold text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300">
                    <span>Read Story</span>
                    <svg
                      className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6h8M6 2l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/stories"
              className="text-shogun-gold text-sm font-bold tracking-wider uppercase hover:text-yellow-400 transition-colors"
            >
              Browse All {totalStories} Stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Diamond Divider ── */}
      <div className="relative h-12 flex items-center overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#0d0b08] px-5">
            <div
              aria-hidden="true"
              className="w-2 h-2 rotate-45 border border-white/20"
            />
          </div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent pointer-events-none"
        />

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-shogun-red text-[11px] font-bold tracking-[0.35em] uppercase mb-3">
              Your Path
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
              The Way of the Scholar
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
            {/* Desktop connector line */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-shogun-gold/25 to-transparent"
            />

            {(
              [
                {
                  kanji: "一",
                  en: "01",
                  title: "Read a Story",
                  body: "Short, fact-based chronicles about real samurai, battles, and events. 5–8 minutes each.",
                },
                {
                  kanji: "二",
                  en: "02",
                  title: "Test Your Knowledge",
                  body: "Each story ends with a historical decision challenge and comprehension questions.",
                },
                {
                  kanji: "三",
                  en: "03",
                  title: "Go Deeper",
                  body: "Vocabulary notes and cultural context explain the history behind every story.",
                },
              ] as const
            ).map(({ kanji, en, title, body }) => (
              <div key={en} className="relative text-center group">
                {/* Step circle */}
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border border-shogun-gold/25 group-hover:border-shogun-gold/60 transition-colors duration-400" />
                  <div className="absolute inset-0 rounded-full bg-shogun-gold/5 group-hover:bg-shogun-gold/10 transition-colors duration-400" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-shogun-gold font-bold text-xl leading-none"
                      style={{ fontFamily: "serif" }}
                    >
                      {kanji}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base mb-3 text-white group-hover:text-shogun-gold transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-white/38 text-sm leading-relaxed max-w-[210px] mx-auto font-garamond">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Background crimson wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-shogun-red/6"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-shogun-red/50 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-shogun-red/50 to-transparent"
        />

        {/* Background kanji 侍 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="text-shogun-red font-display font-bold leading-none"
            style={{ fontSize: "40vw", opacity: 0.038 }}
          >
            侍
          </span>
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-shogun-red text-[11px] font-bold tracking-[0.35em] uppercase mb-5">
            Begin Your Journey
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
            Start with Two
            <br />
            <span className="home-gold-shimmer">Free Stories</span>
          </h2>
          <p className="font-garamond italic text-white/45 mb-10 text-xl">
            No account required. No credit card. Just history.
          </p>

          <Link
            href="/stories"
            className="group inline-flex items-center justify-center gap-3 bg-shogun-gold text-[#0d0b08] font-display font-bold px-10 py-5 text-sm tracking-wider uppercase min-h-[56px] hover:bg-yellow-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Read Free Stories
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <p className="mt-6 text-white/25 text-xs tracking-wider uppercase">
            Join thousands learning samurai history
          </p>
        </div>
      </section>
    </div>
  );
}
