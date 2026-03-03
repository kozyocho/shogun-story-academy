const STORAGE_KEY = 'sengoku_progress';

const DEFAULT_LAST_SCENE = {
  chapterSlug: 'arrival-at-edo',
  sceneSlug: 'market-gate'
} as const;

export type SceneRef = {
  chapterSlug: string;
  sceneSlug: string;
};

export type QuizResult = {
  selectedAnswer: string;
  isCorrect: boolean;
};

export type SengokuProgress = {
  lastScene: SceneRef;
  completedSceneIds: string[];
  quizResults: Record<string, QuizResult>;
};

const defaultProgress: SengokuProgress = {
  lastScene: DEFAULT_LAST_SCENE,
  completedSceneIds: [],
  quizResults: {}
};

function canUseStorage() {
  return typeof window !== 'undefined';
}

function isSceneRef(value: unknown): value is SceneRef {
  return (
    !!value &&
    typeof value === 'object' &&
    'chapterSlug' in value &&
    'sceneSlug' in value &&
    typeof value.chapterSlug === 'string' &&
    typeof value.sceneSlug === 'string'
  );
}

function normalizeQuizResults(raw: unknown): Record<string, QuizResult> {
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  return Object.entries(raw).reduce<Record<string, QuizResult>>((acc, [sceneId, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      'selectedAnswer' in value &&
      'isCorrect' in value &&
      typeof value.selectedAnswer === 'string' &&
      typeof value.isCorrect === 'boolean'
    ) {
      acc[sceneId] = {
        selectedAnswer: value.selectedAnswer,
        isCorrect: value.isCorrect
      };
    }

    return acc;
  }, {});
}

function normalizeProgress(raw: unknown): SengokuProgress {
  if (!raw || typeof raw !== 'object') {
    return defaultProgress;
  }

  const data = raw as Partial<SengokuProgress>;

  const lastScene = isSceneRef(data.lastScene) ? data.lastScene : defaultProgress.lastScene;

  const completedSceneIds = Array.isArray(data.completedSceneIds)
    ? data.completedSceneIds.filter((id): id is string => typeof id === 'string')
    : [];

  return {
    lastScene,
    completedSceneIds,
    quizResults: normalizeQuizResults(data.quizResults)
  };
}

export function getSceneId({ chapterSlug, sceneSlug }: SceneRef) {
  return `${chapterSlug}/${sceneSlug}`;
}

export function getProgress(): SengokuProgress {
  if (!canUseStorage()) {
    return defaultProgress;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultProgress;
    }

    return normalizeProgress(JSON.parse(saved));
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: SengokuProgress) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
}

export function updateLastScene(lastScene: SceneRef) {
  const current = getProgress();
  saveProgress({ ...current, lastScene });
}

export function markSceneCompleted(sceneRef: SceneRef) {
  const current = getProgress();
  const sceneId = getSceneId(sceneRef);

  if (current.completedSceneIds.includes(sceneId)) {
    return;
  }

  saveProgress({
    ...current,
    completedSceneIds: [...current.completedSceneIds, sceneId]
  });
}

export function saveQuizResult(sceneRef: SceneRef, selectedAnswer: string, correctAnswer: string) {
  const current = getProgress();
  const sceneId = getSceneId(sceneRef);

  saveProgress({
    ...current,
    quizResults: {
      ...current.quizResults,
      [sceneId]: {
        selectedAnswer,
        isCorrect: selectedAnswer === correctAnswer
      }
    }
  });
}
