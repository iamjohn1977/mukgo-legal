import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { C, DISPLAY, MONO } from "./brand";
import { useProgress, useRise } from "./anim";
import { COPY, Lang } from "./copy";

const Gauge: React.FC<{
  label: string;
  value: number;
  color: string;
  delay: number;
}> = ({ label, value, color, delay }) => {
  const r = useRise(delay, 22);
  const fill = useProgress(delay + 6, 30) * value;
  return (
    <Interactive.Div
      name={`Gauge ${label}`}
      style={{ ...r, width: 440 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: 4,
            color: C.mute,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 52,
            fontWeight: 800,
            color,
          }}
        >
          {Math.round(fill)}%
        </span>
      </div>
      <div
        style={{
          height: 16,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${fill}%`,
            height: "100%",
            borderRadius: 999,
            background: color,
            boxShadow: `0 0 24px ${color}aa`,
          }}
        />
      </div>
    </Interactive.Div>
  );
};

export const DriveScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].drive;
  const frame = useCurrentFrame();
  const eyebrow = useRise(2, 18);
  const h1 = useRise(8, 30);
  const h2 = useRise(16, 26);
  const kicker = useRise(78, 22);

  // low amber tension glow rising from the bottom
  const tension = interpolate(frame, [0, 60], [0, 0.5], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 120%, rgba(255,140,40,${tension}) 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 120px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...eyebrow,
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: 12,
            color: C.green,
            fontWeight: 600,
          }}
        >
          {t.eyebrow}
        </div>
        <div
          style={{
            ...h1,
            fontFamily: DISPLAY,
            fontSize: 96,
            fontWeight: 800,
            color: C.ink,
            lineHeight: 1.05,
          }}
        >
          {t.h1[0]}
          <br />
          {t.h1[1]}
        </div>
        <div style={{ ...h2, display: "flex", gap: 48 }}>
          <Gauge label={t.fuel} value={8} color="#FF7A45" delay={30} />
          <Gauge label={t.hunger} value={100} color={C.cyan} delay={40} />
        </div>
        <div
          style={{
            ...kicker,
            fontFamily: DISPLAY,
            fontSize: 40,
            fontWeight: 600,
            color: C.mute,
          }}
        >
          {t.kicker}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
