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

const BRAND = {
  bgFrom: "#FF7A18",
  bgTo: "#AF002D",
  ink: "#FFFFFF",
  accent: "#FFE29A",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Background"
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${BRAND.bgFrom} 0%, ${BRAND.bgTo} 100%)`,
        scale: interpolate(frame, [0, 150], [1.08, 1], {
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

const LogoMark: React.FC = () => {
  const frame = useCurrentFrame();

  const pop = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  const bob = interpolate(frame % 60, [0, 30, 60], [0, -14, 0], {
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <Interactive.Div
      name="Logo mark"
      style={{
        width: 220,
        height: 220,
        borderRadius: 60,
        background: "rgba(255,255,255,0.12)",
        border: "3px solid rgba(255,255,255,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        scale: pop,
        translate: `0px ${bob}px`,
        backdropFilter: "blur(4px)",
      }}
    >
      <div style={{ fontSize: 130, lineHeight: 1 }}>🍜</div>
    </Interactive.Div>
  );
};

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const rise = interpolate(frame, [0, 24], [40, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <Interactive.Div
      name="Wordmark"
      style={{
        opacity,
        translate: `0px ${rise}px`,
        fontSize: 150,
        fontWeight: 800,
        letterSpacing: -4,
        color: BRAND.ink,
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      Muk<span style={{ color: BRAND.accent }}>Go</span>
    </Interactive.Div>
  );
};

const Tagline: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateRight: "clamp",
    easing: ease,
  });
  const rise = interpolate(frame, [0, 24], [24, 0], {
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <Interactive.Div
      name="Tagline"
      style={{
        opacity,
        translate: `0px ${rise}px`,
        fontSize: 44,
        fontWeight: 500,
        color: "rgba(255,255,255,0.9)",
        letterSpacing: 2,
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      맛있는 발견의 시작 · Discover. Order. Enjoy.
    </Interactive.Div>
  );
};

export const MyComponent: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Sequence name="Background">
        <Background />
      </Sequence>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <Sequence name="Logo" layout="none">
          <LogoMark />
        </Sequence>

        <Sequence name="Wordmark" from={16} layout="none">
          <Wordmark />
        </Sequence>

        <Sequence name="Tagline" from={34} layout="none">
          <Tagline />
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
