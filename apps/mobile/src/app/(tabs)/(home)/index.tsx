import { Button, Column, Host, Row } from "@expo/ui";
import { getProgram } from "@meditation-app/explorer";
import { ensureNotificationPermission } from "@meditation-app/notifications";
import { spacing } from "@meditation-app/theme";
import type { SessionStatus } from "@meditation-app/timer";
import {
  DURATION_PRESETS_MINUTES,
  type DurationMinutes,
  formatClock,
  formatDurationLabel,
  isSessionEndAlertEnabled,
  setSessionEndAlertEnabled,
} from "@meditation-app/timer";
import { useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ComponentProps, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button as AppButton } from "@/components/Button";
import { ControlButton } from "@/features/timer/ControlButton";
import { GlassPanel } from "@/features/timer/GlassPanel";
import { ProgressRing } from "@/features/timer/ProgressRing";
import { useTimerSession } from "@/features/timer/useTimerSession";
import { useI18n } from "@/i18n";
import { AdaptiveBackground } from "@/presentation/adaptive-background/adaptive-background";

// UI copy uses the CONTEXT.md session vocabulary verbatim; only Completed
// gets a fuller phrase since it's the one state with feedback attached.
const _statusCopy: Record<SessionStatus, string> = {
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
    <AppButton onPress={handlePress}>
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
    </AppButton>
  );
};

type TimerSession = Omit<
  ReturnType<typeof useTimerSession>,
  "isActive" | "setDurationMinutes" | "setProgramContext"
>;
type AnimatedViewStyle = ComponentProps<typeof Animated.View>["style"];

type DurationEditorProps = {
  draftDuration: DurationMinutes;
  elapsedMs: number;
  status: SessionStatus;
  canChangeDuration: boolean;
  onSelectDuration: (duration: DurationMinutes) => void;
  onCancel: () => void;
  onApply: () => void;
};

const DurationEditor = ({
  draftDuration,
  elapsedMs,
  status,
  canChangeDuration,
  onSelectDuration,
  onCancel,
  onApply,
}: DurationEditorProps) => {
  const { theme, rt } = useUnistyles();
  const { t } = useI18n();

  return (
    <View style={styles.editor}>
      <Text accessibilityRole="header" style={styles.label}>
        {t("totalDuration")}
      </Text>
      <Text style={styles.editorHint}>
        {status === "Paused" ? t("sessionPaused") : t("chooseDuration")}
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
                      disabled={minutes * 60_000 <= elapsedMs}
                      onPress={() => onSelectDuration(minutes)}
                    />
                  ),
                )}
              </Row>
            ),
          )}
          <Row spacing={16}>
            <Button label={t("cancel")} variant="text" onPress={onCancel} />
            <Button
              label={t("apply")}
              disabled={
                !canChangeDuration || draftDuration * 60_000 <= elapsedMs
              }
              onPress={onApply}
            />
          </Row>
        </Column>
      </Host>
      {elapsedMs > 0 && (
        <Text style={styles.editorHint}>{t("durationUnavailable")}</Text>
      )}
    </View>
  );
};

type TimerDialProps = {
  session: TimerSession;
  canEdit: boolean;
  animatedStyle: AnimatedViewStyle;
  onOpenDurationEditor: () => void;
};

const TimerDial = ({
  session,
  canEdit,
  animatedStyle,
  onOpenDurationEditor,
}: TimerDialProps) => (
  <TimerDialContent
    session={session}
    canEdit={canEdit}
    animatedStyle={animatedStyle}
    onOpenDurationEditor={onOpenDurationEditor}
  />
);

