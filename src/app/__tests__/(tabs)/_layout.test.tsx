import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import TabLayout from "../../(tabs)/_layout";

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

describe("tab tab navigation", () => {
  it("exposes the four primary tabs in order", () => {
    render(<TabLayout />);

    const tabs = screen.getAllByRole("tab");

    expect(tabs).toHaveLength(3);
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      "Timer",
      "Explore",
      "Settings",
    ]);
    expect(tabs.map((tab) => tab.getAttribute("data-route"))).toEqual([
      "(home)",
      "explorer",
      "settings",
    ]);
  });
});
