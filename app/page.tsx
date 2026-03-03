import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-5">
      <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Learn English through Edo stories</p>
      <h1 className="wa-title text-3xl">Shogun Story Academy</h1>
      <p className="wa-card text-sm leading-7">
        和風ミニマルの世界観で、短い英文ストーリーを読みながら語彙・歴史・クイズをまとめて学習。
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/chapters" className="wa-link">
          章を読む
        </Link>
        <Link href="/continue" className="wa-link">
          続きから
        </Link>
      </div>
    </section>
  );
}
