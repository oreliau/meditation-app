import { inter, playfairDisplay } from "../typography";

describe("iOS font families", () => {
  it("uses the PostScript names registered from the embedded font files", () => {
    expect(inter).toEqual({
      regular: "Inter-Regular",
      medium: "Inter-Medium",
      semiBold: "Inter-SemiBold",
    });
    expect(playfairDisplay).toEqual({
      medium: "PlayfairDisplay-Medium",
      semiBold: "PlayfairDisplay-SemiBold",
    });
  });
});
