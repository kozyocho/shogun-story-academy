'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Scene } from '@/data/story';
import {
  getProgress,
  getSceneId,
  markSceneCompleted,
  saveQuizResult,
  updateLastScene
} from '@/lib/progress';

type SceneExperienceProps = {
  chapterSlug: string;
  chapterTitle: string;
  sceneSlug: string;
  scene: Scene;
};

export function SceneExperience({ chapterSlug, chapterTitle, sceneSlug, scene }: SceneExperienceProps) {
  const sceneRef = useMemo(() => ({ chapterSlug, sceneSlug }), [chapterSlug, sceneSlug]);
  const sceneId = getSceneId(sceneRef);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    updateLastScene(sceneRef);

    const progress = getProgress();
    const priorResult = progress.quizResults[sceneId];

    if (priorResult) {
      setSubmittedAnswer(priorResult.selectedAnswer);
      setSelectedAnswer(priorResult.selectedAnswer);
    }

    setIsCompleted(progress.completedSceneIds.includes(sceneId));
  }, [sceneId, sceneRef]);

  const handleSubmitQuiz = () => {
    if (!selectedAnswer) {
      return;
    }

    saveQuizResult(sceneRef, selectedAnswer, scene.quiz.answer);
    setSubmittedAnswer(selectedAnswer);
  };

  const handleComplete = () => {
    markSceneCompleted(sceneRef);
    setIsCompleted(true);
  };

  return (
    <article className="space-y-4">
      <header className="wa-card">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{chapterTitle}</p>
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
              href={`/chapters/${chapterSlug}/scenes/${choice.nextSceneSlug}`}
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

      <section className="wa-card space-y-3">
        <h2 className="wa-title">Quiz</h2>
        <p className="text-sm font-medium">{scene.quiz.question}</p>
        <ul className="space-y-2 text-sm">
          {scene.quiz.options.map((option) => (
            <li key={option}>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200/70 p-2 dark:border-zinc-700">
                <input
                  type="radio"
                  name={`${sceneId}-quiz`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                />
                <span>{option}</span>
              </label>
            </li>
          ))}
        </ul>
        <button type="button" className="wa-link" onClick={handleSubmitQuiz} disabled={!selectedAnswer}>
          回答を保存
        </button>
        {submittedAnswer ? (
          <p className="text-xs text-zinc-500">
            保存済みの回答: {submittedAnswer} ({submittedAnswer === scene.quiz.answer ? '正解' : '不正解'})
          </p>
        ) : null}
      </section>

      <section className="wa-card space-y-2">
        <h2 className="wa-title">進捗</h2>
        <button type="button" className="wa-link" onClick={handleComplete}>
          このシーンを完了にする
        </button>
        {isCompleted ? <p className="text-xs text-zinc-500">このシーンは完了済みです。</p> : null}
      </section>
    </article>
  );
}
