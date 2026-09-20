import { isStorageAvailable } from "@meditation-app/storage";
import { getLocales } from "expo-localization";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import { createMMKV } from "react-native-mmkv";
import { loadPolyfills } from "./polyfills";

export const SUPPORTED_LANGUAGES = [
  "en",
  "fr",
  "es",
  "pt",
  "de",
  "it",
  "ja",
  "ko",
  "zh-CN",
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_KEY = "language";
const storage = createMMKV({ id: "lumina-language" });

const languageNames: Record<SupportedLanguage, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  "zh-CN": "简体中文",
};

type MessageValues = Record<string, string | number>;
type Messages = Record<string, string>;

const en: Messages = {
  settings: "Settings",
  settingsDescription: "Shape your inner sanctuary.",
  style: "Style",
  theme: "Theme",
  themeDescription: "Choose your preferred app theme",
  mindfulNotifications: "Mindful notifications",
  morningReminder: "Morning presence reminder",
  morningDescription: "A gentle invitation to be present, every day at 8:00",
  eveningSummary: "Evening summary",
  eveningDescription: "A reflection on today's practice, every day at 18:00",
  sessionEndAlert: "Session-end alert",
  sessionEndDescription:
    "Let me know when my session finishes, even if I've stepped away",
  language: "Language",
  languageDescription: "Choose the language used by Lumina Flow",
  languageCode: "{language}",
  explore: "Explore",
  exploreDescription: "Find a practice for this moment.",
  prepare: "Prepare",
  restart: "Restart",
  done: "Done",
  back: "Back",
  continue: "Continue",
  completed: "Completed",
  next: "Next",
  begin: "Begin",
  continuePractice: "Continue your practice",
  availablePrograms: "Available programs",
  momentOfStillness: "Moment of stillness",
  stillnessDescription:
    "Your mind has settled. Carry this quiet with you through the rest of your day.",
  welcome: "Welcome",
  enterSanctuary: "Enter the Sanctuary",
  meditation: "Meditation",
  program: "Program",
  sessionComplete: "Session complete",
  sessionCompleteBody:
    "Your practice is done. Come back whenever you're ready.",
  morningPresence: "Morning presence",
  dayNotOver:
    "The day isn't over yet. A few quiet breaths before bed still count.",
  showedUp:
    "You showed up for yourself today — {minutes} {minute}, {sessions} {session}. Let that settle in.",
  minute: "minute",
  minutes: "minutes",
  session: "session",
  sessions: "sessions",
  idle: "Idle",
  running: "Running",
  paused: "Paused",
  stopped: "Stopped",
  gentleReminders: "Gentle reminders",
  changeDuration: "Change duration",
  remaining: "remaining",
  sec: "sec",
  secs: "secs",
  min: "min",
  mins: "mins",
  hr: "hr",
  hrs: "hrs",
  languageChanged: "Language changed",
  notificationsDisabled:
    "Notifications are turned off for Lumina Flow. Enable them in your device settings to receive reminders.",
  openDeviceSettings: "Open device settings",
  programNotFound: "Program not found",
  progressComplete: "{completed} of {total} {sessions} complete",
  restartProgram: "Restart program",
  totalDuration: "Total duration",
  sessionPaused: "Session paused. Elapsed time is kept.",
  chooseDuration: "Choose your session duration.",
  cancel: "Cancel",
  apply: "Apply",
  durationUnavailable:
    "Durations at or below elapsed time are unavailable. Tap Resume when ready.",
  durationHint: "Pauses the session and opens duration choices",
  pause: "Pause",
  resume: "Resume",
  play: "Play",
  volume: "Volume",
  auraSanctuary: "AURA SANCTUARY",
  findSanctuary: "Find your inner sanctuary",
  welcomeDescription:
    "A sensory meditation experience, guided by light and conscious breathing.",
  breathe: "Breathe",
  beginJourney: "Begin my journey",
  craftedWithCare: "Crafted with care for your peace of mind",
  featureShaders: "Generative shaders & sound",
  featureShadersDescription: "Reactive visual & audio compositions",
  featureRhythms: "Heart coherence & gentle rhythms",
  featureRhythmsDescription: "Fluid harmonization of your inner state",
  featureDistractionFree: "A distraction-free space",
  featureDistractionFreeDescription: "Zero notifications, pure contemplation",
  intentions: "INTENTIONS",
  step2of4: "STEP 2 OF 4",
  mainIntention: "What's your main intention?",
  intentionDescription:
    "We'll tailor your sessions, soundscapes, and immersive visuals to your mood.",
  multipleIntentions: "✨ Multiple choices allowed to shape your ritual.",
  experienceLevel: "Experience level",
  sunsetAdaptation:
    "Your sanctuary adapts to sunset to support your body's natural melatonin production.",
  intentionStress: "Ease stress & anxiety",
  intentionStressDescription:
    "Slow racing thoughts and soothe the body with gentle anchors.",
  intentionSleep: "Deep, restorative sleep",
  intentionSleepDescription:
    "Soft sounds, slow 432 Hz frequencies, and muscle release.",
  intentionFocus: "Focus & mental clarity",
  intentionFocusDescription:
    "Morning heart coherence and relief from cognitive overload.",
  intentionPresence: "A daily practice of presence",
  intentionPresenceDescription:
    "Short 5-10 minute rituals anchored in your natural rhythm.",
  beginner: "Beginner",
  beginnerDescriptor: "Curious beginner",
  regular: "Regular",
  regularDescriptor: "Committed practitioner",
  guide: "Zen guide",
  guideDescriptor: "Seasoned guide",
  quickPause: "Quick pause",
  gentleBreathing: "Gentle breathing",
  guidedMeditation: "Guided meditation",
  deepImmersion: "Deep immersion",
  morning: "Morning",
  evening: "Evening",
  amberDawn: "Amber Dawn",
  amberDawnDescription: "Tibetan bowl, sacred resonance",
  silentRiver: "Silent River",
  silentRiverDescription: "Clear water flows & gentle currents",
  mistyForest: "Misty Forest",
  mistyForestDescription: "Rustling leaves & distant birdsong",
  dailyRhythm: "DAILY RHYTHM",
  step3of4: "STEP 3 OF 4",
  buildRitual: "Let's build your daily ritual",
  ritualDescription: "Consistency comes from gentleness, not constraint.",
  breathingDuration: "BREATHING DURATION",
  bestMoment: "BEST MOMENT",
  reminderDescription:
    "Receive a soft bell at your chosen moment, bringing you back to the present without pressure.",
  notificationsDisabledLater:
    "Notifications are turned off for Lumina Flow. You can enable them later in Settings.",
  lockScreenPreview: "LOCK SCREEN PREVIEW",
  morningDescriptionToday: "A gentle invitation to be present today.",
  todayPracticeDescription: "A reflection on today's practice.",
  confirmRhythm: "Confirm my rhythm",
  changeAnytime: "You can change this anytime in Settings.",
  changeAnytimeApp: "You can change this anytime in the app.",
  soundscape: "SOUNDSCAPE",
  finalStep: "FINAL STEP",
  sanctuaryReady: "Your sanctuary is ready",
  soundscapeDescription:
    "Choose the soundscape that will accompany your first session.",
  yourSetup: "Your setup:",
  ritual: "ritual",
  intentionCount: "intention",
  intentionsCount: "intentions",
};

