import { AbsoluteFill, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { useProgress, useRise } from "./anim";
import { ease } from "./brand";
import { COPY, Lang } from "./copy";

const CountStat: React.FC<{
  prefix?: string;
  target: number;
  suffix: string;
  caption: string;
  delay: number;
  decimals?: number;
}> = ({ prefix = "", target, suffix, caption, delay, decimals = 0 }) => {
  const r = useRise(delay, 24);
  const p = useProgress(delay + 4, 34);
  const val = (p * target).toFixed(decimals);
  return (
    <Interactive.Div
      name={`Market ${caption}`}
      style={{
        ...r,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: 420,
      }}
    >
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 118,
          fontWeight: 800,
          lineHeight: 1,
          background: TEXT_GRADIENT,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {prefix}
        {val}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 26,
          color: C.mute,
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 1.4,
        }}
      >
        {caption}
      </div>
    </Interactive.Div>
  );
};

const TractionBadge: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return (
    <div
      style={{
        opacity: t,
        translate: `0px ${(1 - t) * 14}px`,
        fontFamily: MONO,
        fontSize: 20,
        color: C.ink,
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 999,
        padding: "10px 22px",
      }}
    >
      <span style={{ color: C.green }}>✓</span> {text}
    </div>
  );
};

export const MarketScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].market;
  const eyebrow = useRise(2, 18);
  const h1 = useRise(6, 26);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: "0 100px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              ...eyebrow,
              fontFamily: MONO,
              fontSize: 24,
              letterSpacing: 10,
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
              fontSize: 58,
              fontWeight: 800,
              color: C.ink,
              textAlign: "center",
            }}
          >
            {t.h1}
          </div>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {t.stats.map((s, i) => (
            <CountStat
              key={s.caption}
              prefix={s.prefix}
              target={s.target}
              suffix={s.suffix}
              caption={s.caption}
              delay={24 + i * 10}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {t.badges.map((b, i) => (
            <TractionBadge key={b} text={b} delay={78 + i * 6} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
