import { AbsoluteFill, Interactive } from "remotion";
import { Background } from "./Background";
import { BRAND_GRADIENT, C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { usePop, useRise } from "./anim";

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

export const MoatScene: React.FC = () => {
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
            02 · THE MOAT
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
            구글맵에도, 옐프에도{" "}
            <span
              style={{
                background: TEXT_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              없는 데이터
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
            <span>GOOGLE MAPS · YELP</span>
            <span style={{ color: C.green }}>MUKGO</span>
          </div>
          <CompareRow
            feature="진행 방향 기준"
            others="전방위"
            mukgo="전방만 (음식·주유)"
            delay={30}
          />
          <CompareRow
            feature="실시간 유가"
            others="제한적"
            mukgo="전방 · 실시간"
            delay={38}
          />
          <CompareRow
            feature="화장실·음식 청결도"
            others="없음"
            mukgo="운전자 평점 (독점)"
            highlight
            delay={46}
          />
          <CompareRow
            feature="다국어"
            others="OS 의존"
            mukgo="5개 언어 내장"
            delay={54}
          />
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
          쓸수록 쌓이고, 쌓일수록 강해진다 — 시간이 만드는 해자
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
