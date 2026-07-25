import { interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";

/**
 * Shared background music (public/bgm.mp3, ~12s) looped for the whole
 * composition, with a fade in at the start and out at the end.
 */
export const Bgm: React.FC<{ level?: number; fadeOutFrames?: number }> = ({
  level = 0.65,
  fadeOutFrames = 30,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <Audio
      src={staticFile("bgm.mp3")}
      loop
      volume={(f) =>
        interpolate(
          f,
          [0, 14, durationInFrames - fadeOutFrames, durationInFrames],
          [0, level, level, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};
