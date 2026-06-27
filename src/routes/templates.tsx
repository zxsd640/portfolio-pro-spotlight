import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates · Portfolio Pro" },
      { name: "description", content: "Hand-crafted portfolio templates for every profession." },
    ],
  }),
  component: TemplatesPage,
});

const templates = [
  { name: "Aperture", role: "Photography", grad: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
  { name: "Monolith", role: "Designer", grad: "linear-gradient(135deg,#a855f7,#ec4899)" },
  { name: "Stack", role: "Developer", grad: "linear-gradient(135deg,#22d3ee,#3b82f6)" },
  { name: "Reel", role: "Video Editor", grad: "linear-gradient(135deg,#f97316,#ef4444)" },
  { name: "Studio", role: "Agency", grad: "linear-gradient(135deg,#8b5cf6,#06b6d4)" },
  { name: "Atelier", role: "Illustrator", grad: "linear-gradient(135deg,#10b981,#3b82f6)" },
  { name: "Lumen", role: "Architect", grad: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { name: "Quartz", role: "Writer", grad: "linear-gradient(135deg,#64748b,#0f172a)" },
  { name: "Atlas", role: "Researcher", grad: "linear-gradient(135deg,#06b6d4,#10b981)" },
];

function TemplatesPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <SiteNav />
      <main className="px-4 pt-36 pb-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--violet)]">Templates</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Start from a <span className="text-gradient">masterpiece.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Award-winning templates designed by senior designers — completely free.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <Link
              key={t.name}
              to="/demo"
              data-sound
              data-sound-hover
              className="group relative overflow-hidden rounded-3xl glass-panel transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_40px_80px_-30px_oklch(0.55_0.25_295/0.6)] animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="relative aspect-[4/5]" style={{ background: t.grad }}>
                <div className="absolute inset-x-6 bottom-6 rounded-xl bg-black/30 p-3 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-widest text-white/70">{t.role}</p>
                  <p className="mt-0.5 text-xl font-semibold text-white">{t.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm font-medium">{t.name}</span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs group-hover:bg-white/20 transition-colors">
                  Preview <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
