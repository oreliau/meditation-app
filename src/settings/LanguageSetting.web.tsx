import { StyleSheet } from "react-native-unistyles";
import {
  getLanguageName,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  useI18n,
} from "@/i18n";

export function LanguageSetting() {
  const { language, setLanguage, t } = useI18n();
  const styles = useLanguageStyles();
  return (
    <label style={styles.container}>
      <span style={styles.label}>{t("language")}</span>
      <select
        aria-label={t("language")}
        value={language}
        onChange={(event) => {
          void setLanguage(event.target.value as SupportedLanguage);
        }}
        style={styles.select}
      >
        {SUPPORTED_LANGUAGES.map((option) => (
          <option key={option} value={option}>
            {getLanguageName(option, language)}
          </option>
        ))}
      </select>
    </label>
  );
}

const useLanguageStyles = () =>
  StyleSheet.create((theme) => ({
    container: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing.unit,
    },
    label: {
      color: theme.colors.onSurface,
      fontFamily: theme.typography.labelMd.fontFamily,
    },
    select: {
      color: theme.colors.onSurface,
      backgroundColor: theme.colors.surfaceContainerLowest,
      borderColor: theme.colors.outlineVariant,
      borderRadius: theme.radius.md,
      padding: theme.spacing.unit,
    },
  }));
