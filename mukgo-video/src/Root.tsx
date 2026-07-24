import "./index.css";
import { MyComposition } from "./Composition";
import { VerticalCompositions } from "./VerticalPromo";
import { TeslaCompositions } from "./TeslaPromo";
import { GasModeComposition } from "./GasModePromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <VerticalCompositions />
      <TeslaCompositions />
      <GasModeComposition />
    </>
  );
};
