import { Img, staticFile } from "remotion";

/** The real MukGo app icon (extracted from the app), rounded and glowing. */
export const AppIcon: React.FC<{ size: number; glow?: boolean }> = ({
  size,
  glow = true,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.205,
        overflow: "hidden",
        boxShadow: glow
          ? `0 24px 70px rgba(255,53,195,0.35), 0 8px 30px rgba(52,216,255,0.28)`
          : "none",
      }}
    >
      <Img
        src={staticFile("app-icon.png")}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};
