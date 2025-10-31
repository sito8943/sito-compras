import { ManagerProvider } from "@sito/dashboard-app";

// manager
import type { BasicProviderPropTypes } from "./types";

// lib
import { Manager } from "lib";

/**
 * Manager Provider
 * @param props - provider props
 * @returns  React component
 */
export const SCManagerProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const manager = new Manager();

  return <ManagerProvider manager={manager}>{children}</ManagerProvider>;
};