const translations: Record<SupportedLanguage, Messages> = {
  en,
  fr: {
    ...en,
    settings: "Réglages",
    settingsDescription: "Façonnez votre sanctuaire intérieur.",
    style: "Style",
    theme: "Thème",
    themeDescription: "Choisissez votre thème préféré",
    mindfulNotifications: "Notifications conscientes",
    morningReminder: "Rappel de présence matinale",
    morningDescription:
      "Une invitation douce à être présent, chaque jour à 8 h",
    eveningSummary: "Bilan du soir",
    eveningDescription:
      "Une réflexion sur votre pratique du jour, chaque jour à 18 h",
    sessionEndAlert: "Alerte de fin de séance",
    sessionEndDescription:
      "Prévenez-moi quand ma séance se termine, même si je me suis éloigné",
    language: "Langue",
    languageDescription: "Choisissez la langue de Lumina Flow",
    explore: "Explorer",
    exploreDescription: "Trouvez une pratique pour cet instant.",
    prepare: "Préparer",
    restart: "Recommencer",
    done: "Terminé",
    back: "Retour",
    continue: "Continuer",
    meditation: "Méditation",
    program: "Programme",
    sessionComplete: "Séance terminée",
    sessionCompleteBody:
      "Votre pratique est terminée. Revenez quand vous serez prêt.",
    morningPresence: "Présence matinale",
    dayNotOver:
      "La journée n'est pas finie. Quelques respirations calmes avant le coucher comptent aussi.",
    minute: "minute",
    minutes: "minutes",
    session: "séance",
    sessions: "séances",
    showedUp:
      "Vous avez pris soin de vous aujourd'hui — {minutes} {minute}, {sessions} {session}. Laissez cela s'installer.",
  },
  es: {
    ...en,
    settings: "Ajustes",
    settingsDescription: "Da forma a tu santuario interior.",
    style: "Estilo",
    theme: "Tema",
    themeDescription: "Elige tu tema preferido",
    mindfulNotifications: "Notificaciones conscientes",
    morningReminder: "Recordatorio de presencia matutina",
    morningDescription:
      "Una invitación amable a estar presente, cada día a las 8:00",
    eveningSummary: "Resumen de la tarde",
    eveningDescription:
      "Una reflexión sobre tu práctica de hoy, cada día a las 18:00",
    sessionEndAlert: "Alerta de fin de sesión",
    sessionEndDescription:
      "Avísame cuando termine mi sesión, aunque me haya alejado",
    language: "Idioma",
    languageDescription: "Elige el idioma de Lumina Flow",
    explore: "Explorar",
    exploreDescription: "Encuentra una práctica para este momento.",
    prepare: "Preparar",
    restart: "Reiniciar",
    done: "Listo",
    back: "Atrás",
    continue: "Continuar",
    meditation: "Meditación",
    program: "Programa",
    sessionComplete: "Sesión completada",
    sessionCompleteBody: "Tu práctica ha terminado. Vuelve cuando estés listo.",
    morningPresence: "Presencia matutina",
    dayNotOver:
      "El día aún no ha terminado. Unas respiraciones tranquilas antes de dormir también cuentan.",
    minute: "minuto",
    minutes: "minutos",
    session: "sesión",
    sessions: "sesiones",
    showedUp:
      "Hoy estuviste presente para ti — {minutes} {minute}, {sessions} {session}. Deja que se asiente.",
  },
  pt: {
    ...en,
    settings: "Definições",
    settingsDescription: "Dê forma ao seu santuário interior.",
    style: "Estilo",
    theme: "Tema",
    themeDescription: "Escolha o seu tema preferido",
    mindfulNotifications: "Notificações conscientes",
    morningReminder: "Lembrete de presença matinal",
    morningDescription:
      "Um convite suave para estar presente, todos os dias às 8:00",
    eveningSummary: "Resumo da noite",
    eveningDescription:
      "Uma reflexão sobre a prática de hoje, todos os dias às 18:00",
    sessionEndAlert: "Alerta de fim da sessão",
    sessionEndDescription:
      "Avise-me quando a sessão terminar, mesmo que eu me afaste",
    language: "Idioma",
    languageDescription: "Escolha o idioma do Lumina Flow",
    explore: "Explorar",
    exploreDescription: "Encontre uma prática para este momento.",
    prepare: "Preparar",
    restart: "Recomeçar",
    done: "Concluído",
    back: "Voltar",
    continue: "Continuar",
    meditation: "Meditação",
    program: "Programa",
    sessionComplete: "Sessão concluída",
    sessionCompleteBody: "A sua prática terminou. Volte quando estiver pronto.",
    morningPresence: "Presença matinal",
    dayNotOver:
      "O dia ainda não acabou. Algumas respirações tranquilas antes de dormir também contam.",
    minute: "minuto",
    minutes: "minutos",
    session: "sessão",
    sessions: "sessões",
    showedUp:
      "Hoje esteve presente para si — {minutes} {minute}, {sessions} {session}. Deixe isso assentar.",
  },
  de: {
    ...en,
    settings: "Einstellungen",
    settingsDescription: "Gestalte deinen inneren Zufluchtsort.",
    style: "Stil",
    theme: "Design",
    themeDescription: "Wähle dein bevorzugtes App-Design",
    mindfulNotifications: "Achtsame Benachrichtigungen",
    morningReminder: "Morgendliche Präsenz-Erinnerung",
    morningDescription:
      "Eine sanfte Einladung, jeden Tag um 8:00 präsent zu sein",
    eveningSummary: "Abendzusammenfassung",
    eveningDescription:
      "Eine Reflexion über die heutige Praxis, jeden Tag um 18:00",
    sessionEndAlert: "Benachrichtigung zum Sitzungsende",
    sessionEndDescription:
      "Informiere mich, wenn meine Sitzung endet, auch wenn ich weggegangen bin",
    language: "Sprache",
    languageDescription: "Wähle die Sprache von Lumina Flow",
    explore: "Entdecken",
    exploreDescription: "Finde eine Praxis für diesen Moment.",
    prepare: "Vorbereiten",
    restart: "Neu starten",
    done: "Fertig",
    back: "Zurück",
    continue: "Weiter",
    meditation: "Meditation",
    program: "Programm",
    sessionComplete: "Sitzung abgeschlossen",
    sessionCompleteBody:
      "Deine Praxis ist beendet. Komm zurück, wann immer du bereit bist.",
    morningPresence: "Morgendliche Präsenz",
    dayNotOver:
      "Der Tag ist noch nicht vorbei. Ein paar ruhige Atemzüge vor dem Schlafen zählen auch.",
    minute: "Minute",
    minutes: "Minuten",
    session: "Sitzung",
    sessions: "Sitzungen",
    showedUp:
      "Du warst heute für dich da — {minutes} {minute}, {sessions} {session}. Lass das nachwirken.",
  },
  it: {
    ...en,
    settings: "Impostazioni",
    settingsDescription: "Dai forma al tuo santuario interiore.",
    style: "Stile",
    theme: "Tema",
    themeDescription: "Scegli il tema che preferisci",
    mindfulNotifications: "Notifiche consapevoli",
    morningReminder: "Promemoria della presenza mattutina",
    morningDescription:
      "Un invito gentile a essere presenti, ogni giorno alle 8:00",
    eveningSummary: "Riepilogo serale",
    eveningDescription:
      "Una riflessione sulla pratica di oggi, ogni giorno alle 18:00",
    sessionEndAlert: "Avviso di fine sessione",
    sessionEndDescription:
      "Avvisami quando la sessione termina, anche se mi allontano",
    language: "Lingua",
    languageDescription: "Scegli la lingua di Lumina Flow",
    explore: "Esplora",
    exploreDescription: "Trova una pratica per questo momento.",
    prepare: "Prepara",
    restart: "Ricomincia",
    done: "Fatto",
    back: "Indietro",
    continue: "Continua",
    meditation: "Meditazione",
    program: "Programma",
    sessionComplete: "Sessione completata",
    sessionCompleteBody: "La tua pratica è terminata. Torna quando vuoi.",
    morningPresence: "Presenza mattutina",
    dayNotOver:
      "La giornata non è ancora finita. Anche qualche respiro tranquillo prima di dormire conta.",
    minute: "minuto",
    minutes: "minuti",
    session: "sessione",
    sessions: "sessioni",
    showedUp:
      "Oggi ci sei stato per te — {minutes} {minute}, {sessions} {session}. Lascia che sedimentino.",
  },
  ja: {
    ...en,
    settings: "設定",
    settingsDescription: "心の居場所を整えましょう。",
    style: "スタイル",
    theme: "テーマ",
    themeDescription: "お好みのテーマを選択",
    mindfulNotifications: "マインドフル通知",
    morningReminder: "朝のプレゼンスリマインダー",
    morningDescription: "毎朝8:00に、今ここにいるための優しい招待",
    eveningSummary: "夜のまとめ",
    eveningDescription: "毎日18:00に、今日の実践を振り返ります",
    sessionEndAlert: "セッション終了アラート",
    sessionEndDescription: "離れていてもセッションの終了をお知らせします",
    language: "言語",
    languageDescription: "Lumina Flowの言語を選択",
    explore: "探す",
    exploreDescription: "今この瞬間の実践を見つけましょう。",
    prepare: "準備する",
    restart: "再開する",
    done: "完了",
    back: "戻る",
    continue: "続ける",
    meditation: "瞑想",
    program: "プログラム",
    sessionComplete: "セッション完了",
    sessionCompleteBody: "実践が終わりました。いつでも戻ってきてください。",
    morningPresence: "朝のプレゼンス",
    dayNotOver: "一日はまだ終わっていません。眠る前の静かな呼吸も大切です。",
    minute: "分",
    minutes: "分",
    session: "セッション",
    sessions: "セッション",
    showedUp:
      "今日は自分のために時間をつくりました — {minutes}{minute}、{sessions}{session}。静かに味わいましょう。",
  },
  ko: {
    ...en,
    settings: "설정",
    settingsDescription: "내면의 안식처를 가꾸세요.",
    style: "스타일",
    theme: "테마",
    themeDescription: "원하는 앱 테마를 선택하세요",
    mindfulNotifications: "마음챙김 알림",
    morningReminder: "아침 현재성 알림",
    morningDescription: "매일 오전 8시에 현재에 머물도록 부드럽게 초대합니다",
    eveningSummary: "저녁 요약",
    eveningDescription: "매일 오후 6시에 오늘의 수행을 돌아봅니다",
    sessionEndAlert: "세션 종료 알림",
    sessionEndDescription: "잠시 자리를 비워도 세션이 끝나면 알려드립니다",
    language: "언어",
    languageDescription: "Lumina Flow에서 사용할 언어를 선택하세요",
    explore: "탐색",
    exploreDescription: "지금 이 순간을 위한 수행을 찾아보세요.",
    prepare: "준비",
    restart: "다시 시작",
    done: "완료",
    back: "뒤로",
    continue: "계속",
    meditation: "명상",
    program: "프로그램",
    sessionComplete: "세션 완료",
    sessionCompleteBody: "수행이 끝났습니다. 준비되면 언제든 돌아오세요.",
    morningPresence: "아침의 현재성",
    dayNotOver:
      "아직 하루가 끝나지 않았습니다. 잠들기 전의 고요한 호흡도 소중합니다.",
    minute: "분",
    minutes: "분",
    session: "세션",
    sessions: "세션",
    showedUp:
      "오늘 자신을 위해 시간을 냈습니다 — {minutes}{minute}, {sessions}{session}. 천천히 머물러 보세요.",
  },
  "zh-CN": {
    ...en,
    settings: "设置",
    settingsDescription: "塑造你的内在宁静之所。",
    style: "风格",
    theme: "主题",
    themeDescription: "选择你偏好的应用主题",
    mindfulNotifications: "正念通知",
    morningReminder: "晨间觉察提醒",
    morningDescription: "每天早上8:00，温柔地邀请你回到当下",
    eveningSummary: "晚间总结",
    eveningDescription: "每天18:00，回望今天的练习",
    sessionEndAlert: "练习结束提醒",
    sessionEndDescription: "即使你暂时离开，也会在练习结束时通知你",
    language: "语言",
    languageDescription: "选择 Lumina Flow 的语言",
    explore: "探索",
    exploreDescription: "为此刻找到一项练习。",
    prepare: "准备",
    restart: "重新开始",
    done: "完成",
    back: "返回",
    continue: "继续",
    meditation: "冥想",
    program: "课程",
    sessionComplete: "练习完成",
    sessionCompleteBody: "练习结束了。准备好时，随时回来。",
    morningPresence: "晨间觉察",
    dayNotOver: "一天还没有结束。睡前几次安静的呼吸同样有意义。",
    minute: "分钟",
    minutes: "分钟",
    session: "次练习",
    sessions: "次练习",
    showedUp:
      "今天你为自己留出了时间 — {minutes}{minute}，{sessions}。让这一刻慢慢沉淀。",
  },
};

