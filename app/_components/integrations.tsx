"use client";

import Image from "next/image";
import LogoLoop from "./react-bits/LogoLoop";

// Official marks only (brand files in /public/ref); each sits beside its name,
// except wordmarks, which already spell it
const STACK: { name: string; src: string; wordmark?: boolean }[] = [
  { name: "Shopify", src: "/ref/integrations/shopify.svg" },
  { name: "WhatsApp", src: "/ref/brands/whatsapp.png" },
  { name: "Instagram", src: "/ref/brands/instagram-icon.png" },
  { name: "HubSpot", src: "/ref/integrations/hubspot.svg" },
  { name: "Zendesk", src: "/ref/integrations/zendesk.svg" },
  { name: "Slack", src: "/ref/integrations/slack.svg" },
  { name: "WooCommerce", src: "/ref/integrations/woocommerce-wordmark.svg", wordmark: true },
  { name: "Notion", src: "/ref/integrations/notion.svg" },
  { name: "Google Drive", src: "/ref/integrations/google-drive.svg" },
  { name: "Calendly", src: "/ref/integrations/calendly.svg" },
  { name: "Google Calendar", src: "/ref/integrations/google-calendar.svg" },
  { name: "Messenger", src: "/ref/brands/messenger.png" },
];

/** "Integrates with your stack" — a slow marquee of the tools' own logos. */
export function Integrations() {
  return (
    <section aria-label="Integrations" className="py-10">
      <p className="text-center font-mono text-[0.75rem] tracking-[0.14em] text-fg-subtle uppercase">
        Integrates with your stack
      </p>
      <div className="mt-8">
        <LogoLoop
          logos={STACK.map(({ name, src, wordmark }) => ({
            title: name,
            node: wordmark ? (
              <Image src={src} alt={name} width={132} height={28} className="h-7 w-auto" />
            ) : (
              <span className="flex items-center gap-2.5 text-[1.125rem] font-medium tracking-[-0.01em] whitespace-nowrap text-fg/75">
                <Image src={src} alt="" width={28} height={28} className="size-7 object-contain" />
                {name}
              </span>
            ),
          }))}
          speed={42}
          gap={56}
          logoHeight={32}
          pauseOnHover
          fadeOut
          fadeOutColor="#FCFCFC"
          ariaLabel="Integrations"
        />
      </div>
    </section>
  );
}
