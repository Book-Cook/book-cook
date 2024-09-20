import type { FallbackScreenProps } from "./FallbackScreen.types";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";
import { NoDataScreen } from "./NoDataScreen";

export const FallbackScreen: React.FC<FallbackScreenProps> = (props) => {
  const { isLoading, dataLength, isError } = props;

  if (isError) {
    return <ErrorScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (dataLength === 0 || dataLength === undefined) {
    return <NoDataScreen />;
  }

  return null;
};
