import { AbsoluteFill, Composition, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { DriveScene } from "./DriveScene";
import { StopScene } from "./StopScene";
import { LogoScene } from "./LogoScene";
import { DemoScene } from "./DemoScene";
import { PillarsScene } from "./PillarsScene";
import { MoatScene } from "./MoatScene";
import { MarketScene } from "./MarketScene";
import { ModesScene } from "./ModesScene";
import { Lang } from "./copy";

const T = 22; // cross-fade duration

// Promo narrative: problem → brand → product → moat → market → CTA
const SCENES: { render: (lang: Lang) => React.ReactNode; dur: number }[] = [
  { render: (l) => <DriveScene lang={l} />, dur: 135 },
  { render: (l) => <StopScene lang={l} />, dur: 175 },
  { render: () => <LogoScene />, dur: 115 },
  { render: (l) => <DemoScene lang={l} />, dur: 200 },
  { render: (l) => <PillarsScene lang={l} />, dur: 170 },
  { render: (l) => <MoatScene lang={l} />, dur: 175 },
  { render: (l) => <MarketScene lang={l} />, dur: 155 },
  { render: (l) => <ModesScene lang={l} />, dur: 165 },
];

const TOTAL = SCENES.reduce((n, s) => n + s.dur, 0) - T * (SCENES.length - 1);

export const Promo: React.FC<{ lang: Lang }> = ({ lang }) => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("bgm.wav")} volume={0.7} />
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

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="MukGoPromoKO"
        component={Promo}
        durationInFrames={TOTAL}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ lang: "ko" as Lang }}
      />
      <Composition
        id="MukGoPromoEN"
        component={Promo}
        durationInFrames={TOTAL}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ lang: "en" as Lang }}
      />
    </>
  );
};
