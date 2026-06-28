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
  const logos = ["NOVA", "Lumen", "Pixel&Co", "Aperture", "FORM", "Northwind", "Helio", "Quartz", "Atlas", "Mirage"];
  return (
    <section className="relative py-16">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by 40,000+ creators and teams
      </p>
      <div className="relative mx-auto max-w-6xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="animate-marquee flex w-max gap-14 px-6">
          {[...logos, ...logos].map((l, i) => (
            <span key={i} className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-muted-foreground/70">
              {l}
            </span>
          ))}
        </div>
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

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const items = [
    { quote: "I got 3 client inquiries in the first week after launching my Portfolio Pro site. The templates feel genuinely high-end.", name: "Elena Marquez", role: "Brand Designer" },
    { quote: "It replaced my Webflow + Notion + Linktree stack. The builder is fast and the result looks like an agency made it.", name: "David Okoye", role: "Full-stack Developer" },
    { quote: "The AI case-study assistant alone is worth it. Writing project descriptions used to take me a whole afternoon.", name: "Yuki Tanaka", role: "Product Designer" },
    { quote: "Clean, fast, and beautifully animated. My photography clients keep asking who built my site.", name: "Priya Sharma", role: "Photographer" },
  ];
  return (
    <section className="relative px-4 py-28">
      <SectionHeader eyebrow="Loved by creators" title="Words from real makers." />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t.name} className="glass-panel relative rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <div className="flex gap-0.5 text-[color:var(--violet)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full brand-gradient" />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
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
