import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Button } from "@/components/Button";
import { ADVICE, PROGRAMS, type Program } from "@/features/explorer/programs";
import { getProgramProgress } from "@/features/explorer/progress";
import { useExplorerProgress } from "@/features/explorer/useExplorerProgress";
import { useI18n } from "@/i18n";
import { StackHeader } from "@/presentation/stack-header";
import { getDailyStats } from "@/stats/dailyStats";

function ProgramCard({
  program,
  continueCard = false,
}: {
  program: Program;
  continueCard?: boolean;
}) {
  const { t } = useI18n();
  const progress = getProgramProgress(program.id);
  const next = program.sessions[progress.completed];

  return (
    <Link href={`/explorer/${program.id}` as never} asChild>
      <Button style={styles.card} accessibilityRole="button">
        <View style={styles.cardHeader}>
          <Text style={styles.cardEyebrow}>
            {continueCard
              ? t("continue")
              : `${program.sessions.length} ${t("sessions")}`}
          </Text>
          <Text style={styles.cardProgress}>
            {progress.completed}/{progress.total}
          </Text>
        </View>
        <Text style={styles.cardTitle}>{t(program.title)}</Text>
        <Text style={styles.cardDescription}>{t(program.description)}</Text>
        <Text style={styles.cardAction}>
          {progress.isComplete
            ? `${t("completed")} · ${t("restart")}`
            : `${t("next")} · ${next ? t(next.title) : t("begin")}`}
        </Text>
      </Button>
    </Link>
  );
}

export default function ExplorerScreen() {
  const { t } = useI18n();
  useExplorerProgress();
  const dailyStats = getDailyStats();
  const continuing = PROGRAMS.find((program) => {
    const progress = getProgramProgress(program.id);
    return progress.completed > 0 && !progress.isComplete;
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <StackHeader title={t("explore")} description={t("exploreDescription")} />

      {continuing ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("continuePractice")}</Text>
          <ProgramCard program={continuing} continueCard />
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("availablePrograms")}</Text>
        {PROGRAMS.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today’s practice</Text>
        <View style={styles.summaryCard}>
          {dailyStats.sessionCount === 0 ? (
            <>
              <Text style={styles.summaryTitle}>
                No sessions completed today
              </Text>
              <Text style={styles.summaryBody}>
                A few quiet minutes is a good place to begin.
              </Text>
              <Link href="/" asChild>
                <Button>
                  <Text style={styles.inlineAction}>Begin a session</Text>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Text style={styles.summaryTitle}>
                {dailyStats.sessionCount} completed session
                {dailyStats.sessionCount === 1 ? "" : "s"}
              </Text>
              <Text style={styles.summaryBody}>
                {Math.round(dailyStats.totalDurationSeconds / 60)} minutes of
                practice today.
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advice</Text>
        {ADVICE.map((advice) => (
          <View key={advice.id} style={styles.adviceCard}>
            <Text style={styles.adviceTitle}>{advice.title}</Text>
            <Text style={styles.adviceBody}>{advice.body}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { flex: 1, backgroundColor: "transparent" },
  content: {
    padding: theme.spacing.containerPaddingMobile,
    gap: theme.spacing.gutter,
    paddingBottom: theme.spacing.sectionGap,
    maxWidth: theme.maxWidth,
    width: "100%",
    marginHorizontal: "auto",
    _web: {
      paddingTop: 50,
    },
  },
  headline: {
    fontFamily: theme.typography.headlineMd.fontFamily,
    fontSize: theme.typography.headlineMd.fontSize,
    lineHeight: theme.typography.headlineMd.lineHeight,
    color: theme.colors.onBackground,
  },
  subtitle: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.gutter,
  },
  section: { gap: theme.spacing.gutter, marginBottom: theme.spacing.gutter },
  sectionTitle: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.titleLg.fontSize,
    lineHeight: theme.typography.titleLg.lineHeight,
    color: theme.colors.primary,
  },
  card: {
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    gap: theme.spacing.unit,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  cardEyebrow: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.tertiary,
    textTransform: "uppercase",
  },
  cardProgress: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  cardTitle: {
    fontFamily: theme.typography.headlineMdMobile.fontFamily,
    fontSize: theme.typography.headlineMdMobile.fontSize,
    lineHeight: theme.typography.headlineMdMobile.lineHeight,
    color: theme.colors.onSurface,
  },
  cardDescription: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
  cardAction: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    color: theme.colors.primary,
  },
  summaryCard: {
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primaryContainer,
    gap: theme.spacing.unit,
  },
  summaryTitle: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.titleLg.fontSize,
    color: theme.colors.onPrimaryContainer,
  },
  summaryBody: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onPrimaryContainer,
  },
  inlineAction: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.labelMd.fontSize,
    color: theme.colors.primary,
    marginTop: theme.spacing.unit,
  },
  adviceCard: {
    paddingVertical: theme.spacing.unit * 2,
    gap: theme.spacing.unit,
  },
  adviceTitle: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.titleLg.fontSize,
    color: theme.colors.onSurface,
  },
  adviceBody: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
}));
