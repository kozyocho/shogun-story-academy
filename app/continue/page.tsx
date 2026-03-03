import Link from 'next/link';

export default function ContinuePage() {
  return (
    <section className="wa-card space-y-3">
      <h1 className="wa-title">Continue Learning</h1>
      <p className="text-sm">前回の進捗から再開できます。デモでは「Market Gate」から再開します。</p>
      <Link href="/chapters/arrival-at-edo/scenes/market-gate" className="wa-link inline-block">
        Resume Scene
      </Link>
    </section>
  );
}
