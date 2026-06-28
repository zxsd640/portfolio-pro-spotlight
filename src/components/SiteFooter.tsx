import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function LogoMark() {
  return (
    <div className="relative h-7 w-7 overflow-hidden rounded-lg brand-gradient">
      <div className="absolute inset-0 grid place-items-center text-[11px] font-black text-white">P</div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
    </div>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();
  const cols = [
    { title: t("footer.product"), links: [
      { l: t("nav.templates"), to: "/templates" as const },
      { l: t("nav.demo"), to: "/demo" as const },
      { l: t("footer.dashboard"), to: "/dashboard" as const },
    ]},
    { title: t("footer.company"), links: [
      { l: t("nav.about"), to: "/about" as const },
      { l: t("nav.contact"), to: "/contact" as const },
    ]},
  ];
  return (
    <footer className="relative border-t border-white/5 px-4 pb-10 pt-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-3">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-sm font-semibold">Portfolio Pro</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/90">{c.title}</p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} data-sound="nav" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Portfolio Pro. {t("footer.rights")}</p>
        <p className="text-foreground/80">
          {t("footer.designedBy")} <span className="font-semibold text-gradient">Zyad Abdou</span>
        </p>
      </div>
    </footer>
  );
}
