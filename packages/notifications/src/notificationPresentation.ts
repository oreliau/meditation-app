import type { AppStateStatus } from "react-native";

export type NotificationPresentation = {
  shouldShowBanner: boolean;
  shouldShowList: boolean;
  shouldPlaySound: boolean;
};

export function notificationPresentation(
  data: { kind?: string } | undefined,
  appState: AppStateStatus,
): NotificationPresentation {
  const isForegroundSessionEndAlert =
    data?.kind === "session-end-alert" && appState !== "background";

  return {
    shouldShowBanner: !isForegroundSessionEndAlert,
    shouldShowList: !isForegroundSessionEndAlert,
    shouldPlaySound: !isForegroundSessionEndAlert,
  };
}
