"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Transition,
} from "motion/react";
import { useRevealed } from "./loader";
import {
  Bubble,
  CHANNEL_ORDER,
  Composer,
  SCREEN_LABEL,
  SCRIPTS,
  ScreenHeader,
  Swap,
  Typing,
  Wallpaper,
  type ChannelId,
  type Message,
} from "./phone-skins";

const TYPING_MS = 1100;
const READ_MS = 1500;
const HOLD_MS = 3400;

// Critically damped (Apple: damping 1). Layout shifts and bubble entrances share it.
const bubbleSpring: Transition = { type: "spring", bounce: 0, duration: 0.5 };

// Apple "response 0.4, damping 1" → stiffness (2π/0.4)², damping 4π/0.4, mass 1
const tiltSpring = { stiffness: 247, damping: 31.4, mass: 1 };
const MAX_TILT = 5;

/**
 * The phone chat card. On its own it alternates WhatsApp → Instagram each
 * loop; pass `channel` (and optionally `script`) to pin it to one skin, and
 * `solid` for an opaque frame when cards stack on top of each other.
 */
export function ChatDemo({
  channel: fixed,
  script: custom,
  solid,
  still,
}: { channel?: ChannelId; script?: Message[]; solid?: boolean; still?: boolean } = {}) {
  // `still` shows the whole conversation without playing it (a card waiting in a stack)
  const reduce = useReducedMotion() || still;
  const revealed = useRevealed();
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [cycle, setCycle] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  // Each loop plays on the next channel: WhatsApp → Instagram → WhatsApp …
  const cycleRef = useRef(0);
  const channel = fixed ?? CHANNEL_ORDER[cycle % CHANNEL_ORDER.length];
  const lines = custom ?? SCRIPTS[channel];

  // ── Scripted playback: pauses offscreen / in background tabs ────────
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce || !revealed) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let step = 0;
    const script = () => custom ?? SCRIPTS[fixed ?? CHANNEL_ORDER[cycleRef.current % CHANNEL_ORDER.length]];

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (visible && !document.hidden) fn();
        else schedule(fn, 400);
      }, ms);
    };

    const next = () => {
      if (step >= script().length) {
        // New cycle key → AnimatePresence fades the old conversation out
        // and the next channel's skin crossfades in
        step = 0;
        setCount(0);
        cycleRef.current += 1;
        setCycle(cycleRef.current);
        schedule(next, 700);
        return;
      }
      const msg = script()[step];
      const show = () => {
        setTyping(false);
        step += 1;
        setCount(step);
        schedule(next, step >= script().length ? HOLD_MS : READ_MS);
      };
      if (msg.from === "agent") {
        setTyping(true);
        schedule(show, TYPING_MS);
      } else {
        show();
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(root);
    schedule(next, 1000);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [reduce, revealed, fixed, custom]);

  // ── Pointer tilt: motion values → springs, no React re-renders ───────
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, tiltSpring);
  const rotateY = useSpring(ry, tiltSpring);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * MAX_TILT * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * MAX_TILT * 2);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const shown = reduce ? lines : lines.slice(0, count);
  const handedOff = shown.length === lines.length;

  return (
    <div
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="mx-auto w-full max-w-[26rem]"
    >
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1400 }}
        className={`rounded-[32px] p-2 shadow-lg ${solid ? "bg-surface" : "bg-white/70 backdrop-blur-xl"}`}
      >
        <div
          className="overflow-hidden rounded-[24px] bg-surface"
          role="img"
          aria-label={SCREEN_LABEL[channel]}
        >
          {/* Header */}
          <Swap id={channel}>
            <ScreenHeader channel={channel} handedOff={handedOff} />
          </Swap>

          {/* Feed, over the channel's wallpaper */}
          <div className="relative">
            <Swap id={channel} className="absolute inset-0">
              <Wallpaper channel={channel} />
            </Swap>
            <div aria-hidden className="chat-feed relative h-[25rem] lg:h-[clamp(14rem,100svh-31rem,25rem)] overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={cycle}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col justify-end gap-2 px-4 pb-4"
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {shown.map((m, i) => (
                      <motion.div
                        key={i}
                        layout="position"
                        initial={{ opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        transition={bubbleSpring}
                        style={{ originX: m.from === "user" ? 1 : 0, originY: 1 }}
                        className={m.from === "user" ? "ml-auto max-w-[80%]" : m.from === "system" ? "mx-auto" : "max-w-[86%]"}
                      >
                        <Bubble channel={channel} message={m} />
                      </motion.div>
                    ))}
                    {typing && (
                      <motion.div
                        key="typing"
                        layout="position"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
                        transition={bubbleSpring}
                        style={{ originX: 0, originY: 1 }}
                        className="w-fit"
                      >
                        <Typing channel={channel} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Composer */}
          <Swap id={channel} className="px-3 pb-3">
            <Composer channel={channel} />
          </Swap>
        </div>
      </motion.div>
    </div>
  );
}

export function StepsMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <rect x="1" y="10" width="4" height="5" rx="1.25" />
      <rect x="6" y="6" width="4" height="9" rx="1.25" />
      <rect x="11" y="1" width="4" height="14" rx="1.25" />
    </svg>
  );
}
