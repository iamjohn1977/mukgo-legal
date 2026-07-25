import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";

/** Length of public/bgm.mp3 (MukGoAAA111111) in seconds. */
const TRACK_SECONDS = 14.04;
/** Overlap between repeats — long enough to hide the track's fade-out tail. */
const CROSSFADE_SECONDS = 1.6;

/**
 * Shared background music.
 *
 * Every candidate track tapers off at the end, so a plain `loop` drops out
 * audibly at each seam. Instead we lay down overlapping copies and
 * equal-power crossfade between them, plus a fade in/out for the video.
 */
export const Bgm: React.FC<{ level?: number; fadeOutFrames?: number }> = ({
  level = 0.65,
  fadeOutFrames = 30,
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  const trackFrames = Math.round(TRACK_SECONDS * fps);
  const xfadeFrames = Math.round(CROSSFADE_SECONDS * fps);
  const periodFrames = trackFrames - xfadeFrames;
  const repeats = Math.ceil(durationInFrames / periodFrames);

  return (
    <>
      {Array.from({ length: repeats }).map((_, i) => (
        <Sequence
          key={i}
          from={i * periodFrames}
          durationInFrames={trackFrames}
          name={`BGM ${i + 1}`}
        >
          <Audio
            src={staticFile("bgm.mp3")}
            volume={(f) => {
              // equal-power crossfade at both edges of this repeat
              const fadeIn =
                i === 0
                  ? 1
                  : Math.sqrt(
                      interpolate(f, [0, xfadeFrames], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                    );
              const fadeOut = Math.sqrt(
                interpolate(
                  f,
                  [trackFrames - xfadeFrames, trackFrames],
                  [1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                ),
              );
              // video-level envelope, in absolute composition frames
              const abs = i * periodFrames + f;
              const envelope = interpolate(
                abs,
                [0, 14, durationInFrames - fadeOutFrames, durationInFrames],
                [0, level, level, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              return fadeIn * fadeOut * envelope;
            }}
          />
        </Sequence>
      ))}
    </>
  );
};
