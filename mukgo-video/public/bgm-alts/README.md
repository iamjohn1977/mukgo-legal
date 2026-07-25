# BGM candidates

Measurements taken by decoding each file and computing a 100 ms RMS envelope.

- **rms** — perceived loudness. Higher = more present under captions.
- **loop-seam** — energy of the last 5% divided by the first 5%. `1.0` means the
  end matches the start, so repeats join naturally. Well below `1.0` means the
  track fades out; well above means it ends louder than it starts.

| File | Source name | Length | Peak | RMS | loop-seam |
| --- | --- | ---: | ---: | ---: | ---: |
| `../bgm.mp3` **(in use)** | MukGoAAA111111 | 14.04s | 0.83 | 0.1375 | **0.69** |
| `build-to-finish.mp3` | MukGoAAA111 | 13.44s | 0.78 | 0.1247 | 2.44 |
| `loudest.mp3` | BGM1_MukGo | 12.04s | 0.85 | **0.1585** | 0.09 |
| `short-a.mp3` | MukGoAAA1111 | 10.84s | 0.86 | 0.1228 | 0.36 |
| `short-b.mp3` | MukGoAAA2 | 10.04s | 0.73 | 0.1156 | 0.13 |
| `soft-fade.mp3` | BGM1mukgo | 12.84s | 0.83 | 0.1329 | 0.31 |

`MukGoAAA3` was byte-identical to `MukGoAAA2`, so it is not listed separately.

## Why `MukGoAAA111111` is the default

Videos run 15–38s, so a ~12s track has to repeat. This one has both the
longest run time (fewest repeats) and the seam closest to `1.0`.

Every candidate still tapers at the end, so `src/Bgm.tsx` does not hard-loop —
it overlaps copies and equal-power crossfades between them, which hides the
tail regardless of which track is selected.

## Swapping tracks

Copy the alternate over `public/bgm.mp3`, then update `TRACK_SECONDS` in
`src/Bgm.tsx` to that file's length from the table above, and re-render.

`build-to-finish.mp3` rises toward its ending — better suited to a video that
finishes on it than to a looped bed.
