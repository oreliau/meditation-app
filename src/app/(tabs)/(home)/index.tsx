import { Column, Picker } from "@expo/ui";
import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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
import {
  isSessionEndAlertEnabled,
  setSessionEndAlertEnabled,
} from "@/features/timer/sessionEndAlertStorage";
import { useTimerSession } from "@/features/timer/useTimerSession";
import { AdaptiveBackground } from "@/presentation/adaptive-background/adaptive-background";
import { PresentationSheet } from "@/presentation/presentation-sheet/presentation-sheet";
import { ensureNotificationPermission } from "@/reminders/permission";
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

const NotificationBell = () => {
  const { theme } = useUnistyles();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(
    isSessionEndAlertEnabled(),
  );

  useEffect(() => {
    setSessionEndAlertEnabled(isNotificationEnabled);
  }, [isNotificationEnabled]);

  const handlePress = async () => {
    if (!isNotificationEnabled) {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        return;
      }
      setIsNotificationEnabled(true);

      return;
    }

    setIsNotificationEnabled(false);
  };

  return (
    <Pressable onPress={handlePress}>
      {isNotificationEnabled ? (
        <SymbolView
          name={{
            ios: "bell",
            android: "notifications",
            web: "notifications",
          }}
          size={24}
          tintColor={theme.colors.primary}
          type="monochrome"
        />
      ) : (
        <SymbolView
          name={{
            ios: "bell.slash",
            android: "notifications_off",
            web: "notifications_off",
          }}
          size={24}
          tintColor={`${theme.colors.primary}80`}
          type="monochrome"
        />
      )}
    </Pressable>
  );
};

export default function TimerScreen() {
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
      <AdaptiveBackground />
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
            <NotificationBell />
            <Text style={[styles.label, styles.clockCaption]}>Remaining</Text>
            <PresentationSheet>
              <PresentationSheet.Trigger>
                <Text
                  style={styles.clock}
                  accessibilityLabel={`${formatClock(session.remainingSeconds)} remaining`}
                >
                  {formatClock(session.remainingSeconds)}
                </Text>
              </PresentationSheet.Trigger>

              <PresentationSheet.Content>
                {(close) => (
                  <Column>
                    <Picker
                      appearance="wheel"
                      selectedValue={session.durationMinutes}
                      onValueChange={(value) => {
                        setDurationMinutes(value);
                        close();
                      }}
                      enabled={
                        session.canChangeDuration && !session.programContext
                      }
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
                  </Column>
                )}
              </PresentationSheet.Content>
            </PresentationSheet>
          </GlassPanel>
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
            icon={session.isVolumeEnabled ? "volume" : "volume_off"}
            label="Volume"
            onPress={session.toggleVolume}
          />
        </View>
      </ScrollView>
    </>
  );
}

// Sized on DESIGN.md's 8px grid (spacing.unit) rather than the 4px Tailwind
// steps the mockups happen to use; 288 matches the mobile mockup's w-72.
const RING_SIZE = spacing.unit * 36;

const styles = StyleSheet.create((theme, rt) => ({
  pickerHost: {},
  screen: {
    flex: 1,
  },
  toggleButton: {
    position: "absolute",
    top: 0 + rt.insets.top,
    right: 0,
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
    overflow: "hidden",
  },
  clock: {
    fontFamily: theme.typography.displayLg.fontFamily,
    fontSize: 80,
    lineHeight: 90,
    letterSpacing: theme.typography.displayLg.letterSpacing,
    color: theme.colors.onSurface,
  },
  clockCaption: {
    marginTop: theme.spacing.unit,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.unit * 4,
  },
}));
