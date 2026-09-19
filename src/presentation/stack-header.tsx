import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface StackHeaderProps {
  title: string;
  description: string;
}

export const StackHeader = ({ title, description }: StackHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
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
  container: {
    marginBottom: {
      xs: theme.spacing.containerPaddingMobile,
      lg: theme.spacing.containerPaddingDesktop,
    },
  },
}));
