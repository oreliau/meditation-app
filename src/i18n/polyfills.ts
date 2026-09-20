import "@formatjs/intl-getcanonicallocales/polyfill.js";
import "@formatjs/intl-locale/polyfill.js";
import "@formatjs/intl-listformat/polyfill.js";
import "@formatjs/intl-datetimeformat/polyfill.js";
import "@formatjs/intl-displaynames/polyfill.js";
import "@formatjs/intl-pluralrules/polyfill.js";
import "@formatjs/intl-numberformat/polyfill.js";

type LocaleLoader = () => Promise<unknown[]>;
const load = (...modules: Promise<unknown>[]) => Promise.all(modules);
const localeLoaders: Record<string, LocaleLoader> = {
  en: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/en.js"),
      import("@formatjs/intl-datetimeformat/locale-data/en.js"),
      import("@formatjs/intl-displaynames/locale-data/en.js"),
      import("@formatjs/intl-pluralrules/locale-data/en.js"),
      import("@formatjs/intl-numberformat/locale-data/en.js"),
    ),
  fr: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/fr.js"),
      import("@formatjs/intl-datetimeformat/locale-data/fr.js"),
      import("@formatjs/intl-displaynames/locale-data/fr.js"),
      import("@formatjs/intl-pluralrules/locale-data/fr.js"),
      import("@formatjs/intl-numberformat/locale-data/fr.js"),
    ),
  es: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/es.js"),
      import("@formatjs/intl-datetimeformat/locale-data/es.js"),
      import("@formatjs/intl-displaynames/locale-data/es.js"),
      import("@formatjs/intl-pluralrules/locale-data/es.js"),
      import("@formatjs/intl-numberformat/locale-data/es.js"),
    ),
  pt: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/pt.js"),
      import("@formatjs/intl-datetimeformat/locale-data/pt.js"),
      import("@formatjs/intl-displaynames/locale-data/pt.js"),
      import("@formatjs/intl-pluralrules/locale-data/pt.js"),
      import("@formatjs/intl-numberformat/locale-data/pt.js"),
    ),
  de: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/de.js"),
      import("@formatjs/intl-datetimeformat/locale-data/de.js"),
      import("@formatjs/intl-displaynames/locale-data/de.js"),
      import("@formatjs/intl-pluralrules/locale-data/de.js"),
      import("@formatjs/intl-numberformat/locale-data/de.js"),
    ),
  it: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/it.js"),
      import("@formatjs/intl-datetimeformat/locale-data/it.js"),
      import("@formatjs/intl-displaynames/locale-data/it.js"),
      import("@formatjs/intl-pluralrules/locale-data/it.js"),
      import("@formatjs/intl-numberformat/locale-data/it.js"),
    ),
  ja: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/ja.js"),
      import("@formatjs/intl-datetimeformat/locale-data/ja.js"),
      import("@formatjs/intl-displaynames/locale-data/ja.js"),
      import("@formatjs/intl-pluralrules/locale-data/ja.js"),
      import("@formatjs/intl-numberformat/locale-data/ja.js"),
    ),
  ko: () =>
    load(
      import("@formatjs/intl-listformat/locale-data/ko.js"),
      import("@formatjs/intl-datetimeformat/locale-data/ko.js"),
      import("@formatjs/intl-displaynames/locale-data/ko.js"),
      import("@formatjs/intl-pluralrules/locale-data/ko.js"),
      import("@formatjs/intl-numberformat/locale-data/ko.js"),
    ),
  "zh-CN": () =>
    load(
      import("@formatjs/intl-listformat/locale-data/zh.js"),
      import("@formatjs/intl-datetimeformat/locale-data/zh.js"),
      import("@formatjs/intl-displaynames/locale-data/zh.js"),
      import("@formatjs/intl-pluralrules/locale-data/zh.js"),
      import("@formatjs/intl-numberformat/locale-data/zh.js"),
    ),
};

const loaded = new Set<string>();

export async function loadPolyfills(locale: string): Promise<void> {
  const normalized =
    locale.toLowerCase() === "zh-cn"
      ? "zh-CN"
      : locale.split("-")[0].toLowerCase();
  const key = localeLoaders[normalized] ? normalized : "en";
  if (loaded.has(key)) return;
  await localeLoaders[key]();
  loaded.add(key);
}
