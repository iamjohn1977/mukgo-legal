import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Background } from "./Background";
import { AppIcon } from "./AppIcon";
import {
  BRAND_GRADIENT,
  C,
  DISPLAY,
  MONO,
  TEXT_GRADIENT,
  ease,
} from "./brand";
import { COPY, Lang } from "./copy";

type DemoCopy = (typeof COPY)["ko"]["demo"];

const Easing_spring = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Fade + rise helper driven by the local sequence frame. */
const useRise = (delay: number, dist = 26) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return { opacity: t, translate: `0px ${(1 - t) * dist}px` };
};

const Chip: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      fontFamily: DISPLAY,
      fontSize: 16,
      color: "rgba(255,255,255,0.75)",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 8,
      padding: "3px 10px",
    }}
  >
    {label}
  </div>
);

const NumberBadge: React.FC<{ n: number; size?: number }> = ({
  n,
  size = 44,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.32,
      background: BRAND_GRADIENT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: DISPLAY,
      fontWeight: 700,
      fontSize: size * 0.46,
      color: "#0A0713",
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);

/** Faint streets + drawn magenta route + numbered pins + gas marker. */
const MapLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [22, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const pin = (delay: number) =>
    interpolate(frame, [delay, delay + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing_spring,
    });

  return (
    <svg
      viewBox="0 0 432 900"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {/* streets */}
      <g stroke="rgba(255,255,255,0.06)" strokeWidth={2}>
        <line x1="0" y1="330" x2="432" y2="250" />
        <line x1="0" y1="520" x2="432" y2="600" />
        <line x1="120" y1="0" x2="60" y2="900" />
        <line x1="300" y1="0" x2="360" y2="900" />
      </g>
      {/* route glow + line (kept within the open map window ~y330–610) */}
      <path
        d="M250 620 C246 560 306 528 300 476 C295 424 258 402 266 338"
        fill="none"
        stroke={C.magenta}
        strokeOpacity={0.35}
        strokeWidth={16}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw}
        style={{ filter: "blur(6px)" }}
      />
      <path
        d="M250 620 C246 560 306 528 300 476 C295 424 258 402 266 338"
        fill="none"
        stroke={C.magenta}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw}
      />
      {/* pins */}
      <g style={{ transformOrigin: "252px 588px", scale: String(pin(30)) }}>
        <circle cx="252" cy="588" r="20" fill={C.cyan} />
        <text
          x="252"
          y="596"
          textAnchor="middle"
          fontFamily={DISPLAY}
          fontWeight="700"
          fontSize="22"
          fill="#0A0713"
        >
          2
        </text>
      </g>
      <g style={{ transformOrigin: "305px 502px", scale: String(pin(38)) }}>
        <circle cx="305" cy="502" r="20" fill={C.cyan} />
        <text
          x="305"
          y="510"
          textAnchor="middle"
          fontFamily={DISPLAY}
          fontWeight="700"
          fontSize="22"
          fill="#0A0713"
        >
          3
        </text>
      </g>
      {/* gas marker with green ring */}
      <g style={{ transformOrigin: "288px 420px", scale: String(pin(46)) }}>
        <circle
          cx="288"
          cy="420"
          r="24"
          fill="#160A1E"
          stroke={C.green}
          strokeWidth={3}
        />
        <text x="288" y="430" textAnchor="middle" fontSize="24">
          ⛽
        </text>
      </g>
    </svg>
  );
};

const StatusBar: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 30px",
      height: 46,
      fontFamily: MONO,
      fontSize: 18,
      color: C.ink,
      fontWeight: 600,
    }}
  >
    <span>9:41</span>
    <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
      5G
      <span
        style={{
          width: 26,
          height: 13,
          border: "1.5px solid rgba(255,255,255,0.7)",
          borderRadius: 3,
          display: "inline-block",
        }}
      />
    </span>
  </div>
);

const HeaderCard: React.FC<{ t: DemoCopy }> = ({ t }) => {
  const r = useRise(8);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: BRAND_GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          color: "#0A0713",
          flexShrink: 0,
        }}
      >
        ▲
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 15,
            color: C.mute,
            letterSpacing: 1,
          }}
        >
          {t.navDir}
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 30,
            fontWeight: 700,
            color: C.ink,
          }}
        >
          {t.route}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 700 }}>
          <span style={{ color: C.cyan }}>12</span>
          <span style={{ fontSize: 17, color: C.mute }}>min</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 15, color: C.mute }}>
          4.2 km
        </div>
      </div>
    </div>
  );
};

const AheadRow: React.FC<{
  dist: string;
  name: string;
  side: string;
  price: string;
  delay: number;
}> = ({ dist, name, side, price, delay }) => {
  const r = useRise(delay, 16);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "7px 0",
      }}
    >
      <span
        style={{ fontFamily: MONO, fontSize: 17, color: C.mute, width: 62 }}
      >
        {dist}
      </span>
      <span
        style={{ fontFamily: DISPLAY, fontSize: 20, color: C.ink, flex: 1 }}
      >
        {name}
      </span>
      <Chip label={side} />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 19,
          color: C.cyan,
          fontWeight: 600,
          width: 82,
          textAlign: "right",
        }}
      >
        {price}
      </span>
    </div>
  );
};

