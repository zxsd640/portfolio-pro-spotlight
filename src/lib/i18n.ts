import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import es from "@/locales/es.json";
import fr from "@/locales/fr.json";
import de from "@/locales/de.json";
import pt from "@/locales/pt.json";

export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" as const },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl" as const },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" as const },
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" as const },
  { code: "de", name: "Deutsch", flag: "🇩🇪", dir: "ltr" as const },
  { code: "pt", name: "Português", flag: "🇧🇷", dir: "ltr" as const },
];

export const STORAGE_KEY = "pp.lang";

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
        es: { translation: es },
        fr: { translation: fr },
        de: { translation: de },
        pt: { translation: pt },
      },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export function applyLanguage(code: string) {
  const lang = LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
  i18n.changeLanguage(lang.code);
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir;
  }
  if (typeof localStorage !== "undefined") {
    try { localStorage.setItem(STORAGE_KEY, lang.code); } catch {}
  }
}

export default i18n;
