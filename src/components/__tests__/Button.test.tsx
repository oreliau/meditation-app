import { fireEvent, render } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { Platform, Text } from "react-native";
import { Button } from "../Button";

jest.mock("expo-haptics", () => ({
  ImpactFeedbackStyle: { Light: "light", Heavy: "heavy" },
  impactAsync: jest.fn(() => Promise.resolve()),
}));

describe("Button", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.replaceProperty(Platform, "OS", "ios");
  });

  it("provides button semantics and haptic feedback by default", () => {
    const onPress = jest.fn();
    const ui = render(
      <Button onPress={onPress} accessibilityLabel="Continue">
        <Text>Continue</Text>
      </Button>,
    );

    const button = ui.getByLabelText("Continue");
    expect(button.props.role).toBe("button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessible).toBe(true);

    fireEvent.press(button);
    expect(Haptics.impactAsync).toHaveBeenCalledWith("light");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("allows accessibility and haptic settings to be overridden", () => {
    const ui = render(
      <Button
        accessibilityRole="radio"
        accessible={false}
        haptics={false}
        hapticStyle={Haptics.ImpactFeedbackStyle.Heavy}
        testID="override-button"
        onPress={jest.fn()}
      />,
    );

    const button = ui.getByTestId("override-button");
    expect(button.props.accessibilityRole).toBe("radio");
    expect(button.props.accessible).toBe(false);
    expect(button.props.role).toBe("button");
    fireEvent.press(button);
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it("does not provide haptics for disabled buttons", () => {
    const onPress = jest.fn();
    const ui = render(
      <Button disabled onPress={onPress} accessibilityLabel="Disabled" />,
    );

    fireEvent.press(ui.getByLabelText("Disabled"));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
  });
});
