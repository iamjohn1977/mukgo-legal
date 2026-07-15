import {
  AbsoluteFill,
  Composition,
  Easing,
  Interactive,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * MukGo (먹go) brand — hands-free, on-route food finder.
 * Dark neon aesthetic: cyan → purple → magenta → lime.
 */
const C = {
  bg0: "#08060F",
  bg1: "#140A20",
  cyan: "#34D8FF",
  purple: "#8B5CF6",
  magenta: "#FF35C3",
  lime: "#C6FF3D",
  green: "#A6FF2E",
  ink: "#FFFFFF",
  mute: "rgba(255,255,255,0.62)",
};

const BRAND_GRADIENT = `linear-gradient(135deg, ${C.cyan} 0%, ${C.purple} 42%, ${C.magenta} 72%, ${C.lime} 100%)`;

const DISPLAY =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO =
  "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const spring = Easing.bezier(0.34, 1.56, 0.64, 1);

/** The MukGo app icon: gradient rounded-square with a white pin-and-fork glyph. */
const AppIcon: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.235,
        background: BRAND_GRADIENT,
        boxShadow: `0 24px 70px rgba(255,53,195,0.35), 0 8px 30px rgba(52,216,255,0.28)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 200 240"
        style={{ display: "block" }}
      >
        <defs>
          <mask id="pinMask">
            {/* white = pin body is drawn */}
            <path
              d="M100 18 C56 18 22 52 22 96 C22 142 72 184 100 224 C128 184 178 142 178 96 C178 52 144 18 100 18 Z"
              fill="white"
            />
            {/* black = fork is punched out, revealing the gradient behind */}
            <rect x="74" y="44" width="9" height="56" rx="4.5" fill="black" />
            <rect x="95.5" y="44" width="9" height="56" rx="4.5" fill="black" />
            <rect x="117" y="44" width="9" height="56" rx="4.5" fill="black" />
            <rect x="74" y="90" width="52" height="15" rx="7.5" fill="black" />
            <rect x="90.5" y="90" width="19" height="88" rx="9.5" fill="black" />
          </mask>
        </defs>
        <path
          d="M100 18 C56 18 22 52 22 96 C22 142 72 184 100 224 C128 184 178 142 178 96 C178 52 144 18 100 18 Z"
          fill="#FFFFFF"
          mask="url(#pinMask)"
        />
      </svg>
    </div>
  );
};

/** Dark background with drifting neon glow blobs and a faint grid. */
const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const drift = (offset: number, range: number) =>
    interpolate(Math.sin((frame + offset) / 34), [-1, 1], [-range, range]);

  return (
    <Interactive.Div
      name="Background"
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(120% 120% at 50% 0%, ${C.bg1} 0%, ${C.bg0} 60%)`,
        overflow: "hidden",
      }}
    >
      {/* neon glow blobs */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: 120,
          top: -260,
          translate: `${drift(0, 30)}px ${drift(20, 24)}px`,
          background: `radial-gradient(circle, ${C.cyan}55 0%, transparent 62%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          right: 40,
          bottom: -320,
          translate: `${drift(80, 34)}px ${drift(50, 26)}px`,
          background: `radial-gradient(circle, ${C.magenta}4D 0%, transparent 62%)`,
          filter: "blur(30px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          left: "42%",
          top: "38%",
          translate: `${drift(140, 22)}px ${drift(110, 20)}px`,
          background: `radial-gradient(circle, ${C.purple}55 0%, transparent 60%)`,
          filter: "blur(30px)",
        }}
      />
      {/* faint perspective grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "88px 88px",
          maskImage:
            "radial-gradient(circle at 50% 55%, black 20%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 55%, black 20%, transparent 72%)",
        }}
      />
    </Interactive.Div>
  );
};

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

export const MyComponent: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut, backgroundColor: C.bg0 }}>
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

export const MyComposition = () => {
  return (
    <Composition
      id="MukGoIntro"
      component={MyComponent}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
