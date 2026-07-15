import { interpolate, useCurrentFrame } from "remotion";
import { ease, spring } from "./brand";

/** Fade + upward rise, driven by the local sequence frame. */
export const useRise = (delay: number, dist = 26) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { opacity: t, translate: `0px ${(1 - t) * dist}px` };
};

/** Spring scale pop-in (0 → 1). */
export const usePop = (delay: number, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: spring,
  });
};

/** Eased 0→1 progress over [delay, delay+dur]. */
export const useProgress = (delay: number, dur = 26) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};
