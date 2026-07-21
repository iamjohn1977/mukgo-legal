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
import { BRAND_GRADIENT, C, DISPLAY, MONO, TEXT_GRADIENT } from "./brand";
import { usePop, useProgress, useRise } from "./anim";

const TESLA_RED = "#E82127";
const CHARGE_GREEN = "#3DDC84";

/** Bottom voiceover caption, karaoke-style fade-in. */
const VoCaption: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 10,
}) => {
  const r = useRise(delay, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 120,
        ...r,
      }}
    >
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.45,
          color: "rgba(255,255,255,0.92)",
          textAlign: "center",
          background: "rgba(8,6,15,0.72)",
          border: `1px solid ${C.cardBorder}`,
          borderRadius: 24,
          padding: "22px 30px",
          backdropFilter: "blur(8px)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ── Scene 1 · Plugged in, 28 minutes ─────────────────────────── */

const TeslaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useRise(4, 26);
  const bolt = usePop(10, 20);
  const fill = useProgress(8, 50);
  const pct = Math.round(interpolate(fill, [0, 1], [42, 61]));
  const pulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...title,
            fontFamily: DISPLAY,
            fontSize: 74,
            fontWeight: 800,
            color: C.ink,
            lineHeight: 1.15,
          }}
        >
          You just plugged in.
          <br />
          <span style={{ color: CHARGE_GREEN }}>28 minutes.</span>
        </div>

        {/* charge screen card */}
        <Interactive.Div
          name="Charge card"
          style={{
            scale: String(bolt),
            width: 760,
            borderRadius: 36,
            background: "rgba(255,255,255,0.045)",
            border: `1px solid ${C.cardBorder}`,
            padding: "44px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 26,
                letterSpacing: 4,
                color: TESLA_RED,
                fontWeight: 700,
              }}
            >
              ⚡ SUPERCHARGING
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 26,
                color: C.mute,
              }}
            >
              250 kW
            </span>
          </div>

          {/* battery */}
          <div
            style={{
              height: 64,
              borderRadius: 18,
              border: `3px solid rgba(255,255,255,0.28)`,
              padding: 6,
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                borderRadius: 10,
                background: CHARGE_GREEN,
                boxShadow: `0 0 ${28 * pulse}px ${CHARGE_GREEN}aa`,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 56,
                fontWeight: 800,
                color: C.ink,
              }}
            >
              {pct}%
            </span>
            <span style={{ fontFamily: MONO, fontSize: 30, color: C.mute }}>
              28 min until 80%
            </span>
          </div>
        </Interactive.Div>
      </AbsoluteFill>

      <VoCaption
        text={
          "“You just plugged in at a Supercharger. Twenty-eight minutes. Now what — sit in the car?”"
        }
        delay={30}
      />
    </AbsoluteFill>
  );
};

/* ── Scene 2 · Tesla mode charger card ────────────────────────── */

const Row: React.FC<{
  emoji: string;
  main: string;
  sub: string;
  right?: React.ReactNode;
  delay: number;
}> = ({ emoji, main, sub, right, delay }) => {
  const r = useRise(delay, 18);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 22,
        background: "rgba(255,255,255,0.035)",
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 22,
        padding: "22px 26px",
      }}
    >
      <span style={{ fontSize: 46 }}>{emoji}</span>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 32,
            fontWeight: 700,
            color: C.ink,
          }}
        >
          {main}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 22, color: C.mute }}>
          {sub}
        </div>
      </div>
      {right}
    </div>
  );
};

const ChargerScene: React.FC = () => {
  const title = useRise(4, 26);
  const chip = usePop(2, 16);
  const score = usePop(56, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            scale: String(chip),
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: 6,
            color: TESLA_RED,
            fontWeight: 700,
            border: `1px solid ${TESLA_RED}66`,
            borderRadius: 999,
            padding: "12px 30px",
          }}
        >
          🔌 TESLA MODE
        </div>

        <div
          style={{
            ...title,
            fontFamily: DISPLAY,
            fontSize: 66,
            fontWeight: 800,
            color: C.ink,
            lineHeight: 1.2,
          }}
        >
          Your Tesla told you{" "}
          <span
            style={{
              background: TEXT_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            WHERE
          </span>{" "}
          to charge.
        </div>

        <div
          style={{
            width: 840,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <Row
            emoji="⚡"
            main="Supercharger · Downtown"
            sub="12 stalls · 8 available"
            delay={22}
            right={
              <Interactive.Div
                name="Stop Score"
                style={{
                  scale: String(score),
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 30,
                  color: "#0A0713",
                  background: BRAND_GRADIENT,
                  borderRadius: 18,
                  padding: "12px 22px",
                }}
              >
                ⚡ 92
              </Interactive.Div>
            }
          />
          <Row
            emoji="🌮"
            main="Taco Verde"
            sub="3-min walk · ★ 4.9"
            delay={34}
          />
          <Row
            emoji="🍔"
            main="Walkable food nearby"
            sub="4 spots within 5 minutes"
            delay={44}
          />
        </div>
      </AbsoluteFill>

      <VoCaption
        text={
          "“It didn’t tell you there’s a taco spot a 3-minute walk away.”"
        }
        delay={54}
      />
    </AbsoluteFill>
  );
};

/* ── Scene 3 · Fits your charge time + live countdown ─────────── */

const TimeChip: React.FC<{ label: string; active?: boolean; delay: number }> =
  ({ label, active, delay }) => {
    const s = usePop(delay, 14);
    return (
      <div
        style={{
          scale: String(s),
          fontFamily: DISPLAY,
          fontSize: 34,
          fontWeight: 800,
          padding: "16px 38px",
          borderRadius: 999,
          background: active ? BRAND_GRADIENT : "rgba(255,255,255,0.05)",
          border: active ? "none" : `1px solid ${C.cardBorder}`,
          color: active ? "#0A0713" : C.mute,
        }}
      >
        {label}
      </div>
    );
  };

const FitRow: React.FC<{
  emoji: string;
  name: string;
  sub: string;
  delay: number;
}> = ({ emoji, name, sub, delay }) => {
  const r = useRise(delay, 16);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 20,
        background: "rgba(255,255,255,0.035)",
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        padding: "18px 24px",
        width: 840,
      }}
    >
      <span style={{ fontSize: 42 }}>{emoji}</span>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div
          style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, color: C.ink }}
        >
          {name}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 21, color: C.mute }}>{sub}</div>
      </div>
      <span
        style={{
          fontFamily: DISPLAY,
          fontSize: 28,
          fontWeight: 800,
          color: CHARGE_GREEN,
        }}
      >
        fits ✓
      </span>
    </div>
  );
};

