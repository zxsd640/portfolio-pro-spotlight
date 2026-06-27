import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Code2, ArrowRight } from "lucide-react";
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
  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <SiteNav />
      <main className="px-4 pt-36 pb-20">
        <div className="mx-auto max-w-3xl animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--violet)]">About</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Built for creators. <span className="text-gradient">Free, always.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Portfolio Pro is the portfolio platform we always wished existed — beautiful by default,
            ridiculously fast, and completely free. No subscriptions, no upsells, no dark patterns.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Whether you're a developer, designer, photographer, video editor, AI creator or freelancer —
            you deserve a portfolio that looks like it cost ten thousand dollars to build. Now it costs nothing.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Heart, label: "Free forever", desc: "Every feature, every template." },
              { icon: Sparkles, label: "Premium craft", desc: "Designed pixel by pixel." },
              { icon: Code2, label: "Lightning fast", desc: "Built on modern tech." },
            ].map((b) => (
              <div key={b.label} data-sound-hover className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white">
                  <b.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold">{b.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 glass-panel rounded-3xl p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Designed &amp; Developed by</p>
            <p className="mt-3 text-3xl font-semibold text-gradient">Zyad Abdou</p>
            <p className="mt-2 text-sm text-muted-foreground">Crafted with care for the creative community.</p>
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/auth" search={{ mode: "register" }} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3 text-sm font-medium text-white hover:scale-[1.03] transition-transform">
              Start building — free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
