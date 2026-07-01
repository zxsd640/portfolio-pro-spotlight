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

function detectInitialLanguage(): string {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  } catch {}
  const nav = (navigator.language || "en").toLowerCase().split("-")[0];
  if (LANGUAGES.some((l) => l.code === nav)) return nav;
  return "en";
}

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
      lng: detectInitialLanguage(),
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

// Apply once on module load (client only)
if (typeof document !== "undefined") {
  const initial = detectInitialLanguage();
  applyLanguage(initial);
}

export default i18n;
