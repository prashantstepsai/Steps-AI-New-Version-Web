"use client";

import dynamic from "next/dynamic";
import { Reveal } from "./motion";

// The swapped word sits on an ice-blue block; text stays Deep Navy
const WORD = "rounded-[0.12em] bg-ice px-[0.2em] text-navy";

// Client-only: RotatingText shuffles stagger order with Math.random(), which prerendering rejects
const RotatingText = dynamic(() => import("./react-bits/RotatingText"), {
  ssr: false,
  loading: () => <span className={WORD}>conversation</span>,
});

/**
 * "Every conversation, handled." — the line blurs in after the intro, then
 * "conversation" rotates through the things the agent actually handles.
 */
export function HeroHeadline({ className = "" }: { className?: string }) {
  return (
    <h1 className={className}>
      <span className="sr-only">Every conversation, handled.</span>
      {/* One line each, so a longer or shorter word never reflows the hero */}
      <span aria-hidden className="flex flex-col items-start">
        <Reveal immediate index={1} className="block">Every</Reveal>
        <Reveal immediate index={2} className="flex items-baseline">
          <RotatingText
            texts={["conversation", "question", "order", "booking", "lead"]}
            effect="slide"
            direction="up"
            highlight
            highlightColor="#C4ECFC"
            staggerFrom="last"
            staggerDuration={0.018}
            rotationInterval={2600}
            mainClassName="!text-navy !rounded-[0.12em] !px-[0.2em] !py-0"
            splitLevelClassName="overflow-hidden pb-[0.06em]"
          />
          ,
        </Reveal>
        <Reveal immediate index={3} className="block">handled.</Reveal>
      </span>
    </h1>
  );
}
