'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProgress, type SceneRef } from '@/lib/progress';

export function ContinueExperience() {
  const [lastScene, setLastScene] = useState<SceneRef | null>(null);

  useEffect(() => {
    const progress = getProgress();
    setLastScene(progress.lastScene);
  }, []);

  const resumeHref = lastScene
    ? `/chapters/${lastScene.chapterSlug}/scenes/${lastScene.sceneSlug}`
    : '/chapters/arrival-at-edo/scenes/market-gate';

  return (
    <section className="wa-card space-y-3">
      <h1 className="wa-title">Continue Learning</h1>
      <p className="text-sm">
        {lastScene
          ? `前回の進捗（${lastScene.chapterSlug}/${lastScene.sceneSlug}）から再開できます。`
          : '進捗を読み込み中です。'}
      </p>
      <Link href={resumeHref} className="wa-link inline-block">
        Resume Scene
      </Link>
    </section>
  );
}