const TimerDialContent = ({
  session,
  canEdit,
  animatedStyle,
  onOpenDurationEditor,
}: TimerDialProps) => {
  const { t } = useI18n();

  return (
    <View style={styles.ring}>
      <ProgressRing size={RING_SIZE} progress={session.progress} />
      <Animated.View style={[styles.innerRing, animatedStyle]} />
      <GlassPanel style={styles.dial}>
        <NotificationBell />
        <Text style={[styles.label, styles.clockCaption]}>
          {t("remaining")}
        </Text>
        <AppButton
          accessibilityRole="button"
          accessibilityLabel={`${formatClock(session.remainingSeconds)} ${t("remaining")}. ${t("changeDuration")}`}
          accessibilityHint={t("durationHint")}
          accessibilityState={{ disabled: !canEdit }}
          testID="session-duration"
          disabled={!canEdit}
          onPress={onOpenDurationEditor}
        >
          <Text style={styles.clock}>
            {formatClock(session.remainingSeconds)}
          </Text>
          {canEdit && (
            <Text style={styles.editLabel}>{t("changeDuration")}</Text>
          )}
        </AppButton>
      </GlassPanel>
    </View>
  );
};

export default function TimerScreen() {
  const { t } = useI18n();
  const { isActive, setDurationMinutes, setProgramContext, ...session } =
    useTimerSession();
  const params = useLocalSearchParams<{
    programId?: string;
    sessionId?: string;
  }>();
  const progress = useSharedValue(0);
  const programId =
    typeof params.programId === "string" ? params.programId : undefined;
  const sessionId =
    typeof params.sessionId === "string" ? params.sessionId : undefined;
  const programSession =
    programId && sessionId
      ? getProgram(programId)?.sessions.find((item) => item.id === sessionId)
      : undefined;

  useEffect(() => {
    if (session.status !== "Running") {
      progress.set(withSpring(0));
    } else {
      progress.set(withRepeat(withTiming(1, { duration: 5_000 }), -1, true));
    }

    return () => {
      cancelAnimation(progress);
    };
  }, [session.status, progress]);

  useEffect(() => {
    if (programId && sessionId && programSession) {
      // biome-ignore lint/nursery/useReactCompiler: setProgramContext mutates the external sessionStore, not React state.
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

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: interpolate(progress.get(), [0, 1], [1, 1.2]) }],
      opacity: interpolate(progress.get(), [0, 1], [0, 0.1]),
    }),
    [progress],
  );

  const isRunning = session.status === "Running";
  const [draftDuration, setDraftDuration] = useState<DurationMinutes>();
  const isEditing = draftDuration !== undefined;
  const canEdit = !session.programContext && !programSession;

  useEffect(() => {
    if (!canEdit && draftDuration !== undefined) {
      // biome-ignore lint/nursery/useReactCompiler: close an editor that became invalid when program context changed.
      setDraftDuration(undefined);
    }
  }, [canEdit, draftDuration]);

  const openDurationEditor = () => {
    if (!canEdit) return;
    session.pause();
    setDraftDuration(session.durationMinutes);
  };

  return (
    <View style={{ flex: 1 }}>
      <AdaptiveBackground />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {isEditing ? (
          <DurationEditor
            draftDuration={draftDuration}
            elapsedMs={session.elapsedMs}
            status={session.status}
            canChangeDuration={session.canChangeDuration}
            onSelectDuration={setDraftDuration}
            onCancel={() => setDraftDuration(undefined)}
            onApply={() => {
              setDurationMinutes(draftDuration);
              setDraftDuration(undefined);
            }}
          />
        ) : (
          <TimerDial
            session={session}
            canEdit={canEdit}
            animatedStyle={animatedStyle}
            onOpenDurationEditor={openDurationEditor}
          />
        )}

        <View style={styles.controls}>
          <ControlButton
            icon="restart"
            label={t("restart")}
            disabled={isEditing}
            onPress={session.restart}
          />
          <ControlButton
            primary
            icon={isRunning ? "pause" : "play"}
            label={
              isRunning
                ? t("pause")
                : session.status === "Paused"
                  ? t("resume")
                  : t("play")
            }
            disabled={isEditing}
            onPress={isRunning ? session.pause : session.play}
          />
          <ControlButton
            icon={session.isVolumeEnabled ? "volume" : "volume_off"}
            label={t("volume")}
            onPress={session.toggleVolume}
          />
        </View>
      </ScrollView>
    </View>
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
    inset: 0,
    borderRadius: theme.radius.full,
    width: RING_SIZE,
    height: RING_SIZE,
    borderWidth: 2,
    // borderColor: "red",
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
