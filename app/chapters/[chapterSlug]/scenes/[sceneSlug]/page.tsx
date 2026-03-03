import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getScene } from '@/lib/utils';

export default function ScenePage({
  params
}: {
  params: { chapterSlug: string; sceneSlug: string };
}) {
  const data = getScene(params.chapterSlug, params.sceneSlug);

  if (!data) {
    notFound();
  }

  const { chapter, scene } = data;

  return (
    <article className="space-y-4">
      <header className="wa-card">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{chapter.title}</p>
        <h1 className="mt-2 text-2xl font-semibold">{scene.title}</h1>
      </header>

      <section className="wa-card space-y-3">
        <h2 className="wa-title">本文</h2>
        {scene.body.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-7">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="wa-card space-y-2">
        <h2 className="wa-title">選択肢</h2>
        <div className="flex flex-col gap-2">
          {scene.choices.map((choice) => (
            <Link
              key={choice.label}
              href={`/chapters/${chapter.slug}/scenes/${choice.nextSceneSlug}`}
              className="wa-link text-center"
            >
              {choice.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="wa-card space-y-2">
        <h2 className="wa-title">History Notes</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {scene.historyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="wa-card space-y-2">
        <h2 className="wa-title">Glossary</h2>
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {scene.glossary.map((item) => (
            <div key={item.term} className="rounded-lg border border-zinc-200/70 p-3 dark:border-zinc-700">
              <dt className="font-semibold">{item.term}</dt>
              <dd className="text-zinc-600 dark:text-zinc-300">{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wa-card space-y-2">
        <h2 className="wa-title">Quiz</h2>
        <p className="text-sm font-medium">{scene.quiz.question}</p>
        <ul className="space-y-2 text-sm">
          {scene.quiz.options.map((option) => (
            <li key={option} className="rounded-lg border border-zinc-200/70 p-2 dark:border-zinc-700">
              {option}
            </li>
          ))}
        </ul>
        <p className="text-xs text-zinc-500">Answer: {scene.quiz.answer}</p>
      </section>
    </article>
  );
}
