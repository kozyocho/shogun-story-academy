"use client";

import { useEffect, useRef } from "react";
import { StoryDecisionCard } from "./StoryDecisionCard";

type Decision = {
  id: string;
  afterParagraph: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correctOption: number;
  historicalNote: string;
  wrongNote: string;
};

export function StoryBody({
  paragraphs,
  decisions,
  isLocked,
}: {
  paragraphs: string[];
  decisions: Decision[];
  isLocked: boolean;
}) {
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLParagraphElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = `opacity 0.5s ease-out ${Math.min(i * 40, 160)}ms, transform 0.5s ease-out ${Math.min(i * 40, 160)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const decisionByParagraph = new Map(decisions.map((d) => [d.afterParagraph, d]));
  const visibleParagraphs = isLocked ? paragraphs.slice(0, 2) : paragraphs;

  return (
    <div
      id="story-content"
      className="prose prose-stone max-w-none leading-relaxed text-shogun-ink"
    >
      {visibleParagraphs.map((para, i) => (
        <div key={i} className="not-prose">
          <p
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="mb-5 text-base md:text-[17px] leading-relaxed text-shogun-ink"
          >
            {para}
          </p>
          {!isLocked && decisionByParagraph.has(i) && (
            <StoryDecisionCard decision={decisionByParagraph.get(i)!} />
          )}
        </div>
      ))}
    </div>
  );
}
