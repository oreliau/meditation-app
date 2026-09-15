import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { getProgram } from "@/features/explorer/programs";
import {
  getCompletedSessionIds,
  getProgramProgress,
  resetProgramProgress,
} from "@/features/explorer/progress";
import { useExplorerProgress } from "@/features/explorer/useExplorerProgress";

export default function ProgramDetailScreen() {
  const { programId } = useLocalSearchParams<{ programId: string }>();
  const styles = useProgramDetailStyles();
  const program = getProgram(programId);
  useExplorerProgress(programId);

  if (!program) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Program not found</Text>
      </View>
    );
  }

  const progress = getProgramProgress(program.id);
  const completed = new Set(getCompletedSessionIds(program.id));
  const nextIndex = progress.completed;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: program.title }} />
      <Text style={styles.title}>{program.title}</Text>
      <Text style={styles.description}>{program.description}</Text>
      <Text style={styles.progress}>
        {progress.completed} of {progress.total} sessions complete
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
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionDescription}>
                  {session.description}
                </Text>
                <Text style={styles.sessionDuration}>
                  {session.durationMinutes} min
                </Text>
              </View>
              {isNext && (
                <Link
                  href={{
                    pathname: "/timer",
                    params: { programId: program.id, sessionId: session.id },
                  }}
                  asChild
                >
                  <Pressable style={styles.startButton}>
                    <Text style={styles.startButtonText}>Prepare</Text>
                  </Pressable>
                </Link>
              )}
            </View>
          );
        })}
      </View>

      {progress.isComplete && (
        <Pressable
          style={styles.restartButton}
          onPress={() => {
            resetProgramProgress(program.id);
          }}
        >
          <Text style={styles.restartText}>Restart program</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function useProgramDetailStyles() {
  return StyleSheet.create((theme) => ({
    screen: { flex: 1, backgroundColor: theme.colors.background },
    content: {
      padding: theme.spacing.containerPaddingMobile,
      gap: theme.spacing.gutter,
      paddingBottom: theme.spacing.sectionGap,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
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
