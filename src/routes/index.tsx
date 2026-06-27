import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  Check,
  Star,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Plus,
  Minus,
  Twitter,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio Pro — Create a Portfolio That Gets You Hired" },
      {
        name: "description",
        content:
          "Build a stunning personal portfolio in minutes. Designed for developers, designers, photographers, video editors and creative freelancers.",
      },
      {
        property: "og:title",
        content: "Portfolio Pro — Create a Portfolio That Gets You Hired",
      },
      {
        property: "og:description",
        content:
          "Build a stunning personal portfolio in minutes. Designed for developers, designers, photographers, video editors and creative freelancers.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      <BackdropGlow />
      <Nav />
      <Hero />
      <TrustedBy />
      <Features />
      <Templates />
      <Showcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

/* ---------------- Ambient background ---------------- */
function BackdropGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hero-glow"
    />
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={[
          "flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
          scrolled ? "glass-panel" : "bg-transparent",
        ].join(" ")}
      >
        <a href="#" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">
            Portfolio Pro
          </span>
        </a>
        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {["Features", "Templates", "Showcase", "Pricing", "FAQ"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="transition-colors hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="hidden rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Sign in
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </nav>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="relative h-7 w-7 overflow-hidden rounded-lg brand-gradient">
      <div className="absolute inset-0 grid place-items-center text-[11px] font-black text-white">
        P
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
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
      {/* floating cards */}
      <FloatingCards parallax={parallax} />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="animate-fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass-panel px-3 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--violet)]" />
          New — AI-powered portfolio builder
        </div>

        <h1
          className="animate-fade-up text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Create a portfolio that{" "}
          <span className="text-gradient">gets you hired.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Build a beautiful personal website in minutes and showcase your work
          like a professional. For designers, developers, photographers and
          creators who care about craft.
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-10px_oklch(0.55_0.25_295/0.6)] transition-transform hover:scale-[1.02]"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 rounded-xl glass-panel px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/10"
          >
            View demo
          </a>
        </div>

        <p
          className="animate-fade-up mt-6 text-xs text-muted-foreground"
          style={{ animationDelay: "320ms" }}
        >
          Free forever plan · No credit card required
        </p>
      </div>
    </section>
  );
}

