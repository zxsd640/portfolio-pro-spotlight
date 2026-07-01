import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Github, Globe, MapPin, Mail, Calendar, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteFooter } from "@/components/SiteFooter";
import { useContactModal } from "@/lib/contact-modal";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo · Sara Lin — Portfolio Pro" },
      { name: "description", content: "Explore a live demo portfolio built with Portfolio Pro." },
    ],
  }),
  component: DemoPage,
});

const projects = [
  { name: "Lumen Banking", role: "Product Design", year: "2024", grad: "linear-gradient(135deg,#7c3aed,#06b6d4)" },
  { name: "Nova Brand", role: "Identity", year: "2024", grad: "linear-gradient(135deg,#f43f5e,#f97316)" },
  { name: "Reel Studio", role: "Motion", year: "2023", grad: "linear-gradient(135deg,#3b82f6,#22d3ee)" },
  { name: "Atelier App", role: "iOS", year: "2023", grad: "linear-gradient(135deg,#a855f7,#ec4899)" },
  { name: "FORM System", role: "Design System", year: "2023", grad: "linear-gradient(135deg,#10b981,#6366f1)" },
  { name: "Quartz Site", role: "Web Design", year: "2022", grad: "linear-gradient(135deg,#0ea5e9,#8b5cf6)" },
];

const skills = [
  { name: "Product Design", level: 95 },
  { name: "Brand Identity", level: 88 },
  { name: "Motion", level: 78 },
  { name: "Design Systems", level: 92 },
];

function DemoPage() {
  const { t } = useTranslation();
  const { open } = useContactModal();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />

      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
        <div className="flex w-full max-w-5xl items-center justify-between rounded-2xl glass-panel px-4 py-2.5">
          <Link to="/" data-sound className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("demo.exit")}
          </Link>
          <span className="text-xs text-muted-foreground">{t("demo.label")}</span>
          <Link to="/auth" search={{ mode: "register" }} data-sound className="rounded-xl brand-gradient px-3 py-1.5 text-xs font-medium text-white">
            {t("demo.buildYours")}
          </Link>
        </div>
      </header>

      <section className="relative px-4 pt-36 pb-20">
        <div className="mx-auto max-w-4xl text-center animate-fade-up">
          <div className="mx-auto mb-6 h-24 w-24 rounded-full brand-gradient shadow-[0_20px_60px_-15px_oklch(0.55_0.25_295/0.6)]" />
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Sara Lin</h1>
          <p className="mt-3 text-lg text-muted-foreground">Senior Product Designer · ex-Stripe</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Lisbon, PT</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Available Jan 2026</span>
            <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4" /> saralin.studio</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => open("Sara")} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white hover:scale-[1.03] transition-transform cursor-pointer">
              <Mail className="h-4 w-4" /> {t("demo.hire")}
            </button>
            <span data-sound-hover className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium">
              <Github className="h-4 w-4" /> {t("demo.resume")}
            </span>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold tracking-tight">{t("demo.selected")}</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <div key={p.name} data-sound-hover className="group relative overflow-hidden rounded-2xl glass-panel transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-30px_oklch(0.55_0.25_295/0.6)] animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="aspect-[4/5] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-110" style={{ background: p.grad }} />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.role} · {p.year}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="glass-panel rounded-2xl p-8">
            <h3 className="text-xl font-semibold tracking-tight">{t("demo.skills")}</h3>
            <div className="mt-6 space-y-4">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full brand-gradient transition-all duration-1000 ease-out" style={{ width: mounted ? `${s.level}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-8">
            <h3 className="text-xl font-semibold tracking-tight">{t("demo.experience")}</h3>
            <ol className="mt-6 relative space-y-6 border-s border-white/10 ps-6">
              {[
                { year: "2022 – Now", title: "Senior Designer · Stripe" },
                { year: "2019 – 2022", title: "Product Designer · Linear" },
                { year: "2017 – 2019", title: "Designer · Figma" },
              ].map((e) => (
                <li key={e.title} className="relative">
                  <span className="absolute -start-[27px] top-1.5 h-3 w-3 rounded-full brand-gradient shadow-[0_0_20px_oklch(0.55_0.25_295/0.7)]" />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{e.year}</p>
                  <p className="mt-1 text-sm font-medium">{e.title}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
