import {
  AbsoluteFill,
  Easing,
  Interactive,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { AppIcon } from "./AppIcon";
import { Background } from "./Background";
import { C, DISPLAY, MONO, ease, spring } from "./brand";

const Logo: React.FC = () => {
  const frame = useCurrentFrame();

  const pop = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: spring,
  });
  const bob = interpolate(frame % 72, [0, 36, 72], [0, -12, 0], {
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <Interactive.Div
      name="App icon"
      style={{ scale: pop, translate: `0px ${bob}px` }}
    >
      <AppIcon size={260} />
    </Interactive.Div>
  );
};

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const rise = interpolate(frame, [0, 22], [42, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <Interactive.Div
      name="Wordmark"
      style={{
        opacity,
        translate: `0px ${rise}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 30,
          letterSpacing: 12,
          fontWeight: 600,
          color: C.green,
        }}
      >
        MUKGO · 먹go
      </div>
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 118,
          fontWeight: 800,
          letterSpacing: -2,
          color: C.ink,
        }}
      >
        Drive · Eat ·{" "}
        <span
          style={{
            background: `linear-gradient(100deg, ${C.cyan}, ${C.magenta} 55%, ${C.lime})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Go
        </span>
      </div>
    </Interactive.Div>
  );
};

const FeatureBar: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const lineScale = interpolate(frame, [0, 28], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <Interactive.Div
      name="Feature bar"
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          width: 420,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.cyan}, ${C.magenta}, transparent)`,
          scale: `${lineScale} 1`,
        }}
      />
      <div
        style={{
          fontFamily: MONO,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: 6,
          color: C.green,
          textShadow: `0 0 22px ${C.green}66`,
        }}
      >
        HANDS-FREE · ON-ROUTE · GLANCE-FIRST
      </div>
    </Interactive.Div>
  );
};

export const LogoScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Sequence name="Background">
        <Background />
      </Sequence>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 52,
        }}
      >
        <Sequence name="Logo" layout="none">
          <Logo />
        </Sequence>

        <Sequence name="Wordmark" from={16} layout="none">
          <Wordmark />
        </Sequence>

        <Sequence name="Feature bar" from={40} layout="none">
          <FeatureBar />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
