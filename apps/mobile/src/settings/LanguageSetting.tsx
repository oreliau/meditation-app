import { Linking } from "react-native";
import { useI18n } from "@/i18n";
import { SectionListWithDivider } from "./list-with-divider/section-list-with-divider";

export function LanguageSetting() {
  const { t, language } = useI18n();

  return (
    <SectionListWithDivider
      data={[
        {
          title: t("language"),
          description: t("languageDescription"),
          type: "button",
          value: t("languageCode", { language }),
          onValueChange: () => Linking.openSettings(),
        },
      ]}
    />
  );
}
