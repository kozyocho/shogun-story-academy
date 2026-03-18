"use client";

import { useState } from "react";
import { VocabDojoGame } from "./VocabDojoGame";
import { DuelMode } from "./DuelMode";

type VocabItem = { id: string; term: string; definition: string };
type Question = { id: string; question: string; options: string[]; answer: number };

export function GameSection({
  vocabItems,
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
  const [dojoCompleted, setDojoCompleted] = useState(false);

  return (
    <>
      {vocabItems.length >= 2 && (
        <VocabDojoGame
          items={vocabItems}
          onComplete={() => setDojoCompleted(true)}
        />
      )}

      {questions.length > 0 && (
        <DuelMode
          questions={questions}
          storyId={storyId}
          userId={userId}
          dojoCompleted={dojoCompleted}
          figure={figure}
        />
      )}
    </>
  );
}
