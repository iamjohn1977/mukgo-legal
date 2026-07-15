import { AbsoluteFill, Interactive } from "remotion";
import { Background } from "./Background";
import { C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { usePop, useRise } from "./anim";

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

export const StopScene: React.FC = () => {
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
          THE STOP
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
          겨우 들른 휴게소.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <GrimItem emoji="🌭" text="언제부터 돌던 건지 모를 핫도그" delay={20} />
          <GrimItem emoji="🥪" text="유리 안에서 말라가는 샌드위치" delay={28} />
          <GrimItem emoji="🚻" text="문을 여는 순간, 발길을 돌린다" delay={36} />
        </div>

        <div style={{ display: "flex", gap: 96, marginTop: 10 }}>
          <Stat
            value="15%"
            caption="주유소 화장실이 '괜찮다'는 응답"
            color="#FF7A45"
            delay={58}
          />
          <Stat
            value="80%"
            caption="더러운 화장실 뒤 다시 오지 않는다"
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
          그런데 이 정보는{" "}
          <span
            style={{
              background: TEXT_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            어떤 지도에도 없었다.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
