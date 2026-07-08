import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Palette,
  Code2,
  Camera,
  Video,
  Brain,
  Briefcase,
  Star,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Plus,
  Minus,
  Infinity as InfinityIcon,
  FileText,
  Upload,
  Mail,
  Share2,
  Heart,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useContactModal } from "@/lib/contact-modal";
import { TiltCard } from "@/components/TiltCard";
import { MagneticLink } from "@/components/MagneticButton";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio Pro — Create a Portfolio That Gets You Hired" },
      { name: "description", content: "Build a stunning personal portfolio in minutes. Completely free for developers, designers, photographers, video editors and creative freelancers." },
      { property: "og:title", content: "Portfolio Pro — Create a Portfolio That Gets You Hired" },
      { property: "og:description", content: "Build a stunning personal portfolio in minutes. Completely free, no subscriptions, no hidden costs." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      <BackdropGlow />
      <SiteNav />
      <Hero />
      <TrustedBy />
      <Features />
      <ProductPreview />
      <Comparison />
      <Templates />
      <Showcase />
      <Testimonials />
      <WhyFree />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function BackdropGlow() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <div aria-hidden className="pointer-events-none fixed -z-10 top-1/4 -left-40 h-96 w-96 rounded-full bg-[color:var(--royal)]/20 blur-[120px] animate-pulse-glow" />
      <div aria-hidden className="pointer-events-none fixed -z-10 bottom-1/4 -right-40 h-96 w-96 rounded-full bg-[color:var(--electric)]/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
    </>
  );
}

