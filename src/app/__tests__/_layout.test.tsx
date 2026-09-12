import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import RootLayout from "../_layout";

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock("expo-router", () => ({
  Stack: () => null,
}));

jest.mock("@/theme/useLoadFonts", () => ({
  useLoadFonts: () => true,
}));

jest.mock("@/stats/useRecordCompletedSessions", () => ({
  useRecordCompletedSessions: jest.fn(),
}));

jest.mock("@/reminders/useRefreshRemindersOnForeground", () => ({
  useRefreshRemindersOnForeground: jest.fn(),
}));

jest.mock("@/features/timer/SessionCompletionFeedback", () => ({
  SessionCompletionFeedback: () => null,
}));

jest.mock("expo-router/unstable-native-tabs", () => {
  function Label({ children }: PropsWithChildren) {
    return <span>{children}</span>;
  }

  function Icon() {
    return null;
  }

  const Trigger = Object.assign(
    ({ children, name }: PropsWithChildren<{ name: string }>) => (
      <div role="tab" tabIndex={0} data-route={name}>
        {children}
      </div>
    ),
    { Label, Icon },
  );

  const NativeTabs = Object.assign(
    ({ children }: PropsWithChildren) => <div role="tablist">{children}</div>,
    { Trigger },
  );

  return { NativeTabs };
});

describe("root tab navigation", () => {
  it("exposes Home, Timer, and Settings as exactly three tabs in order", () => {
    render(<RootLayout />);

    const tabs = screen.getAllByRole("tab");

    expect(tabs).toHaveLength(3);
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Home",
      "Timer",
      "Settings",
    ]);
    expect(tabs.map((tab) => tab.getAttribute("data-route"))).toEqual([
      "(home)",
      "(timer)",
      "(settings)",
    ]);
  });
});
