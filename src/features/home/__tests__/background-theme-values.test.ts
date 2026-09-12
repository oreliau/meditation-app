import { backgroundThemeValues } from "../background-theme-values";

describe("backgroundThemeValues", () => {
  it("uses the documented warm light-theme accents", () => {
    expect(backgroundThemeValues.light.fallbackBackground).toBe("#fffdf9");
    expect(backgroundThemeValues.light.fallbackGradient).toContain(
      "rgba(217, 119, 87, 0.34)",
    );
    expect(backgroundThemeValues.light.fallbackGradient).toContain(
      "rgba(233, 168, 93, 0.3)",
    );
  });

  it("uses the documented indigo, lavender, and mint dark-theme colors", () => {
    expect(backgroundThemeValues.dark.fallbackBackground).toBe("#12121d");
    expect(backgroundThemeValues.dark.fallbackGradient).toContain(
      "rgba(26, 27, 65, 0.62)",
    );
    expect(backgroundThemeValues.dark.fallbackGradient).toContain(
      "rgba(186, 165, 255, 0.14)",
    );
    expect(backgroundThemeValues.dark.fallbackGradient).toContain(
      "rgba(224, 242, 241, 0.08)",
    );
  });
});
