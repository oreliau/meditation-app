import { Button, Column, Host, Row } from "@expo/ui";
import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { getProgram } from "@/features/explorer/programs";
import { ControlButton } from "@/features/timer/ControlButton";
import {
  DURATION_PRESETS_MINUTES,
  type DurationMinutes,
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
  const isSessionEndAlertEnabledInitial = isSessionEndAlertEnabled();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(
    isSessionEndAlertEnabledInitial,
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
  const { theme, rt } = useUnistyles();
  const [draftDuration, setDraftDuration] = useState<DurationMinutes>();
  const isEditing = draftDuration !== undefined;
  const canEdit = !session.programContext && !programSession;

  if (!canEdit && draftDuration !== undefined) {
    setDraftDuration(undefined);
  }

  const openDurationEditor = () => {
    if (!canEdit) return;
    session.pause();
    setDraftDuration(session.durationMinutes);
  };

  return (
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

      {isEditing ? (
        <View style={styles.editor}>
          <Text accessibilityRole="header" style={styles.label}>
            Total duration
          </Text>
          <Text style={styles.editorHint}>
            {session.status === "Paused"
              ? "Session paused. Elapsed time is kept."
              : "Choose your session duration."}
          </Text>
          <Host
            matchContents
            colorScheme={rt.themeName === "dark" ? "dark" : "light"}
            seedColor={theme.colors.primary}
          >
            <Column spacing={8}>
              {Array.from(
                { length: Math.ceil(DURATION_PRESETS_MINUTES.length / 3) },
                (_, row) => (
                  <Row key={DURATION_PRESETS_MINUTES[row * 3]} spacing={8}>
                    {DURATION_PRESETS_MINUTES.slice(row * 3, row * 3 + 3).map(
                      (minutes) => (
                        <Button
                          key={minutes}
                          label={`${minutes === draftDuration ? "✓ " : ""}${formatDurationLabel(minutes)}`}
                          variant={
                            minutes === draftDuration ? "filled" : "outlined"
                          }
                          disabled={minutes * 60_000 <= session.elapsedMs}
                          onPress={() => setDraftDuration(minutes)}
                        />
                      ),
                    )}
                  </Row>
                ),
              )}
              <Row spacing={16}>
                <Button
                  label="Cancel"
                  variant="text"
                  onPress={() => setDraftDuration(undefined)}
                />
                <Button
                  label="Apply"
                  disabled={
                    !session.canChangeDuration ||
                    draftDuration * 60_000 <= session.elapsedMs
                  }
                  onPress={() => {
                    setDurationMinutes(draftDuration);
                    setDraftDuration(undefined);
                  }}
                />
              </Row>
            </Column>
          </Host>
          {session.elapsedMs > 0 && (
            <Text style={styles.editorHint}>
              Durations at or below elapsed time are unavailable. Tap Resume
              when ready.
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.ring}>
          <ProgressRing size={RING_SIZE} progress={session.progress} />
          <View style={styles.innerRing} />
          <GlassPanel style={styles.dial}>
            <NotificationBell />
            <Text style={[styles.label, styles.clockCaption]}>Remaining</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${formatClock(session.remainingSeconds)} remaining. Change duration`}
              accessibilityHint="Pauses the session and opens duration choices"
              accessibilityState={{ disabled: !canEdit }}
              disabled={!canEdit}
              onPress={openDurationEditor}
            >
              <Text style={styles.clock}>
                {formatClock(session.remainingSeconds)}
              </Text>
              {canEdit && <Text style={styles.editLabel}>Change duration</Text>}
            </Pressable>
          </GlassPanel>
        </View>
      )}

      <View style={styles.controls}>
        <ControlButton
          icon="restart"
          label="Restart"
          disabled={isEditing}
          onPress={session.restart}
        />
        <ControlButton
          primary
          icon={isRunning ? "pause" : "play"}
          label={
            isRunning
              ? "Pause"
              : session.status === "Paused"
                ? "Resume"
                : "Play"
          }
          disabled={isEditing}
          onPress={isRunning ? session.pause : session.play}
        />
        <ControlButton
          icon={session.isVolumeEnabled ? "volume" : "volume_off"}
          label="Volume"
          onPress={session.toggleVolume}
        />
      </View>
    </ScrollView>
  );
}

// Sized on DESIGN.md's 8px grid (spacing.unit) rather than the 4px Tailwind
// steps the mockups happen to use; 288 matches the mobile mockup's w-72.
const RING_SIZE = spacing.unit * 36;

const styles = StyleSheet.create((theme, rt) => ({
  editor: {
    width: "100%",
    maxWidth: 400,
    gap: theme.spacing.unit * 2,
  },
  editorHint: {
    color: theme.colors.onSurfaceVariant,
    textAlign: "center",
  },
  editLabel: {
    color: theme.colors.primary,
    textAlign: "center",
    paddingVertical: theme.spacing.unit,
  },
  screen: {
    flex: 1,
    backgroundColor: "transparent",
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
