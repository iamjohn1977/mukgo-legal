import {
  AbsoluteFill,
  Composition,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./Background";
import { AppIcon } from "./AppIcon";
import { PhoneMockup } from "./DemoScene";
import { BRAND_GRADIENT, C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { usePop, useRise } from "./anim";
import { COPY, Lang } from "./copy";

const HookScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].social;
  const a = useRise(4, 30);
  const b = useRise(16, 30);
  const punch = useRise(52, 26);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          padding: "0 90px",
          textAlign: "center",
        }}
      >
        <div style={{ ...a, fontFamily: DISPLAY, fontSize: 80, fontWeight: 800, color: C.ink }}>
          {t.hookA}
        </div>
        <div
          style={{
            ...b,
            fontFamily: DISPLAY,
            fontSize: 120,
            fontWeight: 800,
            lineHeight: 1,
            background: `linear-gradient(100deg, #FF7A45, ${C.magenta})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {t.hookB}
        </div>
        <div
          style={{
            ...punch,
            marginTop: 30,
            fontFamily: DISPLAY,
            fontSize: 46,
            fontWeight: 600,
            color: C.mute,
          }}
        >
          {t.hookPunch}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = usePop(0, 24);
  const bob = interpolate(frame % 72, [0, 36, 72], [0, -14, 0]);
  const word = useRise(18, 28);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <Interactive.Div name="Icon" style={{ scale: String(pop), translate: `0px ${bob}px` }}>
          <AppIcon size={420} />
        </Interactive.Div>
        <div style={{ ...word, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontFamily: MONO, fontSize: 34, letterSpacing: 14, color: C.green, fontWeight: 600 }}>
            MUKGO · 먹go
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 96, fontWeight: 800, color: C.ink }}>
            Drive · Eat ·{" "}
            <span
              style={{
                background: TEXT_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Go
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const DemoVertical: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].demo;
  const cap = useRise(4, 22);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            ...cap,
            fontFamily: DISPLAY,
            fontSize: 66,
            fontWeight: 800,
            color: C.ink,
            textAlign: "center",
          }}
        >
          {t.h1}{" "}
          <span
            style={{
              background: TEXT_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {t.h1grad}
          </span>
        </div>
        <div style={{ scale: "1.5", transformOrigin: "center top", marginTop: 20 }}>
          <PhoneMockup t={t} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ValueRow: React.FC<{ emoji: string; text: string; delay: number }> = ({
  emoji,
  text,
  delay,
}) => {
  const s = usePop(delay, 16);
  return (
    <Interactive.Div
      name={`Value ${text}`}
      style={{
        scale: String(s),
        display: "flex",
        alignItems: "center",
        gap: 28,
        width: 880,
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 28,
        padding: "30px 36px",
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 26,
          background: BRAND_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 40, fontWeight: 700, color: C.ink }}>
        {text}
      </div>
    </Interactive.Div>
  );
};

const ValuesScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].social;
  const strip = useRise(56, 20);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {t.values.map((v, i) => (
          <ValueRow key={v.text} emoji={v.emoji} text={v.text} delay={8 + i * 10} />
        ))}
        <div
          style={{
            ...strip,
            marginTop: 20,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 46,
            letterSpacing: 2,
            padding: "16px 42px",
            borderRadius: 999,
            background: BRAND_GRADIENT,
            color: "#0A0713",
          }}
        >
          {t.valueStrip}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].social;
  const frame = useCurrentFrame();
  const pop = usePop(0, 22);
  const title = useRise(16, 26);
  const sub = useRise(26, 22);
  const badge = useRise(38, 20);
  const pulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.4, 0.75]);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 90px",
          textAlign: "center",
        }}
      >
        <Interactive.Div name="Icon" style={{ scale: String(pop) }}>
          <AppIcon size={260} />
        </Interactive.Div>
        <div style={{ ...title, fontFamily: DISPLAY, fontSize: 100, fontWeight: 800, color: C.ink }}>
          {t.ctaTitle}
        </div>
        <div style={{ ...sub, fontFamily: DISPLAY, fontSize: 42, fontWeight: 500, color: C.mute, lineHeight: 1.4 }}>
          {t.ctaSub}
        </div>
        <div
          style={{
            ...badge,
            fontFamily: MONO,
            fontSize: 34,
            fontWeight: 700,
            color: "#0A0713",
            background: BRAND_GRADIENT,
            padding: "22px 48px",
            borderRadius: 999,
            boxShadow: `0 18px 70px rgba(52,216,255,${pulse})`,
          }}
        >
          ▶ {t.ctaBadge}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const T = 18;
const SCENES: { render: (l: Lang) => React.ReactNode; dur: number }[] = [
  { render: (l) => <HookScene lang={l} />, dur: 105 },
  { render: () => <BrandScene />, dur: 85 },
  { render: (l) => <DemoVertical lang={l} />, dur: 190 },
  { render: (l) => <ValuesScene lang={l} />, dur: 135 },
  { render: (l) => <CtaScene lang={l} />, dur: 105 },
];
const TOTAL = SCENES.reduce((n, s) => n + s.dur, 0) - T * (SCENES.length - 1);

const VerticalBody: React.FC<{ lang: Lang }> = ({ lang }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("bgm.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 12, durationInFrames - 30, durationInFrames],
            [0, 0.7, 0.7, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      <TransitionSeries>
        {SCENES.flatMap(({ render, dur }, i) => {
          const nodes = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={dur}>
              {render(lang)}
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
            nodes.push(
              <TransitionSeries.Transition
                key={`t${i}`}
                timing={linearTiming({ durationInFrames: T })}
                presentation={fade()}
              />,
            );
          }
          return nodes;
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const VerticalCompositions: React.FC = () => {
  return (
    <>
      <Composition
        id="MukGoSocialKO"
        component={VerticalBody}
        durationInFrames={TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ lang: "ko" as Lang }}
      />
      <Composition
        id="MukGoSocialEN"
        component={VerticalBody}
        durationInFrames={TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ lang: "en" as Lang }}
      />
    </>
  );
};
