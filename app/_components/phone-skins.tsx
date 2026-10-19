"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

/*
 * Mobile chat skins for the hero demo and the channel cards. Each channel
 * gets its own header, bubbles, typing indicator and composer, drawn to
 * read like the real app on a phone; the playback and motion live in
 * chat-demo.tsx and stay the same for every skin.
 */

export type ChannelId = "whatsapp" | "instagram";

export type Message =
  | { from: "user"; text: string; at: string; card?: "story" }
  | { from: "agent"; text: string; at: string; card?: "product" | "cart" | "tote" | "link" }
  | { from: "system"; text: string };

export const CHANNEL_ORDER: ChannelId[] = ["whatsapp", "instagram"];

// Illustrative conversations, one per channel
export const SCRIPTS: Record<ChannelId, Message[]> = {
  whatsapp: [
    { from: "user", text: "Do you have the Linen Overshirt in medium?", at: "10:12" },
    { from: "agent", text: "Yes — 4 left in Medium. It comes in Sand and Olive.", at: "10:12", card: "product" },
    { from: "user", text: "Sand please. Can it arrive by Friday?", at: "10:13" },
    { from: "agent", text: "Order before 3 pm and Express gets it to you Thursday. I’ve added it to your cart.", at: "10:13", card: "cart" },
    { from: "user", text: "Also — I need to change the address on an older order.", at: "10:14" },
    { from: "system", text: "Maya from Support joined · replies in ~2 min" },
  ],
  instagram: [
    { from: "user", text: "Is this tote still in stock?", at: "18:40", card: "story" },
    { from: "agent", text: "It is — 6 left in Natural canvas.", at: "18:40", card: "tote" },
    { from: "user", text: "Yes please! Any discount on a first order?", at: "18:41" },
    { from: "agent", text: "Here’s 10% off — I’ve applied WELCOME10 to your link.", at: "18:41", card: "link" },
    { from: "user", text: "Also, my last parcel arrived damaged.", at: "18:42" },
    { from: "system", text: "Maya from Support joined · replies in ~2 min" },
  ],
};

export const SCREEN_LABEL: Record<ChannelId, string> = {
  whatsapp:
    "Example WhatsApp conversation: a shopper asks a Steps AI agent about stock and delivery, the agent adds the item to their cart, then hands the chat to a human support teammate.",
  instagram:
    "Example Instagram DM: a shopper replies to a story asking about a tote, the agent shares the product and a discount link, then hands the chat to a human support teammate.",
};

/* ─── Swap: crossfades one skin into the next without a layout shift ── */

export function Swap({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <div className={`grid [&>*]:[grid-area:1/1] ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={id}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-w-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Header ───────────────────────────────────────────────────────── */

export function ScreenHeader({ channel, handedOff }: { channel: ChannelId; handedOff: boolean }) {
  const ig = channel === "instagram";
  return (
    <div className="flex items-center gap-2.5 px-3 pt-4 pb-3" aria-hidden>
      <IconBack className={ig ? "text-fg" : "text-[var(--wa-green)]"} />
      <Avatar ring={ig} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 text-[0.9375rem] leading-tight font-semibold">
          <span className="truncate">{ig ? "northwind.supply" : "Northwind Supply"}</span>
          <Verified className={ig ? "text-[var(--ig-blue)]" : "text-[var(--wa-green)]"} />
        </p>
        <div className="relative h-[1.1rem] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.p
              key={handedOff ? "human" : "ai"}
              initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="truncate text-[0.8125rem] leading-tight text-fg-muted"
            >
              {handedOff ? "Maya · Support team" : ig ? "AI agent · Active now" : "AI agent · online"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className={`flex items-center gap-3.5 pr-1 ${ig ? "text-fg" : "text-[var(--wa-green)]"}`}>
        <IconVideo />
        <IconPhone />
      </div>
    </div>
  );
}

function Avatar({ ring, size = "size-9" }: { ring?: boolean; size?: string }) {
  const mark = (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-primary text-white`}>
      <StepsGlyph className="size-[45%]" />
    </span>
  );
  if (!ring) return mark;
  return (
    <span className="shrink-0 rounded-full bg-[image:var(--ig-ring)] p-[2px]">
      <span className="block rounded-full bg-surface p-[2px]">
        <span className={`grid ${size === "size-9" ? "size-8" : size} place-items-center rounded-full bg-primary text-white`}>
          <StepsGlyph className="size-[45%]" />
        </span>
      </span>
    </span>
  );
}

