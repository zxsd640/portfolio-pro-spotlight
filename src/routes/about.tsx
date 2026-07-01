import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Code2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Portfolio Pro" },
      { name: "description", content: "Portfolio Pro is built for creators — completely free." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  const cards = [
    { icon: Heart, k: "b1" as const },
    { icon: Sparkles, k: "b2" as const },
    { icon: Code2, k: "b3" as const },
  ];
  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <SiteNav />
      <main className="px-4 pt-36 pb-20">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--violet)]">{t("about.eyebrow")}</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {t("about.titleA")} <span className="text-gradient">{t("about.titleB")}</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t("about.p1")}</p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("about.p2")}</p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {cards.map((b) => (
              <div key={b.k} data-sound-hover className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white">
                  <b.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold">{t(`about.${b.k}.t`)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t(`about.${b.k}.d`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 glass-panel rounded-3xl p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("footer.designedBy")}</p>
            <p className="mt-3 text-3xl font-semibold text-gradient">Zyad Abdou</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("about.credit")}</p>
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/auth" search={{ mode: "register" }} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3 text-sm font-medium text-white hover:scale-[1.03] transition-transform">
              {t("about.cta")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
