import { AbsoluteFill, Interactive } from "remotion";
import { Background } from "./Background";
import { BRAND_GRADIENT, C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { usePop, useRise } from "./anim";
import { COPY, Lang } from "./copy";

const CompareRow: React.FC<{
  feature: string;
  others: string;
  mukgo: string;
  highlight?: boolean;
  delay: number;
}> = ({ feature, others, mukgo, highlight, delay }) => {
  const r = useRise(delay, 18);
  return (
    <div
      style={{
        ...r,
        display: "grid",
        gridTemplateColumns: "1.3fr 1fr 1fr",
        alignItems: "center",
        gap: 20,
        padding: "18px 26px",
        borderRadius: 16,
        background: highlight ? "rgba(198,255,61,0.06)" : "transparent",
        border: highlight
          ? `1px solid ${C.green}55`
          : "1px solid transparent",
        borderBottom: `1px solid ${C.cardBorder}`,
      }}
    >
      <span style={{ fontFamily: DISPLAY, fontSize: 27, color: C.ink, fontWeight: 600 }}>
        {feature}
      </span>
      <span style={{ fontFamily: MONO, fontSize: 22, color: C.mute }}>
        ✕ {others}
      </span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 22,
          color: highlight ? C.green : C.cyan,
          fontWeight: 600,
        }}
      >
        ✓ {mukgo}
      </span>
    </div>
  );
};

export const MoatScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].moat;
  const eyebrow = useRise(2, 18);
  const h1 = useRise(6, 26);
  const header = useRise(20, 18);
  const compound = usePop(96);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
          padding: "0 140px",
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
              fontSize: 60,
              fontWeight: 800,
              color: C.ink,
              textAlign: "center",
            }}
          >
            {t.h1a}
            <span
              style={{
                background: TEXT_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {t.h1b}
            </span>
          </div>
        </div>

        <div style={{ width: 1200 }}>
          <div
            style={{
              ...header,
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr 1fr",
              gap: 20,
              padding: "0 26px 12px",
              fontFamily: MONO,
              fontSize: 19,
              letterSpacing: 2,
              color: C.mute,
            }}
          >
            <span />
            <span>{t.colOthers}</span>
            <span style={{ color: C.green }}>{t.colMukgo}</span>
          </div>
          {t.rows.map((row, i) => (
            <CompareRow
              key={row.feature}
              feature={row.feature}
              others={row.others}
              mukgo={row.mukgo}
              highlight={row.highlight}
              delay={30 + i * 8}
            />
          ))}
        </div>

        <Interactive.Div
          name="Compound"
          style={{
            scale: String(compound),
            fontFamily: DISPLAY,
            fontSize: 32,
            fontWeight: 700,
            color: "#0A0713",
            background: BRAND_GRADIENT,
            padding: "14px 34px",
            borderRadius: 999,
          }}
        >
          {t.compound}
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