/* ─── Wallpaper (sits under the feed) ──────────────────────────────── */

export function Wallpaper({ channel }: { channel: ChannelId }) {
  return channel === "whatsapp" ? <div className="wa-wallpaper size-full" /> : <div className="size-full bg-surface" />;
}

/* ─── Bubbles ──────────────────────────────────────────────────────── */

const WA_BUBBLE = "shadow-[0_1px_0.5px_oklch(0_0_0/0.13)] px-2.5 py-1.5 text-[0.9375rem] leading-snug";
const IG_BUBBLE = "rounded-[22px] px-3.5 py-2 text-[0.9375rem] leading-snug";

export function Bubble({ channel, message }: { channel: ChannelId; message: Message }) {
  return channel === "whatsapp" ? <WaBubble message={message} /> : <IgBubble message={message} />;
}

function WaBubble({ message: m }: { message: Message }) {
  if (m.from === "system") {
    return (
      <p className="my-1 rounded-[8px] bg-[var(--wa-notice)] px-3 py-1 text-center text-[0.75rem] font-medium text-fg-muted shadow-[0_1px_0.5px_oklch(0_0_0/0.1)]">
        {m.text}
      </p>
    );
  }

  const user = m.from === "user";
  const text = (
    <div className={`${WA_BUBBLE} flow-root w-fit rounded-[12px] ${user ? "ml-auto rounded-tr-[4px] bg-[var(--wa-out)]" : "rounded-tl-[4px] bg-[var(--wa-in)]"}`}>
      {m.text}
      <WaMeta at={m.at} read={user} />
    </div>
  );
  if (user) return text;

  return (
    <div className="flex flex-col gap-1.5">
      {text}
      {m.card === "product" && (
        <ProductRow
          src="/chat/overshirt.svg"
          name="Linen Overshirt"
          detail="Sand · Olive"
          price="$68"
          className="rounded-[12px] bg-[var(--wa-in)] shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]"
        />
      )}
      {m.card === "cart" && <Confirm className="bg-[var(--wa-in)] shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]">Added to cart · Linen Overshirt, M</Confirm>}
    </div>
  );
}

// Timestamp + read ticks, floated into the last line like WhatsApp does
function WaMeta({ at, read }: { at: string; read: boolean }) {
  return (
    <span className="float-right mt-1.5 ml-2 flex translate-y-1 items-center gap-0.5 text-[0.6875rem] leading-none text-fg-subtle tabular-nums">
      {at}
      {read && (
        <svg viewBox="0 0 18 12" className="h-2.5 w-3.5 text-[var(--wa-tick)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m1.5 6.5 3 3 6-7M7.5 9.5l.5.5 6-7.5" />
        </svg>
      )}
    </span>
  );
}