const AheadCard: React.FC<{ t: DemoCopy }> = ({ t }) => {
  const r = useRise(14);
  return (
    <div
      style={{
        ...r,
        background: C.card,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 16,
            color: C.green,
            letterSpacing: 1,
          }}
        >
          {t.aheadTitle}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 15, color: C.mute }}>
          {t.stations}
        </span>
      </div>
      <AheadRow dist="1.2km" name="SK 성수" side={t.sideR} price="₩1,687" delay={20} />
      <AheadRow dist="2.8km" name="GS 뚝섬" side={t.sideL} price="₩1,692" delay={25} />
      <AheadRow dist="3.5km" name="S-Oil" side={t.sideR} price="₩1,679" delay={30} />
    </div>
  );
};

const TopRow: React.FC<{
  n: number;
  name: string;
  meta: string;
  eta: string;
  delay: number;
}> = ({ n, name, meta, eta, delay }) => {
  const r = useRise(delay, 18);
  return (
    <div
      style={{
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16,
        padding: "12px 16px",
      }}
    >
      <NumberBadge n={n} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700 }}>
          {name}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 15, color: C.mute }}>
          {meta}
        </div>
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700 }}>
        <span style={{ color: C.cyan }}>{eta}</span>
        <span style={{ fontSize: 15, color: C.mute }}>min</span>
      </div>
    </div>
  );
};

const BottomSheet: React.FC<{ t: DemoCopy }> = ({ t }) => {
  const r = useRise(30, 40);
  return (
    <div
      style={{
        ...r,
        background: "rgba(10,7,19,0.94)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.cardBorder}`,
        borderRadius: "24px 24px 0 0",
        padding: "18px 20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 16,
            color: C.green,
            letterSpacing: 1,
          }}
        >
          {t.topTitle}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 14, color: C.mute }}>
          {t.speak}
        </span>
      </div>
      {t.picks.map((p, i) => (
        <TopRow
          key={p.name}
          n={i + 1}
          name={p.name}
          meta={p.meta}
          eta={["+3", "+6", "+8"][i]}
          delay={38 + i * 6}
        />
      ))}
    </div>
  );
};

export const PhoneMockup: React.FC<{ t: DemoCopy }> = ({ t }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <Interactive.Div
      name="Phone"
      style={{
        opacity: enter,
        translate: `0px ${(1 - enter) * 60}px`,
        width: 460,
        height: 940,
        borderRadius: 60,
        padding: 5,
        background: `linear-gradient(150deg, ${C.cyan}, ${C.purple} 45%, ${C.magenta})`,
        boxShadow: `0 40px 120px rgba(255,53,195,0.28), 0 20px 60px rgba(52,216,255,0.22)`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 55,
          background: "#0A0713",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MapLayer />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <StatusBar />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: "6px 16px 0",
            }}
          >
            <HeaderCard t={t} />
            <AheadCard t={t} />
          </div>
          <div style={{ flex: 1 }} />
          <BottomSheet t={t} />
        </div>
      </div>
    </Interactive.Div>
  );
};

const Headline: React.FC<{ t: DemoCopy }> = ({ t }) => {
  const l1 = useRise(6, 28);
  const l2 = useRise(12, 28);
  const sub = useRise(20, 24);
  const label = useRise(2, 20);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 26,
        maxWidth: 760,
      }}
    >
      <Interactive.Div
        name="Eyebrow"
        style={{
          ...label,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <AppIcon size={72} glow={false} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: 8,
            color: C.green,
            fontWeight: 600,
          }}
        >
          MUKGO · 먹go
        </span>
      </Interactive.Div>

      <div style={{ fontFamily: DISPLAY, fontWeight: 800, lineHeight: 1.05 }}>
        <div style={{ ...l1, fontSize: 100, color: C.ink }}>{t.h1}</div>
        <div
          style={{
            ...l2,
            fontSize: 100,
            background: TEXT_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {t.h1grad}
        </div>
      </div>

      <div
        style={{
          ...sub,
          fontFamily: DISPLAY,
          fontSize: 34,
          lineHeight: 1.4,
          color: C.mute,
          fontWeight: 500,
        }}
      >
        {t.subA}
        <br />
        {t.subB}
      </div>

      <div
        style={{
          ...sub,
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: 4,
          color: C.green,
          textShadow: `0 0 22px ${C.green}55`,
        }}
      >
        HANDS-FREE · ON-ROUTE · GLANCE-FIRST
      </div>
    </div>
  );
};

export const DemoScene: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = COPY[lang].demo;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 110,
          padding: "0 120px",
        }}
      >
        <Headline t={t} />
        <PhoneMockup t={t} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
