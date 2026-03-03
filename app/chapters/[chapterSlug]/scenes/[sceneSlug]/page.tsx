import { notFound } from 'next/navigation';
import { SceneExperience } from '@/components/SceneExperience';
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
    <SceneExperience
      chapterSlug={chapter.slug}
      chapterTitle={chapter.title}
      sceneSlug={params.sceneSlug}
      scene={scene}
    />
  );
}
