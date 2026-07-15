import { AbsoluteFill, Interactive } from "remotion";
import { Background } from "./Background";
import { C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { usePop, useRise } from "./anim";
import { COPY, Lang } from "./copy";

const GrimItem: React.FC<{ emoji: string; text: string; delay: number }> = ({
  emoji,
  text,
  delay,
}) => {
  const r = useRise(delay, 20);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 18,
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16,
        padding: "16px 22px",
        width: 640,
      }}
    >
      <span style={{ fontSize: 40, filter: "grayscale(0.4)" }}>{emoji}</span>
      <span
        style={{ fontFamily: DISPLAY, fontSize: 27, color: "rgba(255,255,255,0.8)" }}
      >
        {text}
      </span>
    </div>
  );
};

const Stat: React.FC<{
  value: string;
  caption: string;
  color: string;
  delay: number;
}> = ({ value, caption, color, delay }) => {
  const s = usePop(delay);
  return (
    <Interactive.Div
      name={`Stat ${value}`}
      style={{
        scale: String(s),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: DISPLAY,
          fontSize: 108,
          fontWeight: 800,
          color,
          lineHeight: 1,
          textShadow: `0 0 40px ${color}55`,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: DISPLAY,
          fontSize: 22,
          color: C.mute,
          maxWidth: 260,
          textAlign: "center",
        }}
      >
        {caption}
      </span>
    </Interactive.Div>
  );
};

export const StopScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].stop;
  const eyebrow = useRise(2, 18);
  const h1 = useRise(6, 28);
  const punch = useRise(96, 24);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 120px",
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
            fontSize: 66,
            fontWeight: 800,
            color: C.ink,
            textAlign: "center",
          }}
        >
          {t.h1}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {t.items.map(([emoji, text], i) => (
            <GrimItem key={i} emoji={emoji} text={text} delay={20 + i * 8} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 96, marginTop: 10 }}>
          <Stat
            value={t.stats[0].value}
            caption={t.stats[0].caption}
            color="#FF7A45"
            delay={58}
          />
          <Stat
            value={t.stats[1].value}
            caption={t.stats[1].caption}
            color={C.magenta}
            delay={68}
          />
        </div>

        <div
          style={{
            ...punch,
            fontFamily: DISPLAY,
            fontSize: 42,
            fontWeight: 700,
            textAlign: "center",
            color: C.ink,
          }}
        >
          {t.punchA}
          <span
            style={{
              background: TEXT_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t.punchB}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
