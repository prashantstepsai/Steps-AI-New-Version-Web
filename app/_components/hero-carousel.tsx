"use client";

import { useState } from "react";
import DepthCarousel from "./react-bits/DepthCarousel";
import { ChatDemo } from "./chat-demo";
import type { Message } from "./phone-skins";
import "./hero-carousel.css";

// Third card: an order question on WhatsApp, handed to a person at the end
const ORDER: Message[] = [
  { from: "user", text: "hi, where’s my order #4821?", at: "10:41" },
  { from: "agent", text: "It shipped yesterday and it’s out for delivery — with you by 6 pm today.", at: "10:41" },
  { from: "user", text: "can it go to my office instead?", at: "10:42" },
  { from: "agent", text: "It’s already with the courier, so I’ve asked them to redirect it and looped in our team.", at: "10:42" },
  { from: "system", text: "Priya from Support joined · replies in ~2 min" },
];

const CARDS = [
  { channel: "whatsapp", alt: "WhatsApp: a shopper adds an overshirt to their cart" },
  { channel: "instagram", alt: "Instagram: a story reply turns into a discount link" },
  { channel: "whatsapp", script: ORDER, alt: "WhatsApp: an order is tracked and redirected" },
] as const;

/** Hero card stack: the three chat cards recede in depth and take turns at the front. */
export function HeroCarousel() {
  // Only the front card plays, from the top each time it arrives; the ones behind show their full chat
  const [front, setFront] = useState(0);
  // The three conversations go round twice, so two cards always peek out behind the front one
  const items = [...CARDS, ...CARDS].map((c, i) => ({
    alt: c.alt,
    node: <ChatDemo key={`${i}-${front === i}`} channel={c.channel} script={"script" in c ? [...c.script] : undefined} solid still={front !== i} />,
  }));

  return (
    // The carousel scales cards down to fit cardWidth + spread × 2 + 120px (612px); give it that on desktop
    // so cards stay full size, nudged left so the front card sits in the column and the stack peeks out right
    <div className="hero-carousel relative mx-auto h-[34rem] w-full lg:-ml-[3.25rem] lg:w-[38.25rem]">
      <DepthCarousel
        items={items}
        onChange={(i) => setFront(i)}
        cardWidth={352}
        cardHeight={536}
        radius={32}
        tint="#C4ECFC"
        depth={110}
        spread={70}
        tilt={10}
        tiltDirection="right"
        perspective={1600}
        visibleCards={2}
        falloff={0.22}
        blur={4}
        duration={800}
        autoplay
        autoplayDelay={12000}
        showControls={false}
        showIndicators={false}
        wheel={false}
      />
    </div>
  );
}