function IgBubble({ message: m }: { message: Message }) {
  if (m.from === "system") {
    return <p className="my-1 text-center text-[0.75rem] text-fg-subtle">{m.text}</p>;
  }

  if (m.from === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        {m.card === "story" && (
          <>
            <p className="text-[0.75rem] text-fg-subtle">You replied to their story</p>
            <div className="flex items-stretch gap-2">
              <span className="w-[3px] rounded-full bg-line" />
              <Image src="/chat/ig-story.svg" alt="" width={54} height={96} className="h-24 w-[3.375rem] rounded-[12px] outline outline-1 -outline-offset-1 outline-[var(--image-outline)]" />
            </div>
          </>
        )}
        <div className={`${IG_BUBBLE} w-fit bg-[image:var(--ig-out)] text-white`}>{m.text}</div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <Avatar size="size-6" />
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className={`${IG_BUBBLE} w-fit bg-[var(--ig-in)]`}>{m.text}</div>
        {m.card === "tote" && (
          <ProductRow
            src="/chat/tote.svg"
            name="Canvas Market Tote"
            detail="Natural · 6 left"
            price="$42"
            className="rounded-[18px] bg-surface outline outline-1 -outline-offset-1 outline-line"
          />
        )}
        {m.card === "link" && (
          <div className="flex w-fit items-center gap-2 rounded-[18px] bg-[var(--ig-in)] py-2 pr-3 pl-2.5 text-[0.8125rem]">
            <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-[var(--ig-blue)]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M6.5 9.5 9.5 6.5M7 4.5l1-1a2.8 2.8 0 0 1 4 4l-1 1M9 11.5l-1 1a2.8 2.8 0 0 1-4-4l1-1" />
            </svg>
            <span className="min-w-0">
              <span className="block font-medium text-[var(--ig-blue)]">northwind.supply/tote</span>
              <span className="block text-fg-muted">WELCOME10 applied · 10% off</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductRow({ src, name, detail, price, className }: { src: string; name: string; detail: string; price: string; className: string }) {
  return (
    <div className={`flex items-center gap-3 p-2 ${className}`}>
      <Image src={src} alt="" width={48} height={48} className="size-12 shrink-0 rounded-[10px] outline outline-1 -outline-offset-1 outline-[var(--image-outline)]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.875rem] font-semibold">{name}</p>
        <p className="text-[0.8125rem] text-fg-muted">{detail}</p>
      </div>
      <p className="pr-2 text-[0.875rem] font-semibold tabular-nums">{price}</p>
    </div>
  );
}

function Confirm({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div className={`flex w-fit items-center gap-2 rounded-full py-1.5 pr-3 pl-2 text-[0.8125rem] font-medium ${className}`}>
      <span className="grid size-5 place-items-center rounded-full bg-[var(--wa-green)] text-white">
        <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2.5 6.5 2.3 2L9.5 3.5" />
        </svg>
      </span>
      {children}
    </div>
  );
}

/* ─── Typing indicator ─────────────────────────────────────────────── */

export function Typing({ channel }: { channel: ChannelId }) {
  const dots = (
    <>
      <span className="size-1.5 rounded-full bg-fg-muted" />
      <span className="size-1.5 rounded-full bg-fg-muted" />
      <span className="size-1.5 rounded-full bg-fg-muted" />
    </>
  );
  if (channel === "whatsapp") {
    return <div className="typing flex w-fit gap-1 rounded-[12px] rounded-tl-[4px] bg-[var(--wa-in)] px-3.5 py-3 shadow-[0_1px_0.5px_oklch(0_0_0/0.13)]">{dots}</div>;
  }
  return (
    <div className="flex items-end gap-2">
      <Avatar size="size-6" />
      <div className="typing flex w-fit gap-1 rounded-[22px] bg-[var(--ig-in)] px-3.5 py-3">{dots}</div>
    </div>
  );
}

/* ─── Composer ─────────────────────────────────────────────────────── */

export function Composer({ channel }: { channel: ChannelId }) {
  if (channel === "whatsapp") {
    return (
      <div className="flex h-11 items-center gap-2.5 px-1 text-[var(--wa-green)]" aria-hidden>
        <IconPlus />
        <div className="flex h-9 flex-1 items-center rounded-full bg-surface pr-3 pl-4 outline outline-1 -outline-offset-1 outline-line">
          <span className="flex-1 text-[0.9375rem] text-fg-subtle">Message</span>
          <IconSticker className="text-fg-subtle" />
        </div>
        <IconCamera />
        <span className="grid size-8 place-items-center rounded-full bg-[var(--wa-green)] text-white">
          <IconMic />
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-11 items-center gap-2 rounded-full bg-surface pr-3.5 pl-1.5 outline outline-1 -outline-offset-1 outline-line" aria-hidden>
      <span className="grid size-8 place-items-center rounded-full bg-[var(--ig-blue)] text-white">
        <IconCamera />
      </span>
      <span className="flex-1 text-[0.9375rem] text-fg-subtle">Message…</span>
      <span className="flex items-center gap-3 text-fg">
        <IconMic />
        <IconImage />
        <IconSticker />
      </span>
    </div>
  );
}

/* ─── Mini thread for the channel cards ────────────────────────────── */

const MINI: Record<ChannelId, { ask: string; reply: string }> = {
  whatsapp: { ask: "Where’s my order #4821?", reply: "Out for delivery — with you by 6 pm today." },
  instagram: { ask: "Is this tote still in stock?", reply: "It is — 6 left. Sending you the link now." },
};

export function MiniThread({ channel }: { channel: ChannelId }) {
  const { ask, reply } = MINI[channel];
  const wa = channel === "whatsapp";
  const bubble = (from: "user" | "agent", text: string, i: number) => (
    <motion.p
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.5 + i * 0.35 }}
      style={{ originX: from === "user" ? 1 : 0, originY: 1 }}
      className={`w-fit max-w-[88%] px-2.5 py-1.5 text-[0.75rem] leading-snug ${
        wa
          ? `rounded-[10px] shadow-[0_1px_0.5px_oklch(0_0_0/0.13)] ${from === "user" ? "ml-auto rounded-tr-[3px] bg-[var(--wa-out)]" : "rounded-tl-[3px] bg-[var(--wa-in)]"}`
          : `rounded-[16px] ${from === "user" ? "ml-auto bg-[image:var(--ig-out)] text-white" : "bg-[var(--ig-in)]"}`
      }`}
    >
      {text}
    </motion.p>
  );

  return (
    <div aria-hidden className={`relative flex flex-col gap-1.5 overflow-hidden rounded-[12px] p-2.5 outline outline-1 -outline-offset-1 outline-line ${wa ? "wa-wallpaper" : "bg-surface"}`}>
      {bubble("user", ask, 0)}
      {bubble("agent", reply, 1)}
    </div>
  );
}

/* ─── Icons (1.6px stroke, currentColor) ───────────────────────────── */

function Glyph({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-5 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function StepsGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <rect x="1" y="10" width="4" height="5" rx="1.25" />
      <rect x="6" y="6" width="4" height="9" rx="1.25" />
      <rect x="11" y="1" width="4" height="14" rx="1.25" />
    </svg>
  );
}

function Verified({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`size-3.5 shrink-0 ${className}`} aria-hidden>
      <path fill="currentColor" d="m8 .8 1.8 1.3 2.2-.1.7 2.1 1.8 1.3-.7 2.1.7 2.1-1.8 1.3-.7 2.1-2.2-.1L8 15.2l-1.8-1.3-2.2.1-.7-2.1-1.8-1.3.7-2.1-.7-2.1 1.8-1.3.7-2.1 2.2.1Z" />
      <path d="m5.3 8.2 1.8 1.7 3.6-3.8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBack({ className = "" }: { className?: string }) {
  return <Glyph className={className}><path d="M15 5 8 12l7 7" /></Glyph>;
}
function IconVideo() {
  return <Glyph><rect x="3" y="6.5" width="12.5" height="11" rx="2.5" /><path d="m15.5 10.5 5-3v9l-5-3" /></Glyph>;
}
function IconPhone() {
  return <Glyph><path d="M5 4h3.5l1.5 4.5-2.2 1.3a11 11 0 0 0 6.4 6.4l1.3-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" /></Glyph>;
}
function IconPlus() {
  return <Glyph><path d="M12 5v14M5 12h14" /></Glyph>;
}
function IconCamera() {
  return <Glyph className="size-[1.125rem]"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-8Z" /><circle cx="12" cy="12.5" r="3.5" /></Glyph>;
}
function IconMic() {
  return <Glyph className="size-[1.125rem]"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></Glyph>;
}
function IconImage() {
  return <Glyph className="size-[1.125rem]"><rect x="3.5" y="4" width="17" height="16" rx="3" /><circle cx="9" cy="9.5" r="1.5" /><path d="m4 17 5-4.5 4 3.5 2.5-2 4.5 4" /></Glyph>;
}
function IconSticker({ className = "" }: { className?: string }) {
  return <Glyph className={`size-[1.125rem] ${className}`}><path d="M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5c0 5 4 9 9 9Z" /><path d="M8.5 14.5c1 1.2 2.1 1.8 3.5 1.8M9 9.5h.01M14 8.5h.01" /></Glyph>;
}
