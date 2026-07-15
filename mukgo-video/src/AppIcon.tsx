import { BRAND_GRADIENT, C } from "./brand";

/** The MukGo app icon: gradient rounded-square with a white pin-and-fork glyph. */
export const AppIcon: React.FC<{ size: number; glow?: boolean }> = ({
  size,
  glow = true,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.235,
        background: BRAND_GRADIENT,
        boxShadow: glow
          ? `0 24px 70px rgba(255,53,195,0.35), 0 8px 30px rgba(52,216,255,0.28)`
          : "none",
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
          <mask id={`pinMask-${size}`}>
            <path
              d="M100 18 C56 18 22 52 22 96 C22 142 72 184 100 224 C128 184 178 142 178 96 C178 52 144 18 100 18 Z"
              fill="white"
            />
            <rect x="74" y="44" width="9" height="56" rx="4.5" fill="black" />
            <rect x="95.5" y="44" width="9" height="56" rx="4.5" fill="black" />
            <rect x="117" y="44" width="9" height="56" rx="4.5" fill="black" />
            <rect x="74" y="90" width="52" height="15" rx="7.5" fill="black" />
            <rect x="90.5" y="90" width="19" height="88" rx="9.5" fill="black" />
          </mask>
        </defs>
        <path
          d="M100 18 C56 18 22 52 22 96 C22 142 72 184 100 224 C128 184 178 142 178 96 C178 52 144 18 100 18 Z"
          fill={C.ink}
          mask={`url(#pinMask-${size})`}
        />
      </svg>
    </div>
  );
};