const CountdownScene: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useRise(2, 22);
  const timerPop = usePop(30, 18);

  // live countdown from 28:00, ticking once the timer has popped in
  const secondsGone = Math.max(0, Math.floor((frame - 34) / 30));
  const total = 28 * 60 - secondsGone;
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  const pulse = interpolate(Math.sin(frame / 9), [-1, 1], [0.35, 0.7]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...title,
            fontFamily: MONO,
            fontSize: 28,
            letterSpacing: 5,
            color: C.green,
            fontWeight: 700,
          }}
        >
          NEARBY WHILE YOU CHARGE
        </div>

        <div style={{ display: "flex", gap: 18 }}>
          <TimeChip label="15 min" delay={10} />
          <TimeChip label="30 min" active delay={16} />
          <TimeChip label="45 min" delay={22} />
        </div>

        <Interactive.Div
          name="Countdown"
          style={{
            scale: String(timerPop),
            fontFamily: MONO,
            fontSize: 130,
            fontWeight: 800,
            color: C.ink,
            letterSpacing: 6,
            padding: "10px 60px",
            borderRadius: 34,
            border: `2px solid ${C.cyan}55`,
            boxShadow: `0 0 60px rgba(52,216,255,${pulse})`,
          }}
        >
          {mm}:{ss}
        </Interactive.Div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FitRow emoji="🌮" name="Taco Verde" sub="3-min walk · ★ 4.9" delay={52} />
          <FitRow emoji="🍜" name="Ramen Butan" sub="5-min walk · ★ 4.6" delay={60} />
          <FitRow emoji="☕" name="Blue Bottle" sub="2-min walk · ★ 4.7" delay={68} />
        </div>

        <div
          style={{
            ...useRise(84, 20),
            fontFamily: DISPLAY,
            fontSize: 52,
            fontWeight: 800,
            color: C.ink,
          }}
        >
          …food that{" "}
          <span
            style={{
              background: TEXT_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            fits your charge time.
          </span>
        </div>
      </AbsoluteFill>

      <VoCaption
        text={
          "“MukGo shows walkable food that fits your charge window — with a live clock, so you’re back before it’s done.”"
        }
        delay={80}
      />
    </AbsoluteFill>
  );
};

/* ── End card ─────────────────────────────────────────────────── */

const EndCard: React.FC = () => {
  const pop = usePop(0, 20);
  const word = useRise(12, 22);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <Interactive.Div name="Icon" style={{ scale: String(pop) }}>
          <AppIcon size={300} />
        </Interactive.Div>
        <div
          style={{
            ...word,
            fontFamily: DISPLAY,
            fontSize: 78,
            fontWeight: 800,
            color: C.ink,
          }}
        >
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
        <div
          style={{
            ...word,
            fontFamily: MONO,
            fontSize: 28,
            letterSpacing: 4,
            color: C.green,
          }}
        >
          MUKGO · Google Play open testing
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ── Assembly ─────────────────────────────────────────────────── */

const T = 15;
const SCENES: { node: React.ReactNode; dur: number }[] = [
  { node: <TeslaScene />, dur: 95 },
  { node: <ChargerScene />, dur: 150 },
  { node: <CountdownScene />, dur: 185 },
  { node: <EndCard />, dur: 70 },
];
const TOTAL = SCENES.reduce((n, s) => n + s.dur, 0) - T * (SCENES.length - 1);

const TeslaBody: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("bgm.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, 12, durationInFrames - 26, durationInFrames],
            [0, 0.6, 0.6, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      <TransitionSeries>
        {SCENES.flatMap(({ node, dur }, i) => {
          const out = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={dur}>
              {node}
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
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

export const TeslaCompositions: React.FC = () => {
  return (
    <Composition
      id="MukGoTeslaEN"
      component={TeslaBody}
      durationInFrames={TOTAL}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
