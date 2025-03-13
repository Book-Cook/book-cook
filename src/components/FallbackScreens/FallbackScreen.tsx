import type { FallbackScreenProps } from "./FallbackScreen.types";
import { ErrorScreen } from "./ErrorScreen";
import { LoadingScreen } from "./LoadingScreen";
import { NoDataScreen } from "./NoDataScreen";
import { Unauthorized } from "./Unathorized";

export const FallbackScreen: React.FC<FallbackScreenProps> = (props) => {
  const { isLoading, dataLength, isError, children, isUnauthorized } = props;

  if (isError) {
    return <ErrorScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (dataLength === 0 || dataLength === undefined) {
    return <NoDataScreen />;
  }

  if (isUnauthorized) {
    return <Unauthorized />;
  }

  return children ? <>{children}</> : null;
};
