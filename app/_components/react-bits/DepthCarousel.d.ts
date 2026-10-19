// Types for the vendored DepthCarousel.jsx (React Bits)
import type { JSX, ReactNode } from "react";

export type DepthCarouselItem = string | { image?: string; alt?: string; node?: ReactNode };

export type DepthCarouselProps = {
  items?: DepthCarouselItem[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tint?: string;
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  duration?: number;
  ease?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  wheel?: boolean;
  onChange?: (index: number, item: DepthCarouselItem) => void;
  className?: string;
};

declare function DepthCarousel(props: DepthCarouselProps): JSX.Element;
export default DepthCarousel;
