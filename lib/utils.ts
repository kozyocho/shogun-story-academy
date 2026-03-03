import { getChapter } from '@/data/story';

export function getScene(chapterSlug: string, sceneSlug: string) {
  const chapter = getChapter(chapterSlug);

  if (!chapter) {
    return null;
  }

  const scene = chapter.scenes[sceneSlug];

  if (!scene) {
    return null;
  }

  return { chapter, scene };
}