function canonicalLocale(locale: string): string | undefined {
  try {
    return Intl.getCanonicalLocales(locale)[0];
  } catch {
    return undefined;
  }
}

export function resolveLanguage(locale: string | undefined): SupportedLanguage {
  const canonical = canonicalLocale(locale ?? "");
  if (!canonical) return "en";
  const exact = SUPPORTED_LANGUAGES.find(
    (value) => String(value).toLowerCase() === canonical.toLowerCase(),
  );
  if (exact) return exact;
  const base = new Intl.Locale(canonical).language;
  return (
    SUPPORTED_LANGUAGES.find((value) => value.split("-")[0] === base) ?? "en"
  );
}

export function getDeviceLocale(): string {
  if (Platform.OS === "web" && typeof navigator !== "undefined") {
    return navigator.language;
  }
  return getLocales()[0].languageCode || "en";
}

export function getInitialLocale(): string {
  return Platform.OS === "web"
    ? (getStoredLanguage() ?? getDeviceLocale())
    : getDeviceLocale();
}

export function getStoredLanguage(): SupportedLanguage | undefined {
  if (!isStorageAvailable()) return undefined;
  const value = storage.getString(LANGUAGE_KEY);
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
    ? (value as SupportedLanguage)
    : undefined;
}

export function setStoredLanguage(language: SupportedLanguage): void {
  if (isStorageAvailable()) storage.set(LANGUAGE_KEY, language);
}

