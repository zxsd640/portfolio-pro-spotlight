import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Users, MousePointerClick, TrendingUp, ArrowRight, FolderKanban } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

const stats = [
  { icon: Eye, label: "Total views", value: 24890, delta: "+12.4%", color: "var(--electric)" },
  { icon: Users, label: "Unique visitors", value: 8421, delta: "+8.1%", color: "var(--violet)" },
  { icon: MousePointerClick, label: "Profile clicks", value: 1203, delta: "+18.9%", color: "var(--royal)" },
  { icon: TrendingUp, label: "Inquiries", value: 47, delta: "+4 this week", color: "var(--cyan)" },
];

function useCounter(target: number, duration = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function DashboardOverview() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="animate-fade-up">
        <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Welcome back</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your portfolio is <span className="text-gradient">growing.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Here's what happened in the last 30 days.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 80} />
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Views (last 30 days)</h2>
            <span className="text-xs text-muted-foreground">+12.4% vs prev.</span>
          </div>
          <FakeChart />
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-base font-semibold">Top projects</h2>
          <ul className="mt-4 space-y-3">
            {[
              { name: "Lumen Banking", views: 4210 },
              { name: "Nova Brand", views: 3120 },
              { name: "Reel Studio", views: 2090 },
              { name: "FORM System", views: 1840 },
            ].map((p, i) => (
              <li key={p.name} data-sound-hover className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg brand-gradient text-xs font-bold text-white">{i + 1}</span>
                  <span className="text-sm">{p.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{p.views.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <Link to="/dashboard/projects" data-sound className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="mt-8 glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl brand-gradient">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Add your next project</p>
            <p className="text-xs text-muted-foreground">Keep your portfolio fresh — clients love recent work.</p>
          </div>
          <Link to="/dashboard/projects" data-sound data-sound-hover className="ml-auto inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15">
            New project <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, delta, color, delay }: any) {
  const v = useCounter(value);
  return (
    <div
      data-sound-hover
      className="glass-panel relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_oklch(0.55_0.25_295/0.5)] animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `color-mix(in oklab, ${color} 20%, transparent)`, color }}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-medium text-[color:var(--cyan)]">{delta}</span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{v.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FakeChart() {
  const points = [12, 18, 14, 22, 28, 24, 30, 36, 32, 40, 44, 38, 48, 52, 46, 58];
  const max = Math.max(...points);
  const w = 600;
  const h = 180;
  const step = w / (points.length - 1);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h * 0.9}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-6 h-44 w-full">
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.25 295)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.55 0.25 295)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g)" />
      <path d={path} fill="none" stroke="oklch(0.7 0.22 280)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
