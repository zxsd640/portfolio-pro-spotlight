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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio Pro — Create a Portfolio That Gets You Hired" },
      {
        name: "description",
        content:
          "Build a stunning personal portfolio in minutes. Completely free for developers, designers, photographers, video editors and creative freelancers.",
      },
      { property: "og:title", content: "Portfolio Pro — Create a Portfolio That Gets You Hired" },
      {
        property: "og:description",
        content:
          "Build a stunning personal portfolio in minutes. Completely free, no subscriptions, no hidden costs.",
      },
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

/* ---------------- Ambient background ---------------- */
function BackdropGlow() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <div aria-hidden className="pointer-events-none fixed -z-10 top-1/4 -left-40 h-96 w-96 rounded-full bg-[color:var(--royal)]/20 blur-[120px] animate-pulse-glow" />
      <div aria-hidden className="pointer-events-none fixed -z-10 bottom-1/4 -right-40 h-96 w-96 rounded-full bg-[color:var(--electric)]/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
    </>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { t: tHero } = useTranslation();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center px-4 pb-24 pt-36"
    >
      <FloatingCards parallax={parallax} />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--violet)]" />
          {tHero("hero.badge")}
        </div>

        <h1
          className="animate-fade-up text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          {tHero("hero.titleA")} <span className="text-gradient">{tHero("hero.titleB")}</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          {tHero("hero.subtitle")}
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            to="/auth"
            search={{ mode: "register" }}
            data-sound
            data-sound-hover
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-10px_oklch(0.55_0.25_295/0.6)] transition-transform hover:scale-[1.03]"
          >
            {tHero("hero.startFree")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </Link>
          <Link
            to="/demo"
            data-sound
            className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
          >
            {tHero("hero.viewDemo")}
          </Link>
        </div>

        <p
          className="animate-fade-up mt-6 text-xs text-muted-foreground"
          style={{ animationDelay: "320ms" }}
        >
          {tHero("hero.smallPrint")}
        </p>
      </div>
    </section>
  );
}

function FloatingCards({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-float-slow absolute left-[6%] top-[28%] w-56 -rotate-6 hidden sm:block"
        style={{ transform: `translate(${parallax.x * -1}px, ${parallax.y * -1}px) rotate(-6deg)` }}
      >
        <MiniCard title="UI/UX Design" subtitle="Banking app · 2024" accent="var(--electric)" />
      </div>
      <div
        className="animate-float-medium absolute right-[7%] top-[22%] w-60 rotate-[8deg] hidden sm:block"
        style={{ transform: `translate(${parallax.x}px, ${parallax.y}px) rotate(8deg)` }}
      >
        <MiniCard title="Brand Identity" subtitle="Nova Studio · 2024" accent="var(--violet)" />
      </div>
      <div
        className="animate-float-slow absolute bottom-[14%] left-[14%] w-52 rotate-[5deg] hidden md:block"
        style={{ transform: `translate(${parallax.x * 0.6}px, ${parallax.y * 0.6}px) rotate(5deg)`, animationDelay: "1.2s" }}
      >
        <MiniCard title="Photography" subtitle="Editorial · Lagos" accent="var(--cyan)" />
      </div>
      <div
        className="animate-float-medium absolute bottom-[16%] right-[12%] w-52 -rotate-[7deg] hidden md:block"
        style={{ transform: `translate(${parallax.x * -0.7}px, ${parallax.y * -0.7}px) rotate(-7deg)`, animationDelay: "0.8s" }}
      >
        <MiniCard title="Web Development" subtitle="React · TypeScript" accent="var(--royal)" />
      </div>
    </div>
  );
}

