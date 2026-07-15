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

const T = 22; // cross-fade duration

// Promo narrative: problem → brand → product → moat → market → CTA
const SCENES = [
  { Comp: DriveScene, dur: 135 },
  { Comp: StopScene, dur: 175 },
  { Comp: LogoScene, dur: 115 },
  { Comp: DemoScene, dur: 200 },
  { Comp: PillarsScene, dur: 170 },
  { Comp: MoatScene, dur: 175 },
  { Comp: MarketScene, dur: 155 },
  { Comp: ModesScene, dur: 165 },
] as const;

const TOTAL =
  SCENES.reduce((n, s) => n + s.dur, 0) - T * (SCENES.length - 1);

export const MyComponent: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("bgm.wav")} volume={0.7} />
      <TransitionSeries>
        {SCENES.flatMap(({ Comp, dur }, i) => {
          const nodes = [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={dur}>
              <Comp />
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
    <Composition
      id="MukGoIntro"
      component={MyComponent}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
