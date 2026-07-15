import { Easing } from "remotion";

/**
 * MukGo (먹go) brand tokens — hands-free, on-route food finder.
 * Dark neon aesthetic: cyan → purple → magenta → lime.
 */
export const C = {
  bg0: "#08060F",
  bg1: "#140A20",
  cyan: "#34D8FF",
  purple: "#8B5CF6",
  magenta: "#FF35C3",
  lime: "#C6FF3D",
  green: "#A6FF2E",
  ink: "#FFFFFF",
  mute: "rgba(255,255,255,0.62)",
  card: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.10)",
};

export const BRAND_GRADIENT = `linear-gradient(135deg, ${C.cyan} 0%, ${C.purple} 42%, ${C.magenta} 72%, ${C.lime} 100%)`;

export const TEXT_GRADIENT = `linear-gradient(100deg, ${C.cyan}, ${C.magenta} 55%, ${C.lime})`;

export const DISPLAY =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const MONO =
  "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const spring = Easing.bezier(0.34, 1.56, 0.64, 1);
