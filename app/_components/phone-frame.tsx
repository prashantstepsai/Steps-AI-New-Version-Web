import type { ReactNode } from "react";

/**
 * A modern iPhone shell: ink bezel, Dynamic Island, status bar and home
 * indicator. The screen is a flex column, so callers stack header → feed →
 * composer inside it and give the feed `flex-1`.
 */
export function PhoneFrame({
  children,
  className = "",
  screenClassName = "bg-surface",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  /** Light status-bar glyphs, for screens with a dark top. */
  dark?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[46px] bg-[oklch(0.2_0.03_262)] p-[9px] shadow-[0_0_0_1px_oklch(0.2_0.03_262/0.4),inset_0_0_0_1.5px_oklch(0.42_0.03_262),0_40px_80px_-30px_oklch(0.34_0.119_260/0.4)] ${className}`}
    >
      {/* Side buttons */}
      <span aria-hidden className="absolute top-[22%] -left-[3px] h-14 w-[3px] rounded-l-sm bg-[oklch(0.3_0.03_262)]" />
      <span aria-hidden className="absolute top-[34%] -left-[3px] h-14 w-[3px] rounded-l-sm bg-[oklch(0.3_0.03_262)]" />
      <span aria-hidden className="absolute top-[28%] -right-[3px] h-20 w-[3px] rounded-r-sm bg-[oklch(0.3_0.03_262)]" />

      <div className={`relative flex h-full flex-col overflow-hidden rounded-[38px] ${screenClassName}`}>
        <div aria-hidden className={`relative z-10 flex h-11 shrink-0 items-center justify-between px-6 text-[0.75rem] font-semibold tabular-nums ${dark ? "text-white" : "text-fg"}`}>
          <span>9:41</span>
          <span className="absolute top-2.5 left-1/2 h-[22px] w-[70px] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-[3px]">
            <svg viewBox="0 0 18 12" className="h-2.5 w-4" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
              <rect x="10" y="3" width="3" height="9" rx="1" />
              <rect x="15" y="0" width="3" height="12" rx="1" />
            </svg>
            <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="currentColor">
              <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .4C5.2.4 2.7 1.5.8 3.3L2 4.6a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.5c-.6 0-1.1.2-1.5.6L8 11.6l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z" />
            </svg>
            <svg viewBox="0 0 26 12" className="h-2.5 w-[1.4rem]" fill="none">
              <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke="currentColor" opacity="0.4" />
              <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
              <path d="M24 4v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity="0.45" />
            </svg>
          </span>
        </div>

        {children}

        <span aria-hidden className={`absolute bottom-2 left-1/2 h-[5px] w-28 -translate-x-1/2 rounded-full ${dark ? "bg-white/80" : "bg-fg/85"}`} />
      </div>
    </div>
  );
}
