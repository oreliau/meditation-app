import { FlatList, type FlatListProps, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import {
  CardWithDivider,
  type CardWithDividerProps,
} from "./card-with-divider";

interface SectionListWithDividerProps
  extends Omit<FlatListProps<CardWithDividerProps>, "renderItem"> {
  title: string;
}

export function SectionListWithDivider({
  title,
  ...props
}: SectionListWithDividerProps) {
  return (
    <FlatList
      scrollEnabled={false}
      style={styles.screen}
      contentContainerStyle={styles.card}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => <CardWithDivider {...item} />}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      {...props}
    />
  );
}
const styles = StyleSheet.create((theme) => ({
  screen: {
    flex: 1,
    marginBottom: theme.spacing.gutter,
  },
  content: {
    padding: theme.spacing.containerPaddingMobile,
    gap: theme.spacing.unit,
  },
  headline: {
    fontFamily: theme.typography.headlineMd.fontFamily,
    fontSize: theme.typography.headlineMd.fontSize,
    lineHeight: theme.typography.headlineMd.lineHeight,
    color: theme.colors.primary,
  },
  subtitle: {
    fontFamily: theme.typography.bodyMd.fontFamily,
    fontSize: theme.typography.bodyMd.fontSize,
    lineHeight: theme.typography.bodyMd.lineHeight,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.sectionGap / 2,
  },
  sectionTitle: {
    fontFamily: theme.typography.titleLg.fontFamily,
    fontSize: theme.typography.titleLg.fontSize,
    lineHeight: theme.typography.titleLg.lineHeight,
    letterSpacing: theme.typography.titleLg.letterSpacing,
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  card: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
}));
