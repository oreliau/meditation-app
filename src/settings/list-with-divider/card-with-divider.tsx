import * as Haptics from "expo-haptics";
import { Platform, Switch, Text, View } from "react-native";
import {
  StyleSheet,
  useUnistyles,
  withUnistyles,
} from "react-native-unistyles";
import { Button } from "@/components/Button";

export type CardWithDividerProps = {
  title: string;
  description: string;
  value: boolean | number | string;
  onValueChange?: (value: boolean | number | string) => void;
  type?: "switch" | "button" | "children";
  children?: React.ReactNode;
};

const _UniButton = withUnistyles(Button);

const Wrapper = ({
  children,
  type,
  onValueChange,
  value,
}: {
  children: React.ReactNode;
  type: "switch" | "button" | "children";
  onValueChange?: (value: boolean | number | string) => void;
  value: boolean | number | string;
}) => {
  if (typeof onValueChange !== "function") {
    return null;
  }

  if (type === "button") {
    return (
      <Button onPress={() => onValueChange(value)} style={{ flex: 1 }}>
        {children}
      </Button>
    );
  }

  return <>{children}</>;
};

const UniSwitch = withUnistyles(Switch);

export function CardWithDivider({
  title,
  description,
  value,
  onValueChange,
  type = "switch",
  children,
}: CardWithDividerProps) {
  const { theme } = useUnistyles();

  return (
    <Wrapper type={type} onValueChange={onValueChange} value={value}>
      <View style={styles.rowContainer}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowDescription}>{description}</Text>
        </View>
        {type === "switch" && (
          <UniSwitch
            value={Boolean(value)}
            onValueChange={(value) => {
              if (Platform.OS !== "web") {
                void Haptics.impactAsync(
                  Haptics.ImpactFeedbackStyle.Medium,
                ).catch(() => {});
              }
              onValueChange?.(value);
            }}
            accessibilityLabel={title}
            trackColor={{
              false: theme.colors.surfaceVariant,
              true: theme.colors.inverseSurface,
            }}
            thumbColor={theme.colors.primary}
          />
        )}

        {type === "button" && (
          <Text style={styles.rowValue}>{String(value)}</Text>
        )}
        {children}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create((theme) => ({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.gutter,
    padding: theme.spacing.gutter,
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  rowText: {
    flex: 1,
    gap: theme.spacing.unit / 2,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  rowTitle: {
    fontFamily: theme.typography.bodyLg.fontFamily,
    fontSize: theme.typography.bodyLg.fontSize,
    lineHeight: theme.typography.bodyLg.lineHeight,
    color: theme.colors.tertiary,
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
