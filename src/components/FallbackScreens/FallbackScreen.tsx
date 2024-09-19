import type { FallbackScreenProps } from "./FallbackScreen.types";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";
import { NoDataScreen } from "./NoDataScreen";

export const FallbackScreen: React.FC<FallbackScreenProps> = (props) => {
  const { view } = props;

  switch (view) {
    case "error":
      return <ErrorScreen />;
    case "loading":
      return <LoadingScreen />;
    case "empty":
      return <NoDataScreen />;
    default:
      return null;
  }
};
