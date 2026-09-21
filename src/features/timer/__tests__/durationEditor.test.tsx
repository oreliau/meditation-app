import "@/unistyles";
import { fireEvent, render } from "@testing-library/react-native";
import TimerScreen from "@/app/(tabs)/(home)";
import { useTimerSession } from "../useTimerSession";

jest.mock("../useTimerSession");
jest.mock("expo-router", () => ({ useLocalSearchParams: () => ({}) }));
jest.mock("expo-symbols", () => ({ SymbolView: () => null }));
jest.mock("@/presentation/adaptive-background/adaptive-background", () => ({
  AdaptiveBackground: () => null,
}));
jest.mock("../ProgressRing", () => ({ ProgressRing: () => null }));
jest.mock("../GlassPanel", () => ({
  GlassPanel: jest.requireActual("react-native").View,
}));
jest.mock("@/reminders", () => ({
  ensureNotificationPermission: jest.fn(),
}));
jest.mock("@expo/ui", () => {
  const { View, Pressable, Text } = jest.requireActual("react-native");
  return {
    Host: View,
    Column: View,
    Row: View,
    Button: ({
      label,
      onPress,
      disabled,
    }: {
      label: string;
      onPress: () => void;
      disabled: boolean;
    }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
      >
        <Text>{label}</Text>
      </Pressable>
    ),
  };
});

const timer = {
  status: "Paused" as const,
  isActive: true,
  remainingSeconds: 120,
  progress: 0.8,
  durationMinutes: 10 as const,
  elapsedMs: 480_000,
  canChangeDuration: true,
  isVolumeEnabled: true,
  setDurationMinutes: jest.fn(),
  setProgramContext: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  restart: jest.fn(),
  toggleVolume: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useTimerSession).mockReturnValue(timer);
});

it("pauses on opening, stages multiple choices, and applies only on confirmation", () => {
  const ui = render(<TimerScreen />);
  fireEvent.press(ui.getByLabelText("02:00 remaining. Change duration"));
  expect(timer.pause).toHaveBeenCalledTimes(1);
  expect(ui.getByLabelText("5 mins")).toBeDisabled();
  expect(ui.getByLabelText("Resume")).toBeDisabled();
  fireEvent.press(ui.getByLabelText("15 mins"));
  fireEvent.press(ui.getByLabelText("20 mins"));
  expect(timer.setDurationMinutes).not.toHaveBeenCalled();
  fireEvent.press(ui.getByLabelText("Apply"));
  expect(timer.setDurationMinutes).toHaveBeenCalledWith(20);
  expect(timer.play).not.toHaveBeenCalled();
  expect(ui.queryByText("Total duration")).toBeNull();
});

it("discards the draft on Cancel without resuming", () => {
  const ui = render(<TimerScreen />);
  fireEvent.press(ui.getByLabelText("02:00 remaining. Change duration"));
  fireEvent.press(ui.getByLabelText("20 mins"));
  fireEvent.press(ui.getByLabelText("Cancel"));
  expect(timer.setDurationMinutes).not.toHaveBeenCalled();
  expect(timer.play).not.toHaveBeenCalled();
  expect(ui.queryByText("Total duration")).toBeNull();
});

it("does not open the editor for a guided session", () => {
  jest.mocked(useTimerSession).mockReturnValue({
    ...timer,
    programContext: { programId: "p", sessionId: "s" },
  });
  const ui = render(<TimerScreen />);
  expect(ui.getByLabelText("02:00 remaining. Change duration")).toBeDisabled();
  fireEvent.press(ui.getByLabelText("02:00 remaining. Change duration"));
  expect(timer.pause).not.toHaveBeenCalled();
});
