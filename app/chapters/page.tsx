import Link from 'next/link';
import { chapters } from '@/data/story';

export default function ChaptersPage() {
  return (
    <section className="space-y-4">
      <h1 className="wa-title">Chapters</h1>
      <ul className="space-y-3">
        {chapters.map((chapter) => (
          <li key={chapter.slug} className="wa-card">
            <h2 className="text-lg font-semibold">{chapter.title}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{chapter.summary}</p>
            <Link href={`/chapters/${chapter.slug}/scenes/market-gate`} className="wa-link mt-3 inline-block">
              最初のシーンへ
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
