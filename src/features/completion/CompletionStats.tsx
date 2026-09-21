import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { formatClock } from "@/features/timer";
import { GlassPanel } from "@/features/timer/GlassPanel";
import { useI18n } from "@/i18n";

type Props = {
  durationMinutes: number;
  // Only present when the just-finished session belonged to a Program.
  program?: { completed: number; total: number };
};

// Real data only (see the completion-screen interview): session duration is
// always shown; Program progress only when the session had one. No streak or
// heart-rate cards — neither has a backing data source anywhere in the app.
export function CompletionStats({ durationMinutes, program }: Props) {
  const { t } = useI18n();
  return (
    <View style={styles.row}>
      <StatCard
        icon="schedule"
        value={formatClock(durationMinutes * 60)}
        label={t("meditation")}
      />
      {program && (
        <StatCard
          icon="auto-awesome"
          value={`${program.completed}/${program.total}`}
          label={t("program")}
        />
      )}
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
  label: string;
}) {
  const { theme } = useUnistyles();

  return (
    <GlassPanel style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialIcons name={icon} size={16} color={theme.colors.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </GlassPanel>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    gap: theme.spacing.unit * 1.5,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    maxWidth: 160,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.gutter,
    paddingHorizontal: theme.spacing.unit,
    alignItems: "center",
    gap: theme.spacing.unit / 2,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    // Hex alpha suffix: 1A = 10%, matching DESIGN.md's glass-layer fill.
    backgroundColor: `${theme.colors.primary}1A`,
  },
  value: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.titleLg.fontSize,
    color: theme.colors.onSurface,
    fontVariant: ["tabular-nums"],
  },
  label: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: theme.colors.onSurfaceVariant,
  },
}));
