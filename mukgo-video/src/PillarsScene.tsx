import { AbsoluteFill, Interactive } from "remotion";
import { Background } from "./Background";
import { BRAND_GRADIENT, C, DISPLAY, MONO } from "./brand";
import { usePop, useRise } from "./anim";
import { COPY, Lang } from "./copy";

const Pillar: React.FC<{
  emoji: string;
  title: string;
  tag: string;
  desc: string;
  delay: number;
}> = ({ emoji, title, tag, desc, delay }) => {
  const s = usePop(delay);
  return (
    <Interactive.Div
      name={`Pillar ${title}`}
      style={{
        scale: String(s),
        width: 440,
        minHeight: 320,
        borderRadius: 26,
        padding: "34px 30px",
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 22,
          background: BRAND_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
        }}
      >
        {emoji}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 36, fontWeight: 800, color: C.ink }}>
          {title}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 18, color: C.green }}>{tag}</span>
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 24,
          lineHeight: 1.5,
          color: C.mute,
        }}
      >
        {desc}
      </div>
    </Interactive.Div>
  );
};

const ValueChip: React.FC<{ label: string; delay: number }> = ({
  label,
  delay,
}) => {
  const s = usePop(delay, 14);
  return (
    <div
      style={{
        scale: String(s),
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 2,
        padding: "12px 30px",
        borderRadius: 999,
        background: BRAND_GRADIENT,
        color: "#0A0713",
      }}
    >
      {label}
    </div>
  );
};

export const PillarsScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].pillars;
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
          gap: 44,
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
              fontSize: 62,
              fontWeight: 800,
              color: C.ink,
              textAlign: "center",
            }}
          >
            {t.h1}
          </div>
        </div>

        <div style={{ display: "flex", gap: 30 }}>
          {t.items.map((it, i) => (
            <Pillar
              key={it.title}
              emoji={it.emoji}
              title={it.title}
              tag={it.tag}
              desc={it.desc}
              delay={24 + i * 8}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {t.values.map((v, i) => (
            <ValueChip key={v} label={v} delay={62 + i * 6} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
