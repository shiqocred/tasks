import * as React from "react";

export const useOrigin = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return "";
  }

  return origin;
};
