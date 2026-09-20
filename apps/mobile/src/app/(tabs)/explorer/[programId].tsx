import {
  getCompletedSessionIds,
  getProgram,
  getProgramProgress,
  resetProgramProgress,
} from "@meditation-app/explorer";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/components/Button";
import { useExplorerProgress } from "@/features/explorer/useExplorerProgress";
import { formatNumber, useI18n } from "@/i18n";

export default function ProgramDetailScreen() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const styles = useProgramDetailStyles();
  const program = getProgram(programId);
  const { language, t } = useI18n();
  useExplorerProgress(programId);

  if (!program) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{t("programNotFound")}</Text>
      </View>
    );
  }

  const progress = getProgramProgress(program.id);
  const completed = new Set(getCompletedSessionIds(program.id));
  const nextIndex = progress.completed;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <Stack.Screen
        options={{
          headerBackButtonMenuEnabled: true,
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          title: `${t("program")}: ${program.title}`,
        }}
      />

      <Text style={styles.progress}>
        {t("progressComplete", {
          completed: formatNumber(progress.completed, language),
          total: formatNumber(progress.total, language),
          sessions: t("sessions"),
        })}
      </Text>

      <View style={styles.sessions}>
        {program.sessions.map((session, index) => {
          const isCompleted = completed.has(session.id);
          const isNext = index === nextIndex && !progress.isComplete;
          return (
            <View
              key={session.id}
              style={[styles.session, isNext && styles.sessionNext]}
            >
              <View style={styles.sessionNumber}>
                <Text style={styles.sessionNumberText}>
                  {isCompleted ? "✓" : index + 1}
                </Text>
              </View>
              <View style={styles.sessionCopy}>
                <Text style={styles.sessionTitle}>{t(session.title)}</Text>
                <Text style={styles.sessionDescription}>
                  {t(session.description)}
                </Text>
                <Text style={styles.sessionDuration}>
                  {formatNumber(session.durationMinutes, language)} {t("min")}
                </Text>
              </View>
              {isNext && (
                <Link
                  href={{
                    pathname: "/",
                    params: { programId: program.id, sessionId: session.id },
                  }}
                  asChild
                >
                  <Button style={styles.startButton}>
                    <Text style={styles.startButtonText}>{t("prepare")}</Text>
                  </Button>
                </Link>
              )}
            </View>
          );
        })}
      </View>

      {progress.isComplete && (
        <Button
          style={styles.restartButton}
          onPress={() => {
            resetProgramProgress(program.id);
          }}
        >
          <Text style={styles.restartText}>{t("restartProgram")}</Text>
        </Button>
      )}
    </ScrollView>
  );
}

function useProgramDetailStyles() {
  return StyleSheet.create((theme) => ({
    screen: { flex: 1, backgroundColor: "transparent" },
    content: {
      padding: theme.spacing.containerPaddingMobile,
      gap: theme.spacing.gutter,
      paddingBottom: theme.spacing.sectionGap,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    title: {
      fontFamily: theme.typography.headlineMd.fontFamily,
      fontSize: theme.typography.headlineMd.fontSize,
      lineHeight: theme.typography.headlineMd.lineHeight,
      color: theme.colors.onBackground,
    },
    description: {
      fontFamily: theme.typography.bodyLg.fontFamily,
      fontSize: theme.typography.bodyLg.fontSize,
      lineHeight: theme.typography.bodyLg.lineHeight,
      color: theme.colors.onSurfaceVariant,
    },
    progress: {
      fontFamily: theme.typography.labelMd.fontFamily,
      fontSize: theme.typography.labelMd.fontSize,
      color: theme.colors.tertiary,
      textTransform: "uppercase",
      letterSpacing: theme.typography.labelMd.letterSpacing,
    },
    sessions: { gap: theme.spacing.unit * 2, marginTop: theme.spacing.gutter },
    session: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.gutter,
      padding: theme.spacing.gutter,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surfaceContainerLowest,
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    sessionNext: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryContainer,
    },
    sessionNumber: {
      width: theme.spacing.unit * 4,
      height: theme.spacing.unit * 4,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surfaceContainerHigh,
      alignItems: "center",
      justifyContent: "center",
    },
    sessionNumberText: {
      fontFamily: theme.typography.labelMd.fontFamily,
      fontSize: theme.typography.labelMd.fontSize,
      color: theme.colors.onSurface,
    },
    sessionCopy: { flex: 1, gap: theme.spacing.unit / 2 },
    sessionTitle: {
      fontFamily: theme.typography.titleLg.fontFamily,
      fontSize: theme.typography.titleLg.fontSize,
      color: theme.colors.onSurface,
    },
    sessionDescription: {
      fontFamily: theme.typography.bodyMd.fontFamily,
      fontSize: theme.typography.bodyMd.fontSize,
      lineHeight: theme.typography.bodyMd.lineHeight,
      color: theme.colors.onSurfaceVariant,
    },
    sessionDuration: {
      fontFamily: theme.typography.caption.fontFamily,
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.tertiary,
    },
    startButton: {
      alignSelf: "center",
      paddingVertical: theme.spacing.unit,
      paddingHorizontal: theme.spacing.gutter,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
    },
    startButtonText: {
      fontFamily: theme.typography.labelMd.fontFamily,
      fontSize: theme.typography.labelMd.fontSize,
      color: theme.colors.onPrimary,
    },
    restartButton: {
      alignItems: "center",
      padding: theme.spacing.gutter,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    restartText: {
      fontFamily: theme.typography.labelMd.fontFamily,
      fontSize: theme.typography.labelMd.fontSize,
      color: theme.colors.primary,
    },
  }));
}
