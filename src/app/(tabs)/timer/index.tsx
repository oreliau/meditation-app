import { Host, Picker } from "@expo/ui";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { getProgram } from "@/features/explorer/programs";
import { ControlButton } from "@/features/timer/ControlButton";
import {
  DURATION_PRESETS_MINUTES,
  formatClock,
  formatDurationLabel,
} from "@/features/timer/durations";
import { GlassPanel } from "@/features/timer/GlassPanel";
import { ProgressRing } from "@/features/timer/ProgressRing";
import type { SessionStatus } from "@/features/timer/session";
import { useTimerSession } from "@/features/timer/useTimerSession";
import { spacing } from "@/theme/spacing";

// UI copy uses the CONTEXT.md session vocabulary verbatim; only Completed
// gets a fuller phrase since it's the one state with feedback attached.
const statusCopy: Record<SessionStatus, string> = {
  Idle: "Idle",
  Running: "Running",
  Paused: "Paused",
  Stopped: "Stopped",
  Completed: "Session complete",
};

export default function TimerScreen() {
  const { theme } = useUnistyles();
  const { isActive, setDurationMinutes, setProgramContext, ...session } =
    useTimerSession();
  const params = useLocalSearchParams<{
    programId?: string;
    sessionId?: string;
  }>();
  const programId =
    typeof params.programId === "string" ? params.programId : undefined;
  const sessionId =
    typeof params.sessionId === "string" ? params.sessionId : undefined;
  const programSession =
    programId && sessionId
      ? getProgram(programId)?.sessions.find((item) => item.id === sessionId)
      : undefined;

  useEffect(() => {
    if (programId && sessionId && programSession) {
      setProgramContext({ programId, sessionId });
      setDurationMinutes(programSession.durationMinutes);
    } else if (!isActive && !programSession) {
      setProgramContext(undefined);
    }
  }, [
    programId,
    sessionId,
    programSession,
    isActive,
    setDurationMinutes,
    setProgramContext,
  ]);

  const isRunning = session.status === "Running";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Lumina Flow",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontFamily: theme.typography.headlineMdMobile.fontFamily,
            fontSize: theme.typography.headlineMdMobile.fontSize,
          },
        }}
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={[
            styles.label,
            styles.status,
            session.status === "Completed" && styles.statusCompleted,
          ]}
        >
          {statusCopy[session.status]}
        </Text>

        <View style={styles.ring}>
          <ProgressRing size={RING_SIZE} progress={session.progress} />
          <View style={styles.innerRing} />
          <GlassPanel style={styles.dial}>
            <Text
              style={styles.clock}
              accessibilityLabel={`${formatClock(session.remainingSeconds)} remaining`}
            >
              {formatClock(session.remainingSeconds)}
            </Text>
            <Text style={[styles.label, styles.clockCaption]}>Remaining</Text>
          </GlassPanel>
        </View>

        <View
          style={[
            styles.pickerBlock,
            !session.canChangeDuration && styles.pickerLocked,
          ]}
        >
          <Text style={styles.label}>Duration</Text>
          <Host matchContents style={styles.pickerHost}>
            <Picker
              appearance="wheel"
              selectedValue={session.durationMinutes}
              onValueChange={setDurationMinutes}
              enabled={session.canChangeDuration && !session.programContext}
              testID="duration-picker"
            >
              {DURATION_PRESETS_MINUTES.map((minutes) => (
                <Picker.Item
                  key={minutes}
                  label={formatDurationLabel(minutes)}
                  value={minutes}
                />
              ))}
            </Picker>
          </Host>
        </View>

        <View style={styles.controls}>
          <ControlButton
            icon="restart"
            label="Restart"
            onPress={session.restart}
          />
          <ControlButton
            primary
            icon={isRunning ? "pause" : "play"}
            label={isRunning ? "Pause" : "Play"}
            onPress={isRunning ? session.pause : session.play}
          />
          <ControlButton
            icon="stop"
            label="Stop"
            onPress={session.stop}
            disabled={!isActive}
          />
        </View>
      </ScrollView>
    </>
  );
}

// Sized on DESIGN.md's 8px grid (spacing.unit) rather than the 4px Tailwind
// steps the mockups happen to use; 288 matches the mobile mockup's w-72.
const RING_SIZE = spacing.unit * 36;

const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.containerPaddingMobile,
    paddingVertical: theme.spacing.sectionGap,
    gap: theme.spacing.sectionGap,
  },
  // DESIGN.md > Typography > Hierarchy: the "wide-tracked uppercase Label",
  // taken verbatim from the labelMd level.
  label: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    lineHeight: theme.typography.labelMd.lineHeight,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    textTransform: "uppercase",
    color: theme.colors.onSurfaceVariant,
  },
  status: {
    color: theme.colors.tertiary,
  },
  statusCompleted: {
    color: theme.colors.primary,
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    position: "absolute",
    inset: theme.spacing.gutter,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.tertiary,
    opacity: 0.2,
  },
  dial: {
    width: RING_SIZE - theme.spacing.gutter * 2,
    height: RING_SIZE - theme.spacing.gutter * 2,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  clock: {
    fontFamily: theme.typography.displayLg.fontFamily,
    fontSize: theme.typography.displayLg.fontSize,
    lineHeight: theme.typography.displayLg.lineHeight,
    letterSpacing: theme.typography.displayLg.letterSpacing,
    color: theme.colors.primary,
    fontVariant: ["tabular-nums"],
  },
  clockCaption: {
    marginTop: theme.spacing.unit,
  },
  pickerBlock: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: theme.spacing.unit,
  },
  pickerLocked: {
    opacity: 0.4,
  },
  pickerHost: {
    alignSelf: "stretch",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.unit * 4,
  },
}));