function MiniCard({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div
        className="h-24 w-full"
        style={{ background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 30%, transparent))` }}
      />
      <div className="p-3">
        <p className="text-[13px] font-semibold leading-tight">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

/* ---------------- Trusted by ---------------- */
function TrustedBy() {
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Built for freelancers, designers & developers worldwide
        </p>
        <p className="mt-3 text-sm text-foreground/70">
          Portfolio Pro is a brand-new platform — join our growing community of creators
          shaping it from day one.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Product Preview ---------------- */
function ProductPreview() {
  const [tab, setTab] = useState<"dashboard" | "builder">("dashboard");
  return (
    <section className="relative px-4 py-20">
      <SectionHeader
        eyebrow="See it in action"
        title="A real product, not a mockup."
        sub="Take a peek inside the dashboard and the drag-and-drop builder."
      />
      <div className="mx-auto mt-10 max-w-5xl">
        <div className="mb-5 flex justify-center gap-2">
          {(["dashboard", "builder"] as const).map((k) => (
            <button
              key={k}
              data-sound
              onClick={() => setTab(k)}
              className={[
                "rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer",
                tab === k ? "brand-gradient text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)]" : "glass-panel text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {k === "dashboard" ? "Dashboard" : "Drag & Drop Builder"}
            </button>
          ))}
        </div>
        <div className="glass-panel overflow-hidden rounded-3xl p-3 shadow-[0_40px_120px_-30px_oklch(0.55_0.25_295/0.45)]">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ms-3 text-[11px] text-muted-foreground">
              portfoliopro.app/{tab === "dashboard" ? "dashboard" : "builder"}
            </span>
          </div>
          {tab === "dashboard" ? <PreviewDashboard /> : <PreviewBuilder />}
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            to="/demo"
            data-sound
            className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Open the live demo
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function PreviewDashboard() {
  const stats = [
    { label: "Total views", value: "12,438", icon: BarChart3 },
    { label: "Projects", value: "8", icon: Layers },
    { label: "Likes", value: "342", icon: Heart },
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
        <p className="text-xs text-muted-foreground">Views, last 14 days</p>
        <div className="mt-3 flex h-24 items-end gap-1.5">
          {[30, 45, 28, 60, 75, 50, 82, 95, 70, 88, 100, 78, 92, 110].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md brand-gradient opacity-80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewBuilder() {
  const blocks = ["Hero", "About", "Projects", "Experience", "Skills", "Contact"];
  return (
    <div className="grid grid-cols-12 gap-3 rounded-2xl bg-black/30 p-5">
      <div className="col-span-4 glass-panel rounded-xl p-3">
        <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Sections</p>
        <ul className="space-y-1.5">
          {blocks.map((b, i) => (
            <li
              key={b}
              className={[
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs",
                i === 1 ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5",
              ].join(" ")}
            >
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Comparison ---------------- */
function Comparison() {
  const rows = [
    { feature: "Truly free, no paywalled features", pp: true, others: "Limited trial / paid tiers" },
    { feature: "Built for personal portfolios", pp: true, others: "General website / network" },
    { feature: "AI writing assistant included", pp: true, others: "Add-on or unavailable" },
    { feature: "Custom domain at no cost", pp: true, others: "Paid plan required" },
    { feature: "Own your content, export anytime", pp: true, others: "Lock-in common" },
  ];
  return (
    <section className="relative px-4 py-24">
      <SectionHeader
        eyebrow="Why Portfolio Pro"
        title="Different from Behance, Wix and Squarespace."
        sub="They're great at what they do. We're laser-focused on one thing: getting your work in front of the right people."
      />
      <div className="mx-auto mt-12 max-w-4xl glass-panel overflow-hidden rounded-2xl">
        <div className="grid grid-cols-12 border-b border-white/10 bg-white/5 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground">
          <div className="col-span-6">Feature</div>
          <div className="col-span-3 text-center">Portfolio Pro</div>
          <div className="col-span-3 text-center">Behance / Wix / Squarespace</div>
        </div>
        {rows.map((r) => (
          <div key={r.feature} className="grid grid-cols-12 items-center border-b border-white/5 px-5 py-4 text-sm last:border-b-0">
            <div className="col-span-6 text-foreground/90">{r.feature}</div>
            <div className="col-span-3 flex justify-center">
              {r.pp ? (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full brand-gradient text-white">
                  <Star className="h-3.5 w-3.5 fill-current" />
                </span>
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="col-span-3 text-center text-xs text-muted-foreground">{r.others}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
function Features() {
  const items = [
    { icon: Layers, title: "Drag & drop builder", desc: "Compose sections like Lego blocks. Reorder, restyle, and ship in minutes." },
    { icon: Palette, title: "Premium templates", desc: "Dozens of award-winning templates crafted by senior designers." },
    { icon: Globe, title: "Your own domain", desc: "Use portfoliopro.com/you or connect a custom domain in one click." },
    { icon: BarChart3, title: "Real-time analytics", desc: "Track views, sources, and engagement on every project you publish." },
    { icon: Brain, title: "AI writing assist", desc: "Write better case studies with an assistant trained on great portfolios." },
    { icon: Shield, title: "Built-in SEO", desc: "Auto-generated meta, OG cards and sitemaps so clients find you on Google." },
  ];
  return (
    <section id="features" className="relative px-4 py-28">
      <SectionHeader eyebrow="Features" title="Everything you need to look professional." sub="Designed end-to-end so your work looks as good as it really is." />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            data-sound-hover
            className="group relative overflow-hidden rounded-2xl glass-panel p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_oklch(0.55_0.25_295/0.5)]"
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)]">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[color:var(--royal)]/15 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Templates ---------------- */
function Templates() {
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
      <SectionHeader eyebrow="Templates" title="Start from a masterpiece." sub="Hand-crafted templates for every profession. Tweak anything." />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tpls.map((t) => (
          <Link
            key={t.name}
            to="/demo"
            data-sound
            data-sound-hover
            className="group relative overflow-hidden rounded-3xl glass-panel transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_40px_80px_-30px_oklch(0.55_0.25_295/0.6)]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ background: t.grad }}>
              <div className="absolute inset-x-6 bottom-6 rounded-xl bg-black/30 p-3 backdrop-blur-md">
                <p className="text-xs uppercase tracking-widest text-white/70">{t.role}</p>
                <p className="mt-0.5 text-xl font-semibold text-white">{t.name}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/5" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">{t.name}</span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-foreground transition-colors group-hover:bg-white/20">
                Preview <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Showcase ---------------- */
function Showcase() {
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
      <SectionHeader eyebrow="Showcase" title="Made by creators like you." sub="A peek at portfolios already getting our makers hired." />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
        {creators.map((c) => (
          <div
            key={c.name}
            data-sound-hover
            className="group relative overflow-hidden rounded-2xl glass-panel transition-all duration-300 hover:-translate-y-1.5"
          >
            <div className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" style={{ background: c.grad }} />
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <button
                onClick={() => open(c.name)}
                data-sound
                className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs transition-colors hover:bg-white/20 cursor-pointer"
              >
                Hire me
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Testimonials (real submissions) ---------------- */
type Review = { id: string; quote: string; name: string; role: string; rating: number; createdAt: number };
const REVIEWS_KEY = "pp.reviews.v1";

function Testimonials() {
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
    const next: Review[] = [
      { id: crypto.randomUUID(), ...draft, createdAt: Date.now() },
      ...reviews,
    ].slice(0, 24);
    setReviews(next);
    try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(next)); } catch {}
    setDraft({ quote: "", name: "", role: "", rating: 5 });
    setShowForm(false);
  };

  return (
    <section className="relative px-4 py-28">
      <SectionHeader
        eyebrow="Community reviews"
        title="What real creators say."
        sub="We're brand new — no fake quotes here. Share your experience to help others."
      />
      <div className="mx-auto mt-12 max-w-6xl">
        {reviews.length === 0 ? (
          <div className="glass-panel mx-auto max-w-xl rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <h3 className="text-lg font-semibold">Be the first to review Portfolio Pro</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              No fabricated testimonials — your honest words will live here.
            </p>
            <button
              data-sound
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)] transition-transform hover:scale-[1.03] cursor-pointer"
            >
              Write a review
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
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
              <button
                data-sound
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10 cursor-pointer"
              >
                Add your review
              </button>
            </div>
          </>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <form
              onSubmit={submit}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-panel rounded-2xl p-6 animate-fade-up"
            >
              <h3 className="text-lg font-semibold">Share your experience</h3>
              <p className="mt-1 text-xs text-muted-foreground">Honest reviews only — no marketing copy.</p>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, rating: n }))}
                    className="cursor-pointer"
                    aria-label={`${n} stars`}
                  >
                    <Star className={["h-6 w-6 text-[color:var(--violet)]", n <= draft.rating ? "fill-current" : "opacity-30"].join(" ")} />
                  </button>
                ))}
              </div>
              <textarea
                required
                rows={4}
                placeholder="What did you think?"
                value={draft.quote}
                onChange={(e) => setDraft((d) => ({ ...d, quote: e.target.value }))}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-[color:var(--violet)]"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Your name"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--violet)]"
                />
                <input
                  placeholder="Role (optional)"
                  value={draft.role}
                  onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--violet)]"
                />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-2 text-sm text-muted-foreground hover:bg-white/5 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" data-sound className="rounded-xl brand-gradient px-4 py-2 text-sm font-medium text-white cursor-pointer">
                  Post review
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Why It's Free (replaces Pricing) ---------------- */
function WhyFree() {
  const features = [
    { icon: InfinityIcon, title: "Unlimited Projects", desc: "Publish as many projects as you want — no caps, ever." },
    { icon: Layers, title: "Unlimited Portfolio Sections", desc: "Compose any layout with as many sections as you need." },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time views, sources and engagement for every project." },
    { icon: Palette, title: "Custom Portfolio Themes", desc: "Switch themes and fine-tune colors, fonts and spacing." },
    { icon: FileText, title: "Blog System", desc: "Publish articles and case studies with a built-in editor." },
    { icon: Upload, title: "Resume Upload", desc: "Attach your CV so clients and recruiters can grab it instantly." },
    { icon: Mail, title: "Contact Forms", desc: "Receive inquiries straight to your inbox — no setup required." },
    { icon: Share2, title: "Portfolio Sharing", desc: "Beautiful share cards on every platform out of the box." },
  ];
  return (
    <section id="pricing" className="relative px-4 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1.5 text-xs">
          <Heart className="h-3.5 w-3.5 text-[color:var(--violet)]" />
          <span className="text-muted-foreground">100% free, forever</span>
        </div>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          Everything You Need.{" "}
          <span className="text-gradient">Completely Free.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Portfolio Pro gives creators a beautiful professional portfolio experience with no
          subscriptions and no hidden costs.
        </p>
        <div className="mx-auto mt-6 max-w-xl rounded-2xl glass-panel p-4 text-left">
          <p className="text-xs uppercase tracking-wider text-[color:var(--violet)]">How is it sustained?</p>
          <p className="mt-1.5 text-sm text-foreground/80">
            Free forever for the core builder. In the future we plan to introduce optional
            <span className="font-medium text-foreground"> Pro features </span>
            (custom domains, advanced analytics, team workspaces) to keep the lights on —
            everything you see today stays free.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            data-sound-hover
            className="group relative overflow-hidden rounded-2xl glass-panel p-6 transition-all duration-300 hover:-translate-y-1.5 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl brand-gradient text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)]">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-[15px] font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[color:var(--electric)]/15 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex justify-center">
        <Link
          to="/auth"
          search={{ mode: "register" }}
          data-sound
          data-sound-hover
          className="inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-10px_oklch(0.55_0.25_295/0.7)] transition-transform hover:scale-[1.03]"
        >
          Create your portfolio — free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    { q: "Is Portfolio Pro really free?", a: "Yes. Every feature is free — no paid tiers, no hidden upgrades. Build, publish and grow without ever paying a cent." },
    { q: "Do I need to know how to code?", a: "No. Portfolio Pro is fully visual. Pick a template, edit content, and publish." },
    { q: "Can I use my own domain?", a: "Yes — connect any custom domain and we'll handle SSL automatically." },
    { q: "How many projects can I publish?", a: "Unlimited. There are no caps on projects, sections, blog posts or visitors." },
    { q: "Can I export my site?", a: "Yes, you can export a static build of your portfolio at any time." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative px-4 py-28">
      <SectionHeader eyebrow="FAQ" title="Frequently asked questions." />
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="glass-panel overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                data-sound
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
              >
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

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="relative px-4 py-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] glass-panel p-10 text-center sm:p-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-glow opacity-80" />
        <div className="relative">
          <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient shadow-[0_20px_60px_-20px_oklch(0.55_0.25_295/0.7)]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Your next client is one portfolio away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join 40,000+ creators building their professional presence on Portfolio Pro — completely free.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              search={{ mode: "register" }}
              data-sound
              data-sound-hover
              className="inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/demo"
              data-sound
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/15"
            >
              View demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Section header ---------------- */
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--violet)]">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{sub}</p>}
    </div>
  );
}
