import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button } from "@/components/Button";
import type { IconName } from "./content";

type Props = {
  icon: IconName;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  // "checkbox" for multi-select (intentions), "radio" for single-select
  // (duration, moment of day, soundscape).
  indicator: "checkbox" | "radio";
};

export function SelectableCard({
  icon,
  title,
  description,
  selected,
  onPress,
  indicator,
}: Props) {
  const { theme } = useUnistyles();

  return (
    <Button
      onPress={onPress}
      role={indicator}
      accessibilityRole={indicator === "checkbox" ? "checkbox" : "radio"}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={title}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.iconCircle}>
        <MaterialIcons name={icon} size={20} color={theme.colors.onSurface} />
      </View>

      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <MaterialIcons
        name={
          indicator === "checkbox"
            ? selected
              ? "check-circle"
              : "radio-button-unchecked"
            : selected
              ? "radio-button-checked"
              : "radio-button-unchecked"
        }
        size={22}
        color={selected ? theme.colors.primary : theme.colors.outline}
      />
    </Button>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.gutter,
    padding: theme.spacing.gutter,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: "transparent",
  },
  cardSelected: {
    backgroundColor: theme.colors.primaryContainer,
    borderColor: theme.colors.primary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  text: {
    flex: 1,
    gap: theme.spacing.unit / 4,
  },
  title: {
    fontFamily: theme.typography.labelMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurface,
  },
  description: {
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: theme.typography.caption.fontSize,
    lineHeight: theme.typography.caption.lineHeight,
    color: theme.colors.onSurfaceVariant,
  },
}));