function Hero() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPointer({
          x: e.clientX / window.innerWidth - 0.5,
          y: e.clientY / window.innerHeight - 0.5,
        });
      });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // px offsets — larger values = layer feels closer to camera
  const layer = (depth: number) => ({
    transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth - scrollY * (depth / 60)}px, 0)`,
  });

  return (
    <section
      ref={sceneRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-24 pt-36"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}
    >
      {/* Depth layer: ambient glow (farthest back) */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={layer(-14)}>
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--royal)]/25 blur-[140px]" />
        <div className="absolute right-[10%] top-[20%] h-72 w-72 rounded-full bg-[color:var(--electric)]/25 blur-[120px]" />
        <div className="absolute left-[8%] bottom-[10%] h-80 w-80 rounded-full bg-[color:var(--violet)]/20 blur-[130px]" />
      </div>

      {/* Depth layer: floating portfolio cards */}
      <FloatingCards pointer={pointer} scrollY={scrollY} />

      {/* Depth layer: content (closest to camera) */}
      <div
        className="relative z-10 mx-auto max-w-4xl text-center will-change-transform"
        style={{
          transform: `translate3d(${pointer.x * 6}px, ${pointer.y * 6}px, 0) rotateX(${pointer.y * -2}deg) rotateY(${pointer.x * 2}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--violet)]" />
          {t("hero.badge")}
        </div>
        <h1
          className="animate-fade-up text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "80ms", transform: "translateZ(40px)" }}
        >
          {t("hero.titleA")} <span className="text-gradient">{t("hero.titleB")}</span>
        </h1>
        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "160ms", transform: "translateZ(20px)" }}
        >
          {t("hero.subtitle")}
        </p>
        <div
          className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "240ms", transform: "translateZ(30px)" }}
        >
          <MagneticLink
            to="/auth"
            search={{ mode: "register" }}
            data-sound
            data-sound-hover
            className="group relative items-center gap-2 overflow-hidden rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-10px_oklch(0.55_0.25_295/0.6)]"
          >
            {t("hero.startFree")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </MagneticLink>
          <Link
            to="/demo"
            data-sound
            className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-white/10"
          >
            {t("hero.viewDemo")}
          </Link>
        </div>
        <p
          className="animate-fade-up mt-6 text-xs text-muted-foreground"
          style={{ animationDelay: "320ms" }}
        >
          {t("hero.smallPrint")}
        </p>
      </div>

      {/* subtle scroll hint */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 opacity-60"
        style={{ transform: `translate(-50%, ${Math.min(scrollY * 0.3, 40)}px)` }}
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/15 p-1">
          <div className="h-2 w-1 animate-pulse rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}

function FloatingCards({ pointer, scrollY }: { pointer: { x: number; y: number }; scrollY: number }) {
  const cards = [
    { title: "UI/UX Design", subtitle: "Banking app · 2024", accent: "var(--electric)", cls: "left-[6%] top-[24%] w-56 hidden sm:block", depth: 40, rot: -6 },
    { title: "Brand Identity", subtitle: "Nova Studio · 2024", accent: "var(--violet)", cls: "right-[7%] top-[18%] w-60 hidden sm:block", depth: 55, rot: 8 },
    { title: "Photography", subtitle: "Editorial · Lagos", accent: "var(--cyan)", cls: "bottom-[12%] left-[12%] w-52 hidden md:block", depth: 30, rot: 5 },
    { title: "Web Development", subtitle: "React · TypeScript", accent: "var(--royal)", cls: "bottom-[16%] right-[10%] w-52 hidden md:block", depth: 65, rot: -7 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {cards.map((c, i) => (
        <div
          key={c.title}
          className={`absolute will-change-transform ${c.cls}`}
          style={{
            transform: `translate3d(${pointer.x * -c.depth}px, ${pointer.y * -c.depth - scrollY * (c.depth / 200)}px, 0) rotateZ(${c.rot}deg) rotateX(${pointer.y * 6}deg) rotateY(${pointer.x * -6}deg)`,
            transition: "transform 120ms ease-out",
            animation: `float-${i % 2 === 0 ? "slow" : "medium"} ${6 + i}s ease-in-out infinite`,
          }}
        >
          <MiniCard title={c.title} subtitle={c.subtitle} accent={c.accent} />
        </div>
      ))}
    </div>
  );
}

function MiniCard({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  return (
    <div className="glass-panel overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
      <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 30%, transparent))` }} />
      <div className="p-3">
        <p className="text-[13px] font-semibold leading-tight">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}


function TrustedBy() {
  const { t } = useTranslation();
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("trusted.kicker")}</p>
        <p className="mt-3 text-sm text-foreground/70">{t("trusted.line")}</p>
      </div>
    </section>
  );
}

function ProductPreview() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"dashboard" | "builder">("dashboard");
  return (
    <section className="relative px-4 py-20">
      <SectionHeader eyebrow={t("product.eyebrow")} title={t("product.title")} sub={t("product.sub")} />
      <div className="mx-auto mt-10 max-w-5xl">
        <div className="mb-5 flex justify-center gap-2">
          {(["dashboard", "builder"] as const).map((k) => (
            <button key={k} data-sound onClick={() => setTab(k)} className={["rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer", tab === k ? "brand-gradient text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)]" : "glass-panel text-muted-foreground hover:text-foreground"].join(" ")}>
              {k === "dashboard" ? t("product.dashboard") : t("product.builder")}
            </button>
          ))}
        </div>
        <div className="glass-panel overflow-hidden rounded-3xl p-3 shadow-[0_40px_120px_-30px_oklch(0.55_0.25_295/0.45)]">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ms-3 text-[11px] text-muted-foreground">portfoliopro.app/{tab === "dashboard" ? "dashboard" : "builder"}</span>
          </div>
          {tab === "dashboard" ? <PreviewDashboard /> : <PreviewBuilder />}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/demo" data-sound className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10">
            {t("product.openLive")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PreviewDashboard() {
  const { t } = useTranslation();
  const stats = [
    { label: t("product.stats.views"), value: "12,438", icon: BarChart3 },
    { label: t("product.stats.projects"), value: "8", icon: Layers },
    { label: t("product.stats.likes"), value: "342", icon: Heart },
  ];
  return (
    <div className="rounded-2xl bg-black/30 p-5">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-panel rounded-xl p-3">
            <s.icon className="h-4 w-4 text-[color:var(--violet)]" />
            <p className="mt-2 text-lg font-semibold">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 glass-panel rounded-xl p-4">
        <p className="text-xs text-muted-foreground">{t("product.views14")}</p>
        <div className="mt-3 flex h-24 items-end gap-1.5">
          {[30, 45, 28, 60, 75, 50, 82, 95, 70, 88, 100, 78, 92, 110].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md brand-gradient opacity-80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewBuilder() {
  const { t } = useTranslation();
  const blocks = ["Hero", "About", "Projects", "Experience", "Skills", "Contact"];
  return (
    <div className="grid grid-cols-12 gap-3 rounded-2xl bg-black/30 p-5">
      <div className="col-span-4 glass-panel rounded-xl p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">{t("product.sections")}</p>
        <ul className="space-y-1.5">
          {blocks.map((b, i) => (
            <li key={b} className={["flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs", i === 1 ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"].join(" ")}>
              <span className="h-1 w-1 rounded-full bg-[color:var(--violet)]" />
              {b}
              <span className="ms-auto text-[10px] text-muted-foreground/60">⋮⋮</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-8 glass-panel rounded-xl p-4">
        <div className="h-20 rounded-lg brand-gradient opacity-90" />
        <div className="mt-3 h-3 w-2/3 rounded-full bg-white/10" />
        <div className="mt-2 h-3 w-1/2 rounded-full bg-white/10" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (<div key={i} className="aspect-[4/3] rounded-lg bg-white/5" />))}
        </div>
      </div>
    </div>
  );
}

function Comparison() {
  const { t } = useTranslation();
  const rows = [
    { feature: t("compare.row1"), pp: true, others: t("compare.others1") },
    { feature: t("compare.row2"), pp: true, others: t("compare.others2") },
    { feature: t("compare.row3"), pp: true, others: t("compare.others3") },
    { feature: t("compare.row4"), pp: true, others: t("compare.others4") },
    { feature: t("compare.row5"), pp: true, others: t("compare.others5") },
  ];
  return (
    <section className="relative px-4 py-24">
      <SectionHeader eyebrow={t("compare.eyebrow")} title={t("compare.title")} sub={t("compare.sub")} />
      <div className="mx-auto mt-12 max-w-4xl glass-panel overflow-hidden rounded-2xl">
        <div className="grid grid-cols-12 border-b border-white/10 bg-white/5 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground">
          <div className="col-span-6">{t("compare.feature")}</div>
          <div className="col-span-3 text-center">{t("compare.us")}</div>
          <div className="col-span-3 text-center">{t("compare.others")}</div>
        </div>
        {rows.map((r) => (
          <div key={r.feature} className="grid grid-cols-12 items-center border-b border-white/5 px-5 py-4 text-sm last:border-b-0">
            <div className="col-span-6 text-foreground/90">{r.feature}</div>
            <div className="col-span-3 flex justify-center">
              {r.pp ? (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full brand-gradient text-white">
                  <Star className="h-3.5 w-3.5 fill-current" />
                </span>
              ) : (<Minus className="h-4 w-4 text-muted-foreground" />)}
            </div>
            <div className="col-span-3 text-center text-xs text-muted-foreground">{r.others}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const { t } = useTranslation();
  const items = [
    { icon: Layers, title: t("features.dnd.t"), desc: t("features.dnd.d") },
    { icon: Palette, title: t("features.tpl.t"), desc: t("features.tpl.d") },
    { icon: Globe, title: t("features.dom.t"), desc: t("features.dom.d") },
    { icon: BarChart3, title: t("features.an.t"), desc: t("features.an.d") },
    { icon: Brain, title: t("features.ai.t"), desc: t("features.ai.d") },
    { icon: Shield, title: t("features.seo.t"), desc: t("features.seo.d") },
  ];
  return (
    <section id="features" className="relative px-4 py-28">
      <SectionHeader eyebrow={t("features.eyebrow")} title={t("features.title")} sub={t("features.sub")} />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <TiltCard
            key={it.title}
            max={8}
            className="group rounded-2xl"
          >
            <div data-sound-hover className="relative overflow-hidden rounded-2xl glass-panel p-6 transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_oklch(0.55_0.25_295/0.55)]">
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)]" style={{ transform: "translateZ(30px)" }}>
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold tracking-tight" style={{ transform: "translateZ(20px)" }}>{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[color:var(--royal)]/15 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
            </div>
          </TiltCard>
        ))}
      </div>

    </section>
  );
}

function Templates() {
  const { t } = useTranslation();
  const tpls = [
    { name: "Aperture", role: "Photography", grad: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
    { name: "Monolith", role: "Designer", grad: "linear-gradient(135deg,#a855f7,#ec4899)" },
    { name: "Stack", role: "Developer", grad: "linear-gradient(135deg,#22d3ee,#3b82f6)" },
    { name: "Reel", role: "Video Editor", grad: "linear-gradient(135deg,#f97316,#ef4444)" },
    { name: "Studio", role: "Agency", grad: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
    { name: "Atelier", role: "Illustrator", grad: "linear-gradient(135deg,#10b981,#3b82f6)" },
  ];
  return (
    <section id="templates" className="relative px-4 py-28">
      <SectionHeader eyebrow={t("templates.eyebrow")} title={`${t("templates.title")} ${t("templates.titleAccent")}`} sub={t("templates.sub")} />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tpls.map((tpl) => (
          <TiltCard key={tpl.name} max={12} className="rounded-3xl">
            <Link to="/demo" data-sound data-sound-hover className="group relative block overflow-hidden rounded-3xl glass-panel transition-shadow duration-300 hover:shadow-[0_40px_80px_-30px_oklch(0.55_0.25_295/0.6)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ background: tpl.grad }}>
                <div className="absolute inset-x-6 bottom-6 rounded-xl bg-black/30 p-3 backdrop-blur-md" style={{ transform: "translateZ(40px)" }}>
                  <p className="text-xs uppercase tracking-widest text-white/70">{tpl.role}</p>
                  <p className="mt-0.5 text-xl font-semibold text-white">{tpl.name}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm font-medium">{tpl.name}</span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-foreground transition-colors group-hover:bg-white/20">
                  {t("templates.preview")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          </TiltCard>
        ))}
      </div>

    </section>
  );
}

function Showcase() {
  const { t } = useTranslation();
  const { open } = useContactModal();
  const creators = [
    { name: "Amr Hassan", role: "Product Designer", icon: Palette, grad: "linear-gradient(135deg,#7c3aed,#06b6d4)" },
    { name: "Sara Lin", role: "Photographer", icon: Camera, grad: "linear-gradient(135deg,#f43f5e,#f97316)" },
    { name: "Noah Park", role: "Frontend Dev", icon: Code2, grad: "linear-gradient(135deg,#3b82f6,#22d3ee)" },
    { name: "Maya Idris", role: "Video Editor", icon: Video, grad: "linear-gradient(135deg,#a855f7,#ec4899)" },
    { name: "Leo Tanaka", role: "AI Creator", icon: Brain, grad: "linear-gradient(135deg,#10b981,#6366f1)" },
    { name: "Iris Cole", role: "Freelancer", icon: Briefcase, grad: "linear-gradient(135deg,#0ea5e9,#8b5cf6)" },
  ];
  return (
    <section id="showcase" className="relative px-4 py-28">
      <SectionHeader eyebrow={t("showcase.eyebrow")} title={t("showcase.title")} sub={t("showcase.sub")} />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
        {creators.map((c) => (
          <div key={c.name} data-sound-hover className="group relative overflow-hidden rounded-2xl glass-panel transition-all duration-300 hover:-translate-y-1.5">
            <div className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" style={{ background: c.grad }} />
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <button onClick={() => open(c.name)} data-sound className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs transition-colors hover:bg-white/20 cursor-pointer">
                {t("demo.hire")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type Review = { id: string; quote: string; name: string; role: string; rating: number; createdAt: number };
const REVIEWS_KEY = "pp.reviews.v1";

function Testimonials() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ quote: "", name: "", role: "", rating: 5 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      if (raw) setReviews(JSON.parse(raw));
    } catch {}
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.quote.trim() || !draft.name.trim()) return;
    const next: Review[] = [{ id: crypto.randomUUID(), ...draft, createdAt: Date.now() }, ...reviews].slice(0, 24);
    setReviews(next);
    try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(next)); } catch {}
    setDraft({ quote: "", name: "", role: "", rating: 5 });
    setShowForm(false);
  };

  return (
    <section className="relative px-4 py-28">
      <SectionHeader eyebrow={t("reviews.eyebrow")} title={t("reviews.title")} sub={t("reviews.sub")} />
      <div className="mx-auto mt-12 max-w-6xl">
        {reviews.length === 0 ? (
          <div className="glass-panel mx-auto max-w-xl rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <h3 className="text-lg font-semibold">{t("reviews.empty")}</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{t("reviews.emptySub")}</p>
            <button data-sound onClick={() => setShowForm(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)] transition-transform hover:scale-[1.03] cursor-pointer">
              {t("reviews.write")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <figure key={r.id} className="glass-panel relative rounded-2xl p-6 transition-transform hover:-translate-y-1">
                  <div className="flex gap-0.5 text-[color:var(--violet)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={["h-3.5 w-3.5", i < r.rating ? "fill-current" : "opacity-30"].join(" ")} />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90">"{r.quote}"</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full brand-gradient" />
                    <div>
                      <p className="text-sm font-semibold">{r.name}</p>
                      {r.role && <p className="text-xs text-muted-foreground">{r.role}</p>}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button data-sound onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10 cursor-pointer">
                {t("reviews.write")}
              </button>
            </div>
          </>
        )}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md glass-panel rounded-2xl p-6 animate-fade-up">
              <h3 className="text-lg font-semibold">{t("reviews.write")}</h3>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setDraft((d) => ({ ...d, rating: n }))} className="cursor-pointer" aria-label={`${n}`}>
                    <Star className={["h-6 w-6 text-[color:var(--violet)]", n <= draft.rating ? "fill-current" : "opacity-30"].join(" ")} />
                  </button>
                ))}
              </div>
              <textarea required rows={4} placeholder={t("reviews.message")} value={draft.quote} onChange={(e) => setDraft((d) => ({ ...d, quote: e.target.value }))} className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-[color:var(--violet)]" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input required placeholder={t("reviews.name")} value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--violet)]" />
                <input placeholder={t("reviews.role")} value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--violet)]" />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2 text-sm text-muted-foreground hover:bg-white/5 cursor-pointer">{t("common.cancel")}</button>
                <button type="submit" data-sound className="rounded-xl brand-gradient px-4 py-2 text-sm font-medium text-white cursor-pointer">{t("reviews.submit")}</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

function WhyFree() {
  const { t } = useTranslation();
  const features = [
    { icon: InfinityIcon, title: t("features.dnd.t"), desc: t("features.dnd.d") },
    { icon: Layers, title: t("product.sections"), desc: t("features.dnd.d") },
    { icon: BarChart3, title: t("features.an.t"), desc: t("features.an.d") },
    { icon: Palette, title: t("features.tpl.t"), desc: t("features.tpl.d") },
    { icon: FileText, title: t("features.ai.t"), desc: t("features.ai.d") },
    { icon: Upload, title: t("features.dom.t"), desc: t("features.dom.d") },
    { icon: Mail, title: t("contact.email"), desc: t("features.seo.d") },
    { icon: Share2, title: t("common.share"), desc: t("features.tpl.d") },
  ];
  return (
    <section id="pricing" className="relative px-4 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1.5 text-xs">
          <Heart className="h-3.5 w-3.5 text-[color:var(--violet)]" />
          <span className="text-muted-foreground">{t("whyfree.eyebrow")}</span>
        </div>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{t("whyfree.title")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("whyfree.sub")}</p>
        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-3 text-start md:grid-cols-3">
          {(["b1", "b2", "b3"] as const).map((k) => (
            <div key={k} className="rounded-2xl glass-panel p-4">
              <p className="text-sm font-semibold">{t(`whyfree.${k}.t`)}</p>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{t(`whyfree.${k}.d`)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} data-sound-hover className="group relative overflow-hidden rounded-2xl glass-panel p-6 transition-all duration-300 hover:-translate-y-1.5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)]">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex justify-center">
        <Link to="/auth" search={{ mode: "register" }} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-10px_oklch(0.55_0.25_295/0.7)] transition-transform hover:scale-[1.03]">
          {t("hero.startFree")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useTranslation();
  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative px-4 py-28">
      <SectionHeader eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="glass-panel overflow-hidden rounded-2xl">
              <button onClick={() => setOpen(isOpen ? null : i)} data-sound className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start cursor-pointer">
                <span className="text-[15px] font-medium">{it.q}</span>
                {isOpen ? <Minus className="h-4 w-4 text-muted-foreground" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
              </button>
              <div className={["grid transition-all duration-300 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"].join(" ")}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useTranslation();
  return (
    <section className="relative px-4 py-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] glass-panel p-10 text-center sm:p-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-glow opacity-80" />
        <div className="relative">
          <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient shadow-[0_20px_60px_-20px_oklch(0.55_0.25_295/0.7)]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{t("cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("cta.sub")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/auth" search={{ mode: "register" }} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]">
              {t("cta.primary")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link to="/demo" data-sound className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/15">
              {t("cta.secondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--violet)]">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{sub}</p>}
    </div>
  );
}
