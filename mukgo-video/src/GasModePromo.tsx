import {
  AbsoluteFill,
  Composition,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./Background";
import { BRAND_GRADIENT, C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { usePop, useProgress, useRise } from "./anim";

const CHARGE_GREEN = "#3DDC84";
const TOTAL_STEPS = 8;

/* ── Reusable phone shell ─────────────────────────────────────── */

const PhoneShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: enter,
        width: 600,
        height: 1120,
        borderRadius: 62,
        padding: 6,
        background: `linear-gradient(150deg, ${C.cyan}, ${C.purple} 45%, ${C.magenta})`,
        boxShadow: `0 40px 120px rgba(255,53,195,0.28)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 56,
          background: "#0A0713",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 34px",
            height: 54,
            alignItems: "center",
            fontFamily: MONO,
            fontSize: 22,
            color: C.ink,
            fontWeight: 600,
          }}
        >
          <span>9:41</span>
          <span>5G ▮</span>
        </div>
        <div style={{ flex: 1, padding: "6px 22px 26px", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.045)",
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 24,
  padding: "22px 24px",
};

const NavHeader: React.FC = () => (
  <div style={{ ...card, display: "flex", alignItems: "center", gap: 18 }}>
    <div
      style={{
        width: 66,
        height: 66,
        borderRadius: "50%",
        background: BRAND_GRADIENT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        color: "#0A0713",
        flexShrink: 0,
      }}
    >
      ▲
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: MONO, fontSize: 20, color: C.mute }}>진행 방향 · 북동</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 700, color: C.ink }}>
        강남 → 성수
      </div>
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 700 }}>
        <span style={{ color: C.cyan }}>12</span>
        <span style={{ fontSize: 22, color: C.mute }}>min</span>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 20, color: C.mute }}>4.2 km</div>
    </div>
  </div>
);

const STATIONS = [
  { dist: "1.2km", name: "SK 성수", side: "우측", price: "₩1,687", clean: "4.8" },
  { dist: "2.8km", name: "GS 뚝섬", side: "좌측", price: "₩1,692", clean: "4.6" },
  { dist: "3.5km", name: "S-Oil 성수", side: "우측", price: "₩1,679", clean: "4.9" },
  { dist: "4.1km", name: "현대 왕십리", side: "우측", price: "₩1,701", clean: "4.2" },
  { dist: "5.0km", name: "알뜰 성동", side: "좌측", price: "₩1,655", clean: "3.9" },
];

const GasRow: React.FC<{
  s: (typeof STATIONS)[number];
  delay: number;
  selected?: boolean;
  best?: boolean;
}> = ({ s, delay, selected, best }) => {
  const r = useRise(delay, 16);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 16,
        background: selected ? "rgba(198,255,61,0.08)" : "transparent",
        border: selected ? `2px solid ${C.green}` : "2px solid transparent",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 20, color: C.mute, width: 74 }}>{s.dist}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 26, color: C.ink, fontWeight: 600 }}>
          {s.name}{" "}
          {best && (
            <span style={{ fontFamily: MONO, fontSize: 16, color: C.green }}>· BEST</span>
          )}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.mute }}>
          🚻 {s.clean} · {s.side}
        </div>
      </div>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 24,
          fontWeight: 700,
          color: C.cyan,
        }}
      >
        {s.price}
      </span>
    </div>
  );
};

const AheadCard: React.FC<{
  rows?: number;
  selectedIdx?: number;
  startDelay?: number;
}> = ({ rows = 5, selectedIdx, startDelay = 6 }) => (
  <div style={{ ...card, marginTop: 16 }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 20, color: C.green, letterSpacing: 1 }}>
        ⛽ AHEAD · 진행 방향 앞
      </span>
      <span style={{ fontFamily: MONO, fontSize: 18, color: C.mute }}>{rows} stations</span>
    </div>
    {STATIONS.slice(0, rows).map((s, i) => (
      <GasRow
        key={s.name}
        s={s}
        delay={startDelay + i * 6}
        selected={selectedIdx === i}
        best={selectedIdx === undefined && s.clean === "4.9"}
      />
    ))}
  </div>
);

const Stars: React.FC<{ filled: number; delay: number }> = ({ filled, delay }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = interpolate(frame, [delay + i * 4, delay + i * 4 + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              fontSize: 34,
              color: i < filled ? C.lime : "rgba(255,255,255,0.18)",
              opacity: i < filled ? on : 1,
              scale: i < filled ? String(0.6 + on * 0.4) : "1",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
};

/* ── Step chrome ──────────────────────────────────────────────── */

const StepScene: React.FC<{
  n: number;
  title: string;
  caption: string;
  children: React.ReactNode;
}> = ({ n, title, caption, children }) => {
  const head = useRise(2, 16);
  const cap = useRise(8, 18);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "70px 0 0",
        }}
      >
        {/* step header */}
        <div style={{ ...head, width: 720, textAlign: "center" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 26,
              letterSpacing: 6,
              color: C.green,
              fontWeight: 700,
            }}
          >
            STEP {n} / {TOTAL_STEPS}
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 58,
              fontWeight: 800,
              color: C.ink,
              margin: "10px 0 16px",
            }}
          >
            {title}
          </div>
          {/* progress segments */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 62,
                  height: 8,
                  borderRadius: 4,
                  background: i < n ? undefined : "rgba(255,255,255,0.12)",
                  backgroundImage: i < n ? BRAND_GRADIENT : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 34 }}>{children}</div>
      </AbsoluteFill>

      {/* bottom caption */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 90, ...cap }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 34,
            fontWeight: 600,
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.92)",
            textAlign: "center",
            background: "rgba(8,6,15,0.72)",
            border: `1px solid ${C.cardBorder}`,
            borderRadius: 22,
            padding: "20px 28px",
            backdropFilter: "blur(8px)",
          }}
        >
          {caption}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Individual step screens ──────────────────────────────────── */

const S1 = () => (
  <PhoneShell>
    <NavHeader />
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: MONO, fontSize: 22, color: C.mute, textAlign: "center" }}>
        📍 진행 방향 감지 중…
      </div>
    </div>
  </PhoneShell>
);

const S2 = () => (
  <PhoneShell>
    <NavHeader />
    <div style={{ ...card, marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 20, color: C.green }}>
          ⛽ AHEAD · 진행 방향 앞
        </span>
        <span style={{ fontFamily: MONO, fontSize: 18, color: C.mute }}>탐색 중…</span>
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            height: 56,
            borderRadius: 14,
            margin: "10px 0",
            background: "rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </div>
  </PhoneShell>
);

const S3 = () => (
  <PhoneShell>
    <NavHeader />
    <AheadCard rows={5} />
  </PhoneShell>
);

const S4 = () => {
  const btn = usePop(40, 16);
  return (
    <PhoneShell>
      <NavHeader />
      <AheadCard rows={5} selectedIdx={2} startDelay={2} />
      <div
        style={{
          scale: String(btn),
          marginTop: 16,
          fontFamily: DISPLAY,
          fontSize: 32,
          fontWeight: 800,
          color: "#0A0713",
          background: BRAND_GRADIENT,
          borderRadius: 18,
          padding: "18px 0",
          textAlign: "center",
        }}
      >
        길찾기 →
      </div>
    </PhoneShell>
  );
};

const S5 = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [10, 46], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <PhoneShell>
      <div style={{ ...card, background: "rgba(52,216,255,0.06)", marginBottom: 14 }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.cyan }}>🧭 지도 앱으로 안내</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 700, color: C.ink }}>
          SK 성수 · 5분
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", borderRadius: 24, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
        <svg viewBox="0 0 520 760" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <g stroke="rgba(255,255,255,0.06)" strokeWidth={2}>
            <line x1="0" y1="240" x2="520" y2="180" />
            <line x1="0" y1="480" x2="520" y2="560" />
            <line x1="160" y1="0" x2="120" y2="760" />
            <line x1="380" y1="0" x2="420" y2="760" />
          </g>
          <path
            d="M260 700 C250 560 330 520 320 400 C312 300 250 260 270 140"
            fill="none"
            stroke={C.cyan}
            strokeWidth={10}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={draw}
          />
          <circle cx="270" cy="140" r="18" fill={C.magenta} />
          <circle cx="260" cy="700" r="14" fill={C.cyan} />
        </svg>
      </div>
    </PhoneShell>
  );
};

const S6 = () => {
  const pop = usePop(10, 18);
  return (
    <PhoneShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <div
          style={{
            scale: String(pop),
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: BRAND_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 84,
          }}
        >
          ✓
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 800, color: C.ink }}>도착 · 정차</div>
        <div style={{ fontFamily: MONO, fontSize: 24, color: C.mute }}>SK 성수 주유소</div>
      </div>
    </PhoneShell>
  );
};

const ReviewRow: React.FC<{ icon: string; label: string; filled: number; delay: number }> = ({
  icon,
  label,
  filled,
  delay,
}) => {
  const r = useRise(delay, 16);
  return (
    <div style={{ ...r, ...card, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 26, color: C.ink }}>
        {icon} {label}
      </span>
      <Stars filled={filled} delay={delay + 6} />
    </div>
  );
};

const S7 = () => {
  const voice = usePop(56, 16);
  return (
    <PhoneShell>
      <div style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 800, color: C.ink, textAlign: "center", margin: "18px 0 24px" }}>
        여기 어땠나요?
      </div>
      <ReviewRow icon="🚻" label="화장실 청결" filled={5} delay={16} />
      <ReviewRow icon="⛽" label="시설" filled={4} delay={26} />
      <ReviewRow icon="😊" label="친절도" filled={5} delay={36} />
      <div
        style={{
          scale: String(voice),
          marginTop: 10,
          fontFamily: DISPLAY,
          fontSize: 30,
          fontWeight: 800,
          color: "#0A0713",
          background: BRAND_GRADIENT,
          borderRadius: 18,
          padding: "18px 0",
          textAlign: "center",
        }}
      >
        🎤 MukGo에게 말하기
      </div>
      <div style={{ fontFamily: MONO, fontSize: 18, color: C.mute, textAlign: "center", marginTop: 14 }}>
        + 사진 추가 · AI가 항목별로 정리
      </div>
    </PhoneShell>
  );
};

const S8 = () => {
  const frame = useCurrentFrame();
  const pop = usePop(6, 18);
  const count = Math.round(interpolate(frame, [20, 60], [23, 24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const bar = useProgress(24, 40) * (24 / 30);
  return (
    <PhoneShell>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <div
          style={{
            scale: String(pop),
            fontFamily: DISPLAY,
            fontSize: 96,
            fontWeight: 800,
            background: TEXT_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          +50 P
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 34, fontWeight: 700, color: C.ink }}>
          리뷰 {count} / 30
        </div>
        <div style={{ width: 420, height: 18, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ width: `${bar * 100}%`, height: "100%", background: BRAND_GRADIENT }} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: CHARGE_GREEN, textAlign: "center", maxWidth: 460 }}>
          30개 달성 시 · 프리미엄 1개월 무료 🎉
        </div>
      </div>
    </PhoneShell>
  );
};

/* ── Assembly ─────────────────────────────────────────────────── */

const T = 14;
const STEPS: { n: number; title: string; caption: string; screen: React.ReactNode; dur: number }[] = [
  { n: 1, title: "진행 방향 감지", caption: "앱이 내 진행 방향을 자동으로 잡아요.", screen: <S1 />, dur: 70 },
  { n: 2, title: "전방 주유소 탐색", caption: "가는 방향 앞쪽 주유소만 — 없으면 반경을 자동으로 넓혀요.", screen: <S2 />, dur: 70 },
  { n: 3, title: "5곳 추천", caption: "거리·유가·화장실 청결도(★)까지 한눈에.", screen: <S3 />, dur: 95 },
  { n: 4, title: "한 곳 선택", caption: "가장 깨끗하고 저렴한 곳을 골라요.", screen: <S4 />, dur: 90 },
  { n: 5, title: "길찾기", caption: "구글맵·애플맵이 열리고 주행 안내를 시작해요.", screen: <S5 />, dur: 85 },
  { n: 6, title: "정차 & 이용", caption: "도착해서 주유하고 화장실을 이용해요.", screen: <S6 />, dur: 60 },
  { n: 7, title: "후기 등록", caption: "별점 + 음성 한마디면 AI가 알아서 정리해요.", screen: <S7 />, dur: 105 },
  { n: 8, title: "리워드 적립", caption: "리뷰 30개 모으면 프리미엄 1개월 무료!", screen: <S8 />, dur: 95 },
];
const TOTAL = STEPS.reduce((a, s) => a + s.dur, 0) - T * (STEPS.length - 1);

const GasBody: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("bgm.wav")}
        volume={(f) =>
          interpolate(f, [0, 12, durationInFrames - 26, durationInFrames], [0, 0.55, 0.55, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      <TransitionSeries>
        {STEPS.flatMap(({ n, title, caption, screen, dur }, i) => {
          const out = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={dur}>
              <StepScene n={n} title={title} caption={caption}>
                {screen}
              </StepScene>
            </TransitionSeries.Sequence>,
          ];
          if (i < STEPS.length - 1) {
            out.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                timing={linearTiming({ durationInFrames: T })}
                presentation={fade()}
              />,
            );
          }
          return out;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const GasModeComposition: React.FC = () => {
  return (
    <Composition
      id="MukGoGasKO"
      component={GasBody}
      durationInFrames={TOTAL}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
