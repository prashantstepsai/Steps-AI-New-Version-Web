import { Eyebrow } from "./eyebrow";
import { Reveal } from "./motion";
import { Kinetic } from "./kinetic";
import ScrambledText from "./react-bits/ScrambledText";

/** Founder's note — the two lines quoted on stepsai.co, verbatim, with links to the full note. */
export function Founder() {
  return (
    <section className="px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl rounded-[36px] bg-surface p-3 shadow-md">
        <div className="grid gap-12 rounded-[26px] bg-surface-2 px-8 py-14 lg:grid-cols-[1fr_2fr] lg:px-14 lg:py-20">
          <Reveal className="flex flex-col justify-between gap-10">
            <Eyebrow>A note from the founder</Eyebrow>
            <div className="flex items-center gap-4">
              <span aria-hidden className="grid size-14 place-items-center rounded-full bg-primary font-pixel text-[1.25rem] text-white">
                RJ
              </span>
              <span>
                <span className="block text-[1.0625rem] font-semibold">Reshmanth Jonnalagadda</span>
                <span className="block text-[0.9375rem] text-fg-muted">Founder & CEO, Steps AI</span>
              </span>
            </div>
          </Reveal>

          <Reveal index={1}>
            <blockquote>
              <ScrambledText
                className="!m-0 !max-w-none font-pixel !text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] leading-[1.15] text-balance"
                fontFamily="var(--font-geist-pixel), var(--font-geist-mono), monospace"
                scrambleChars=".:"
                radius={90}
                duration={1.1}
                speed={0.5}
                clickBurst={false}
              >
                “Most businesses lose the sale the moment a question goes unanswered.”
              </ScrambledText>
              <p className="text-lede mt-6 max-w-[34rem] text-fg-muted">
                “We’re a small team building for the long arc. Try it, and tell us what’s missing.”
              </p>
            </blockquote>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="https://stepsai.co/note/" className="btn btn-primary">
                <Kinetic>Read the full founder’s note</Kinetic>
              </a>
              <a href="https://stepsai.co/contact/" className="btn btn-secondary">
                <Kinetic>Book a call with the founder</Kinetic>
              </a>
              <a
                href="https://www.linkedin.com/in/reshmanth-jonnalagadda/"
                className="px-3 text-[0.9375rem] text-fg-muted underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-fg"
              >
                LinkedIn
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
