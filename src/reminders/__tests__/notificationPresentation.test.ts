import { notificationPresentation } from "../notificationPresentation";

describe("notification presentation", () => {
  it("does not present a session-end alert while the app is active", () => {
    expect(
      notificationPresentation({ kind: "session-end-alert" }, "active"),
    ).toEqual({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: false,
    });
  });

  it("presents a session-end alert after the app backgrounds", () => {
    expect(
      notificationPresentation({ kind: "session-end-alert" }, "background"),
    ).toEqual({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
    });
  });

  it("does not present a session-end alert during an inactive transition", () => {
    expect(
      notificationPresentation({ kind: "session-end-alert" }, "inactive"),
    ).toEqual({
      shouldShowBanner: false,
      shouldShowList: false,
      shouldPlaySound: false,
    });
  });

  it("continues presenting ordinary reminders while the app is active", () => {
    expect(notificationPresentation({ kind: "reminder" }, "active")).toEqual({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
    });
  });
});