export function getInitialLanguage(): SupportedLanguage {
  return Platform.OS === "web"
    ? (getStoredLanguage() ?? resolveLanguage(getDeviceLocale()))
    : resolveLanguage(getDeviceLocale());
}

export { loadPolyfills };

function interpolate(message: string, values?: MessageValues): string {
  return message.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values?.[key] ?? `{${key}}`),
  );
}

export function createTranslator(language: SupportedLanguage) {
  const messages = translations[language];
  return (key: string, values?: MessageValues): string =>
    interpolate(messages[key] ?? en[key] ?? key, values);
}

export function formatNumber(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(language, options).format(value);
}

export function formatDate(
  value: Date | number,
  language: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(language, options).format(value);
}

export function formatList(
  values: string[],
  language: SupportedLanguage,
): string {
  return new Intl.ListFormat(language, {
    type: "conjunction",
    style: "long",
  }).format(values);
}

export function getLanguageName(
  language: SupportedLanguage,
  displayLanguage: SupportedLanguage,
): string {
  return (
    new Intl.DisplayNames([displayLanguage], { type: "language" }).of(
      language,
    ) ?? languageNames[language]
  );
}

export function pluralCategory(
  value: number,
  language: SupportedLanguage,
): Intl.LDMLPluralRule {
  return new Intl.PluralRules(language).select(value);
}

type I18nValue = {
  language: SupportedLanguage;
  locale: string;
  t: ReturnType<typeof createTranslator>;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
};
const I18nContext = createContext<I18nValue | null>(null);
const fallbackI18n: I18nValue = {
  language: "en",
  locale: "en",
  t: createTranslator("en"),
  setLanguage: async () => {},
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState(getInitialLanguage);
  const setLanguage = useCallback(async (next: SupportedLanguage) => {
    await loadPolyfills(next);
    setStoredLanguage(next);
    setLanguageState(next);
  }, []);
  const value = useMemo(
    () => ({
      language,
      locale: language,
      t: createTranslator(language),
      setLanguage,
    }),
    [language, setLanguage],
  );
  useEffect(() => {
    if (Platform.OS === "web") setStoredLanguage(language);
  }, [language]);
  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  return value ?? fallbackI18n;
}

export { languageNames };
