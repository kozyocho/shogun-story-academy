"use client";

import { DuelMode } from "./DuelMode";

type VocabItem = { id: string; term: string; definition: string };
type Question = { id: string; question: string; options: string[]; answer: number };

export function GameSection({
  questions,
  storyId,
  userId,
  figure,
}: {
  vocabItems: VocabItem[];
  questions: Question[];
  storyId: string;
  userId?: string;
  figure?: string | null;
}) {
  return (
    <>
      {questions.length > 0 && (
        <DuelMode
          questions={questions}
          storyId={storyId}
          userId={userId}
          dojoCompleted={false}
          figure={figure}
        />
      )}
    </>
  );
}
