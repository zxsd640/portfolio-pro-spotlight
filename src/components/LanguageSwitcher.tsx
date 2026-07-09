import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, STORAGE_KEY, applyLanguage } from "@/lib/i18n";
import { useSound } from "@/lib/sound";
import { ArabicFlag } from "@/components/ArabicFlag";


export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const { play } = useSound();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  // Language hydration happens once in RootComponent; nothing to do here.
  void STORAGE_KEY;

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

  const isArabic = (code: string) => code === "ar";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); play("click"); }}
        aria-label={t("common.language")}
        title={t("common.language")}
        className={[
          "inline-flex items-center gap-1.5 rounded-xl transition-colors hover:bg-white/10 cursor-pointer",
          isArabic(current.code) ? "text-[#22c55e] hover:text-[#22c55e]" : "text-muted-foreground hover:text-foreground",
          compact ? "h-9 w-9 justify-center" : "h-9 px-2.5",
        ].join(" ")}
      >
        <span
          className="text-base leading-none"
          aria-hidden
          style={isArabic(current.code) ? { color: "#22c55e", filter: "hue-rotate(75deg) saturate(2)" } : undefined}
        >
          {current.flag}
        </span>
        {!compact && (
          <span
            className="text-xs font-medium uppercase tracking-wide"
            style={isArabic(current.code) ? { color: "#22c55e" } : undefined}
          >
            {current.code}
          </span>
        )}
        {compact && <Globe className="sr-only h-4 w-4" />}
      </button>

      {open && (
        <div
          className="absolute end-0 top-full z-50 mt-2 w-56 origin-top overflow-hidden rounded-2xl glass-panel p-1 animate-fade-up shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
          role="listbox"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === current.code;
            const ar = isArabic(l.code);
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={active}
                onClick={() => pick(l.code)}
                className={[
                  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
                  active ? "bg-white/10" : "hover:bg-white/5",
                  ar
                    ? "text-[#22c55e] hover:text-[#22c55e]"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                style={ar ? { color: "#22c55e" } : undefined}
              >
                <span
                  className="text-base leading-none"
                  aria-hidden
                  style={ar ? { filter: "hue-rotate(75deg) saturate(2)" } : undefined}
                >
                  {l.flag}
                </span>
                <span className="flex-1 text-start">{l.name}</span>
                {ar && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "#22c55e", backgroundColor: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.35)" }}
                  >
                    RTL
                  </span>
                )}
                {active && !ar && <Check className="h-3.5 w-3.5 text-[color:var(--violet)]" />}
                {active && ar && <Check className="h-3.5 w-3.5" style={{ color: "#22c55e" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
