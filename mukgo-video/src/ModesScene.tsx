import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Background } from "./Background";
import {
  BRAND_GRADIENT,
  C,
  DISPLAY,
  MONO,
  TEXT_GRADIENT,
  ease,
} from "./brand";

const spring = Easing.bezier(0.34, 1.56, 0.64, 1);

const useRise = (delay: number, dist = 26) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { opacity: t, translate: `0px ${(1 - t) * dist}px` };
};

const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: spring,
  });
};

const Check: React.FC<{ delay: number }> = ({ delay }) => {
  const s = usePop(delay);
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "#0A0713",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.cyan,
        fontSize: 24,
        fontWeight: 800,
        scale: String(s),
      }}
    >
      ✓
    </div>
  );
};

const DriveCard: React.FC<{ delay: number }> = ({ delay }) => {
  const s = usePop(delay);
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame / 12), [-1, 1], [0.35, 0.6]);

  return (
    <Interactive.Div
      name="Drive mode card"
      style={{
        scale: String(s),
        width: 560,
        borderRadius: 28,
        padding: "28px 32px",
        background: BRAND_GRADIENT,
        boxShadow: `0 30px 90px rgba(255,53,195,${glow}), 0 0 0 1px rgba(255,255,255,0.25) inset`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 44,
            color: C.ink,
            textShadow: "0 2px 10px rgba(0,0,0,0.25)",
          }}
        >
          <span style={{ fontSize: 44 }}>🚗</span> 운전 모드
        </div>
        <Check delay={delay + 20} />
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: 2,
        }}
      >
        혼자 · 경로 · 맛집
      </div>
      <div
        style={{
          alignSelf: "center",
          marginTop: 6,
          width: 74,
          height: 7,
          borderRadius: 4,
          background: "rgba(10,7,19,0.55)",
        }}
      />
    </Interactive.Div>
  );
};

const MeetupCard: React.FC<{ delay: number }> = ({ delay }) => {
  const s = usePop(delay);
  return (
    <Interactive.Div
      name="Meetup mode card"
      style={{
        scale: String(s),
        width: 560,
        borderRadius: 28,
        padding: "28px 32px",
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 44,
          color: "rgba(255,255,255,0.86)",
        }}
      >
        <span style={{ fontSize: 44 }}>📍</span> 모임 모드
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          color: C.mute,
          letterSpacing: 2,
        }}
      >
        함께 · 목적지 · ETA
      </div>
      <div style={{ height: 13 }} />
    </Interactive.Div>
  );
};

const CtaButtons: React.FC<{ delay: number }> = ({ delay }) => {
  const r = useRise(delay, 24);
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.4, 0.72]);

  return (
    <Interactive.Div
      name="CTA"
      style={{ ...r, display: "flex", gap: 26, alignItems: "center" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "20px 40px",
          borderRadius: 999,
          background: BRAND_GRADIENT,
          boxShadow: `0 18px 60px rgba(52,216,255,${pulse})`,
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 30,
          color: "#0A0713",
        }}
      >
        <span style={{ fontSize: 28 }}>🚗</span> 운전 모드 시작
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "20px 36px",
          borderRadius: 999,
          border: `1px solid ${C.cardBorder}`,
          background: "rgba(255,255,255,0.03)",
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 3,
          color: C.mute,
        }}
      >
        <span style={{ color: C.cyan }}>●</span> LIVE PREVIEW · MEETUP →
      </div>
    </Interactive.Div>
  );
};

export const ModesScene: React.FC = () => {
  const eyebrow = useRise(2, 20);
  const h1 = useRise(6, 28);
  const sub = useRise(14, 24);

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
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}
        >
          <div
            style={{
              ...eyebrow,
              fontFamily: MONO,
              fontSize: 24,
              letterSpacing: 8,
              color: C.green,
              fontWeight: 600,
            }}
          >
            02 · CHOOSE YOUR MODE
          </div>
          <div
            style={{
              ...h1,
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 92,
              color: C.ink,
              textAlign: "center",
            }}
          >
            혼자든,{" "}
            <span
              style={{
                background: TEXT_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              함께든
            </span>
          </div>
          <div
            style={{
              ...sub,
              fontFamily: DISPLAY,
              fontSize: 32,
              color: C.mute,
              fontWeight: 500,
            }}
          >
            한 번의 탭으로 전환하세요
          </div>
        </div>

        <div style={{ display: "flex", gap: 34 }}>
          <DriveCard delay={24} />
          <MeetupCard delay={32} />
        </div>

        <CtaButtons delay={62} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
