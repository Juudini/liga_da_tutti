import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import ErrorFallback from "./ErrorFallback";

export default function RouteErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error;

  return (
    <ErrorFallback
      error={message}
      onReset={() => {
        window.location.href = "/";
      }}
    />
  );
}
