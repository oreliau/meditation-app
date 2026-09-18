import { Switch, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Button } from "@/components/Button";

export type CardWithDividerProps = {
  title: string;
  description: string;
  value: boolean | number | string;
  onValueChange: (value: boolean | number | string) => void;
  type?: "switch" | "button";
};

const Wrapper = ({
  children,
  type,
  onValueChange,
  value,
}: {
  children: React.ReactNode;
  type: "switch" | "button";
  onValueChange: (value: boolean | number | string) => void;
  value: boolean | number | string;
}) => {
  if (type === "button") {
    return (
      <Button onPress={() => onValueChange(value)} style={styles.row}>
        {children}
      </Button>
    );
  }
  return <View style={styles.row}>{children}</View>;
};

export function CardWithDivider({
  title,
  description,
  value,
  onValueChange,
  type = "switch",
}: CardWithDividerProps) {
  const { theme } = useUnistyles();

  return (
    <Wrapper type={type} onValueChange={onValueChange} value={value}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      {type === "switch" && (
        <Switch
          value={Boolean(value)}
          onValueChange={onValueChange}
          accessibilityLabel={title}
          trackColor={{
            false: theme.colors.surfaceVariant,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surfaceContainerLowest}
        />
      )}

      {type === "button" && (
        <Text style={styles.rowValue}>{String(value)}</Text>
      )}
    </Wrapper>
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
  rowValue: {
    fontFamily: theme.typography.bodyLg.fontFamily,
    fontSize: theme.typography.bodyLg.fontSize,
    lineHeight: theme.typography.bodyLg.lineHeight,
    color: theme.colors.onSurface,
  },
}));
