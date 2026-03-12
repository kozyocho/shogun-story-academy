import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stories = await prisma.story.findMany({
    where: { isPremium: false },
    select: { slug: true },
  });
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      vocabulary: true,
      questions: true,
      timelineEvent: true,
    },
  });

  if (!story) notFound();

  if (story.isPremium) {
    if (!session?.user?.id) redirect("/pricing");

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    const isPremium =
      subscription?.status === "ACTIVE" || subscription?.status === "TRIALING";
    if (!isPremium) redirect("/pricing");
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/stories" className="text-sm text-shogun-red hover:underline">
        ← Back to Stories
      </Link>

      <header className="mt-6 mb-8">
        <span className="text-xs text-shogun-red uppercase tracking-wider font-semibold">
          {story.era}
        </span>
        {story.figure && (
          <span className="text-xs text-gray-500 ml-2">— {story.figure}</span>
        )}
        <h1 className="text-3xl font-bold text-shogun-ink mt-2">{story.title}</h1>
        <p className="text-gray-600 mt-2 text-lg">{story.summary}</p>
      </header>

      <div
        className="prose prose-stone max-w-none leading-relaxed text-shogun-ink"
        dangerouslySetInnerHTML={{ __html: story.content }}
      />

      {/* Timeline */}
      {story.timelineEvent && (
        <section className="mt-10 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="font-bold text-shogun-ink mb-1">
            Historical Context — {story.timelineEvent.year}
          </h2>
          <p className="text-sm text-gray-700">{story.timelineEvent.description}</p>
        </section>
      )}

      {/* Vocabulary Notes */}
      {story.vocabulary.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-shogun-ink mb-4">
            Vocabulary &amp; Cultural Notes
          </h2>
          <dl className="space-y-3">
            {story.vocabulary.map((v) => (
              <div key={v.id} className="border-l-4 border-shogun-gold pl-4">
                <dt className="font-semibold text-shogun-ink">
                  {v.term}
                  {v.reading && (
                    <span className="text-gray-500 font-normal ml-2 text-sm">
                      ({v.reading})
                    </span>
                  )}
                </dt>
                <dd className="text-sm text-gray-700">{v.definition}</dd>
                {v.culturalNote && (
                  <dd className="text-xs text-gray-500 mt-0.5 italic">
                    {v.culturalNote}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Comprehension Questions */}
      {story.questions.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-shogun-ink mb-4">
            Comprehension Questions
          </h2>
          <div className="space-y-6">
            {story.questions.map((q, i) => {
              const options = JSON.parse(q.options) as string[];
              return (
                <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-5">
                  <p className="font-semibold text-shogun-ink mb-3">
                    {i + 1}. {q.question}
                  </p>
                  <ul className="space-y-2">
                    {options.map((opt, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 pl-2 border-l-2 border-gray-200"
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
