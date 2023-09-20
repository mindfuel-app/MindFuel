import { useState } from "react";

let previousRoute = "/";
export function usePreviousPath() {
  const [previousPath, setPreviousPath] = useState(previousRoute);

  const onRouteChange = (path: string) => {
    setPreviousPath(path);
    previousRoute = path;
  };

  return { previousPath, onRouteChange };
}
