import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Geist_Pixel } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face. ELSH ("element shape") switches the pixel style; see .font-pixel.
const geistPixel = Geist_Pixel({
  variable: "--font-geist-pixel",
  subsets: ["latin"],
  weight: "variable",
  axes: ["ELSH"],
});

export const metadata: Metadata = {
  title: "Steps AI — AI agents for every customer conversation",
  description:
    "Build an AI agent that knows your store, answers on your website, WhatsApp, Instagram, Messenger, Gmail and voice, and hands off to your team the moment a person is needed.",
};

export const viewport: Viewport = {
  themeColor: "#FCFCFC",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${geistPixel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: take over scroll restoration (pins change the page
            height after load), and skip the intro curtain if this load won't open
            on the hero — a #hash link, or a reload/back to a spot past the hero. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{history.scrollRestoration="manual";var h=document.documentElement,y=+sessionStorage.getItem("steps:y")||0,n=performance.getEntriesByType("navigation")[0],r=n&&(n.type==="reload"||n.type==="back_forward");if(location.hash||(r&&y>innerHeight*0.6)){h.classList.add("intro-skip");h.classList.add("restoring")}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
