import "./index.css";
import { MyComposition } from "./Composition";
import { VerticalCompositions } from "./VerticalPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <VerticalCompositions />
    </>
  );
};
