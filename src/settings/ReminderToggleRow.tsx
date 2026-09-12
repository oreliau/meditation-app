import { Switch, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type Props = {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ReminderToggleRow({
  title,
  description,
  value,
  onValueChange,
}: Props) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={title}
        trackColor={{
          false: theme.colors.surfaceVariant,
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.surfaceContainerLowest}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.gutter,
    paddingVertical: theme.spacing.gutter,
  },
  rowText: {
    flex: 1,
    gap: theme.spacing.unit / 2,
  },
  rowTitle: {
    fontFamily: theme.typography.bodyLg.fontFamily,
    fontSize: theme.typography.bodyLg.fontSize,
    lineHeight: theme.typography.bodyLg.lineHeight,
    color: theme.colors.onSurface,
  },
  rowDescription: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
}));
