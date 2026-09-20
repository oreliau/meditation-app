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
      "radial-gradient(circle at 12% 78%, rgba(175, 165, 255, 0.34) 0%, transparent 58%), radial-gradient(circle at 84% 20%, rgba(186, 165, 255, 0.3) 0%, transparent 60%), radial-gradient(circle at 52% 52%, rgba(224, 242, 241, 0.2) 0%, transparent 68%)",
    );
    expect(backgroundThemeValues.dark.fallbackGradient).toContain(
      "radial-gradient(circle at 12% 78%, rgba(175, 165, 255, 0.34) 0%, transparent 58%), radial-gradient(circle at 84% 20%, rgba(186, 165, 255, 0.3) 0%, transparent 60%), radial-gradient(circle at 52% 52%, rgba(224, 242, 241, 0.2) 0%, transparent 68%)",
    );
    expect(backgroundThemeValues.dark.fallbackGradient).toContain(
      "radial-gradient(circle at 12% 78%, rgba(175, 165, 255, 0.34) 0%, transparent 58%), radial-gradient(circle at 84% 20%, rgba(186, 165, 255, 0.3) 0%, transparent 60%), radial-gradient(circle at 52% 52%, rgba(224, 242, 241, 0.2) 0%, transparent 68%)",
    );
  });
});
