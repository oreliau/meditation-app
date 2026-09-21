import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button } from "@/components/Button";
import { useI18n } from "@/i18n";

const SEGMENTS = [1, 2, 3, 4] as const;

type Props = {
  step: 1 | 2 | 3 | 4;
  label: string;
  onBack: () => void;
};

// Shared header for onboarding steps 2-4: back arrow, a 4-segment progress
// bar (filled up to the current step), and the step's short section label.
export function OnboardingProgressHeader({ step, label, onBack }: Props) {
  const { theme } = useUnistyles();
  const { t } = useI18n();

  return (
    <View style={styles.header}>
      <Button
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t("back")}
        hitSlop={12}
      >
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={theme.colors.onSurface}
        />
      </Button>

      <View style={styles.progressTrack}>
        {SEGMENTS.map((segment) => (
          <View
            key={segment}
            style={[
              styles.progressSegment,
              segment <= step && styles.progressSegmentFilled,
            ]}
          />
        ))}
      </View>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.gutter,
  },
  progressTrack: {
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.unit / 2,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  progressSegmentFilled: {
    backgroundColor: theme.colors.primary,
  },
  label: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    letterSpacing: theme.typography.labelMd.letterSpacing,
    color: theme.colors.onSurfaceVariant,
  },
}));
