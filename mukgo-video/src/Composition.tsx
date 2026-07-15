import { AbsoluteFill, Composition, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { LogoScene } from "./LogoScene";
import { DemoScene } from "./DemoScene";
import { ModesScene } from "./ModesScene";

const LOGO_DURATION = 120;
const DEMO_DURATION = 230;
const MODES_DURATION = 180;
const TRANSITION = 22;

export const MyComponent: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("bgm.wav")} volume={0.7} />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={LOGO_DURATION}>
          <LogoScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: TRANSITION })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={DEMO_DURATION}>
          <DemoScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: TRANSITION })}
          presentation={fade()}
        />
        <TransitionSeries.Sequence durationInFrames={MODES_DURATION}>
          <ModesScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const TOTAL =
  LOGO_DURATION + DEMO_DURATION + MODES_DURATION - TRANSITION * 2;

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
