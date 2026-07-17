"use client";

import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/features/journal/components/reveal";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Reveal delay={0.06 * index} key={item.question}>
          <details
            className="group rounded-lg border border-white/10 bg-white/[0.045] backdrop-blur-xl open:bg-white/[0.06]"
            style={
              reducedMotion
                ? undefined
                : { transition: "background-color 240ms ease" }
            }
          >
            <summary className="ds-focus-visible flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-medium text-porcelain [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span
                aria-hidden="true"
                className="ds-transition flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/6 text-sm text-muted-strong group-open:rotate-45 group-open:text-porcelain"
              >
                +
              </span>
            </summary>
            <p className="ds-text-body px-5 pb-5 text-sm">{item.answer}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
