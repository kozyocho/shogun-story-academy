"use client";

import { useEffect, useRef } from "react";

export function AnimatedParagraphs({ paragraphs }: { paragraphs: string[] }) {
  const refs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLParagraphElement[];

    // Set initial hidden state
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

  return (
    <div
      id="story-content"
      className="prose prose-stone max-w-none leading-relaxed text-shogun-ink"
    >
      {paragraphs.map((para, i) => (
        <p
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="mb-5 text-base md:text-[17px]"
        >
          {para}
        </p>
      ))}
    </div>
  );
}
