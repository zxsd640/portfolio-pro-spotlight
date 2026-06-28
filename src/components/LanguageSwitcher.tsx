import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, STORAGE_KEY, applyLanguage } from "@/lib/i18n";
import { useSound } from "@/lib/sound";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  // Apply stored language on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored !== i18n.language) applyLanguage(stored);
      else applyLanguage(i18n.language);
    } catch {
      applyLanguage(i18n.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const pick = (code: string) => {
    applyLanguage(code);
    play("nav");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); play("click"); }}
        aria-label={t("common.language")}
        title={t("common.language")}
        className={[
          "inline-flex items-center gap-1.5 rounded-xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground cursor-pointer",
          compact ? "h-9 w-9 justify-center" : "h-9 px-2.5",
        ].join(" ")}
      >
        <span className="text-base leading-none" aria-hidden>{current.flag}</span>
        {!compact && <span className="text-xs font-medium uppercase tracking-wide">{current.code}</span>}
        {compact && <Globe className="sr-only h-4 w-4" />}
      </button>

      {open && (
        <div
          className="absolute end-0 top-full z-50 mt-2 w-48 origin-top overflow-hidden rounded-2xl glass-panel p-1 animate-fade-up shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
          role="listbox"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === current.code;
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={active}
                onClick={() => pick(l.code)}
                className={[
                  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
                  active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                ].join(" ")}
              >
                <span className="text-base leading-none" aria-hidden>{l.flag}</span>
                <span className="flex-1 text-start">{l.name}</span>
                {active && <Check className="h-3.5 w-3.5 text-[color:var(--violet)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
