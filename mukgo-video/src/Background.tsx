import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { C } from "./brand";

/** Dark background with drifting neon glow blobs and a faint grid. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const drift = (offset: number, range: number) =>
    interpolate(Math.sin((frame + offset) / 34), [-1, 1], [-range, range]);

  return (
    <Interactive.Div
      name="Background"
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(120% 120% at 50% 0%, ${C.bg1} 0%, ${C.bg0} 60%)`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: 120,
          top: -260,
          translate: `${drift(0, 30)}px ${drift(20, 24)}px`,
          background: `radial-gradient(circle, ${C.cyan}55 0%, transparent 62%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: 40,
          bottom: -320,
          translate: `${drift(80, 34)}px ${drift(50, 26)}px`,
          background: `radial-gradient(circle, ${C.magenta}4D 0%, transparent 62%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          left: "42%",
          top: "38%",
          translate: `${drift(140, 22)}px ${drift(110, 20)}px`,
          background: `radial-gradient(circle, ${C.purple}55 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "88px 88px",
          maskImage:
            "radial-gradient(circle at 50% 55%, black 20%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 55%, black 20%, transparent 72%)",
        }}
      />
    </Interactive.Div>
  );
};