function FloatingCards({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="animate-float-slow absolute left-[6%] top-[28%] w-56 -rotate-6"
        style={{
          transform: `translate(${parallax.x * -1}px, ${parallax.y * -1}px) rotate(-6deg)`,
        }}
      >
        <MiniCard
          title="UI/UX Design"
          subtitle="Banking app · 2024"
          accent="var(--electric)"
        />
      </div>
      <div
        className="animate-float-medium absolute right-[7%] top-[22%] w-60 rotate-[8deg]"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px) rotate(8deg)`,
        }}
      >
        <MiniCard
          title="Brand Identity"
          subtitle="Nova Studio · 2024"
          accent="var(--violet)"
        />
      </div>
      <div
        className="animate-float-slow absolute bottom-[14%] left-[14%] w-52 rotate-[5deg]"
        style={{
          transform: `translate(${parallax.x * 0.6}px, ${parallax.y * 0.6}px) rotate(5deg)`,
          animationDelay: "1.2s",
        }}
      >
        <MiniCard
          title="Photography"
          subtitle="Editorial · Lagos"
          accent="var(--cyan)"
        />
      </div>
      <div
        className="animate-float-medium absolute bottom-[16%] right-[12%] w-52 -rotate-[7deg]"
        style={{
          transform: `translate(${parallax.x * -0.7}px, ${parallax.y * -0.7}px) rotate(-7deg)`,
          animationDelay: "0.8s",
        }}
      >
        <MiniCard
          title="Web Development"
          subtitle="React · TypeScript"
          accent="var(--royal)"
        />
      </div>
    </div>
  );
}

function MiniCard({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div
        className="h-24 w-full"
        style={{
          background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 30%, transparent))`,
        }}
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
  const logos = [
    "NOVA", "Lumen", "Pixel&Co", "Aperture", "FORM", "Northwind",
    "Helio", "Quartz", "Atlas", "Mirage",
  ];
  return (
    <section className="relative py-16">
      <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by 40,000+ creators and teams
      </p>
      <div className="relative mx-auto max-w-6xl overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="animate-marquee flex w-max gap-14 px-6">
          {[...logos, ...logos].map((l, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-muted-foreground/70"
            >
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
    {
      icon: Layers,
      title: "Drag & drop builder",
      desc: "Compose sections like Lego blocks. Reorder, restyle, and ship in minutes.",
    },
    {
      icon: Palette,
      title: "Premium templates",
      desc: "Dozens of award-winning templates crafted by senior designers.",
    },
    {
      icon: Globe,
      title: "Your own domain",
      desc: "Use portfoliopro.com/you or connect a custom domain in one click.",
    },
    {
      icon: BarChart3,
      title: "Real-time analytics",
      desc: "Track views, sources, and engagement on every project you publish.",
    },
    {
      icon: Brain,
      title: "AI writing assist",
      desc: "Write better case studies with an assistant trained on great portfolios.",
    },
    {
      icon: Shield,
      title: "Built-in SEO",
      desc: "Auto-generated meta, OG cards and sitemaps so clients find you on Google.",
    },
  ];
  return (
    <section id="features" className="relative px-4 py-28">
      <SectionHeader
        eyebrow="Features"
        title="Everything you need to look professional."
        sub="Designed end-to-end so your work looks as good as it really is."
      />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="group relative overflow-hidden rounded-2xl glass-panel p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white shadow-[0_10px_30px_-10px_oklch(0.55_0.25_295/0.7)]">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold tracking-tight">
              {it.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {it.desc}
            </p>
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
      <SectionHeader
        eyebrow="Templates"
        title="Start from a masterpiece."
        sub="Hand-crafted templates for every profession. Tweak anything."
      />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tpls.map((t) => (
          <div
            key={t.name}
            className="group relative overflow-hidden rounded-3xl glass-panel"
          >
            <div
              className="relative aspect-[4/5] w-full overflow-hidden"
              style={{ background: t.grad }}
            >
              <div className="absolute inset-x-6 bottom-6 rounded-xl bg-black/30 p-3 backdrop-blur-md">
                <p className="text-xs uppercase tracking-widest text-white/70">
                  {t.role}
                </p>
                <p className="mt-0.5 text-xl font-semibold text-white">
                  {t.name}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">{t.name}</span>
              <button className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-white/15">
                Use template
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Showcase ---------------- */
function Showcase() {
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
      <SectionHeader
        eyebrow="Showcase"
        title="Made by creators like you."
        sub="A peek at portfolios already getting our makers hired."
      />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
        {creators.map((c) => (
          <div
            key={c.name}
            className="group relative overflow-hidden rounded-2xl glass-panel"
          >
            <div
              className="aspect-[4/3] w-full"
              style={{ background: c.grad }}
            />
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                <c.icon className="h-4 w-4" />
              </div>
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
    {
      quote:
        "I got 3 client inquiries in the first week after launching my Portfolio Pro site. The templates feel genuinely high-end.",
      name: "Elena Marquez",
      role: "Brand Designer",
    },
    {
      quote:
        "It replaced my Webflow + Notion + Linktree stack. The builder is fast and the result looks like an agency made it.",
      name: "David Okoye",
      role: "Full-stack Developer",
    },
    {
      quote:
        "The AI case-study assistant alone is worth it. Writing project descriptions used to take me a whole afternoon.",
      name: "Yuki Tanaka",
      role: "Product Designer",
    },
    {
      quote:
        "Clean, fast, and beautifully animated. My photography clients keep asking who built my site.",
      name: "Priya Sharma",
      role: "Photographer",
    },
  ];
  return (
    <section className="relative px-4 py-28">
      <SectionHeader
        eyebrow="Loved by creators"
        title="Words from real makers."
      />
      <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((t) => (
          <figure
            key={t.name}
            className="glass-panel relative rounded-2xl p-6"
          >
            <div className="flex gap-0.5 text-[color:var(--violet)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/90">
              "{t.quote}"
            </blockquote>
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

/* ---------------- Pricing ---------------- */
function Pricing() {
  const [yearly, setYearly] = useState(true);
  const plans = [
    {
      name: "Free",
      desc: "Everything to start.",
      monthly: 0,
      yearlyP: 0,
      features: ["1 portfolio site", "5 projects", "Portfolio Pro subdomain", "Basic analytics"],
      cta: "Get started",
      highlight: false,
    },
    {
      name: "Pro",
      desc: "For serious creators.",
      monthly: 12,
      yearlyP: 9,
      features: [
        "Unlimited projects",
        "Custom domain",
        "Premium templates",
        "Advanced analytics",
        "AI writing assistant",
        "Remove branding",
      ],
      cta: "Start Pro trial",
      highlight: true,
    },
    {
      name: "Studio",
      desc: "Teams and agencies.",
      monthly: 29,
      yearlyP: 24,
      features: [
        "Everything in Pro",
        "5 team seats",
        "Client portals",
        "Priority support",
        "White-label exports",
      ],
      cta: "Contact sales",
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="relative px-4 py-28">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple, honest pricing."
        sub="Start free. Upgrade when you're ready."
      />
      <div className="mx-auto mt-8 flex items-center justify-center gap-3">
        <span className={!yearly ? "text-foreground" : "text-muted-foreground"}>
          Monthly
        </span>
        <button
          onClick={() => setYearly(!yearly)}
          className="relative h-7 w-12 rounded-full glass-panel"
          aria-label="Toggle billing"
        >
          <span
            className={[
              "absolute top-0.5 h-6 w-6 rounded-full brand-gradient transition-transform",
              yearly ? "translate-x-5" : "translate-x-0.5",
            ].join(" ")}
          />
        </button>
        <span className={yearly ? "text-foreground" : "text-muted-foreground"}>
          Yearly
          <span className="ml-2 rounded-full bg-[color:var(--violet)]/20 px-2 py-0.5 text-[10px] font-medium text-[color:var(--violet)]">
            Save 25%
          </span>
        </span>
      </div>
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((p) => {
          const price = yearly ? p.yearlyP : p.monthly;
          return (
            <div
              key={p.name}
              className={[
                "relative overflow-hidden rounded-3xl p-7 transition-transform hover:-translate-y-1",
                p.highlight
                  ? "border border-white/15 bg-gradient-to-b from-[color:var(--royal)]/20 to-[color:var(--electric)]/5 shadow-[0_30px_80px_-30px_oklch(0.55_0.25_295/0.6)]"
                  : "glass-panel",
              ].join(" ")}
            >
              {p.highlight && (
                <div className="absolute right-5 top-5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground">
                  Most popular
                </div>
              )}
              <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">
                  ${price}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <button
                className={[
                  "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-transform hover:scale-[1.01]",
                  p.highlight
                    ? "brand-gradient text-white"
                    : "bg-white/10 text-foreground hover:bg-white/15",
                ].join(" ")}
              >
                {p.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <ul className="mt-7 space-y-2.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-foreground/90"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--cyan)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    {
      q: "Do I need to know how to code?",
      a: "No. Portfolio Pro is fully visual. Pick a template, edit content, and publish.",
    },
    {
      q: "Can I use my own domain?",
      a: "Yes — connect any custom domain on the Pro plan and we'll handle SSL automatically.",
    },
    {
      q: "Is there a free plan?",
      a: "Yes. The Free plan lets you publish a real portfolio with up to 5 projects on a portfoliopro.com subdomain.",
    },
    {
      q: "Can I export my site?",
      a: "Studio plan customers can export a static build of their portfolio at any time.",
    },
    {
      q: "Do you support teams?",
      a: "The Studio plan includes 5 seats with client portals and shared assets.",
    },
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
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-[15px] font-medium">{it.q}</span>
                {isOpen ? (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              <div
                className={[
                  "grid transition-all duration-300 ease-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {it.a}
                  </p>
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hero-glow opacity-80"
        />
        <div className="relative">
          <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient shadow-[0_20px_60px_-20px_oklch(0.55_0.25_295/0.7)]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
            Your next client is one portfolio away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join 40,000+ creators building their professional presence on
            Portfolio Pro.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-white/15"
            >
              See pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "Templates", "Pricing", "Changelog"],
    },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    { title: "Resources", links: ["Help center", "Community", "Guides", "API"] },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Cookies", "DPA"],
    },
  ];
  return (
    <footer className="relative border-t border-white/5 px-4 pb-10 pt-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-sm font-semibold">Portfolio Pro</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Build your professional presence. Impress every client.
          </p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-lg glass-panel transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/90">
              {c.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Portfolio Pro. All rights reserved.</p>
        <p>Crafted with care for creators.</p>
      </div>
    </footer>
  );
}

/* ---------------- Section header ---------------- */
function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--violet)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {sub && (
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}
