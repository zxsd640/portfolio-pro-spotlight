import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
});

const ranges = ["7D", "30D", "90D", "1Y"] as const;

function AnalyticsPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("30D");
  const data = generateData(range);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Analytics</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Audience insights</h1>
        </div>
        <div className="flex gap-1 rounded-xl glass-panel p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              data-sound="nav"
              className={["rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer", range === r ? "brand-gradient text-white" : "text-muted-foreground hover:text-foreground"].join(" ")}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          { label: "Visitors", v: data.visitors, c: "var(--electric)" },
          { label: "Avg. session", v: data.session, c: "var(--violet)" },
          { label: "Conversion", v: data.conv, c: "var(--cyan)" },
        ].map((m) => (
          <div key={m.label} data-sound-hover className="glass-panel rounded-2xl p-5 transition-all hover:-translate-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="mt-2 text-3xl font-semibold" style={{ color: `oklch(0.8 0.15 280)` }}>{m.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 glass-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold">Traffic</h2>
        <Bars points={data.points} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-base font-semibold">Top sources</h2>
          <ul className="mt-4 space-y-3">
            {[
              { s: "Direct", p: 42 }, { s: "Search", p: 28 }, { s: "Social", p: 18 }, { s: "Referral", p: 12 },
            ].map((x) => (
              <li key={x.s}>
                <div className="flex items-center justify-between text-sm">
                  <span>{x.s}</span><span className="text-muted-foreground">{x.p}%</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full brand-gradient transition-all duration-700" style={{ width: `${x.p}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-base font-semibold">Top countries</h2>
          <ul className="mt-4 space-y-3">
            {[
              { s: "United States", p: 36 }, { s: "United Kingdom", p: 18 }, { s: "Germany", p: 14 }, { s: "Egypt", p: 11 }, { s: "Other", p: 21 },
            ].map((x) => (
              <li key={x.s}>
                <div className="flex items-center justify-between text-sm">
                  <span>{x.s}</span><span className="text-muted-foreground">{x.p}%</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full brand-gradient transition-all duration-700" style={{ width: `${x.p}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function generateData(range: string) {
  const len = range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 30 : 12;
  const points = Array.from({ length: len }, (_, i) => 20 + Math.round(40 * Math.sin(i / 2) + Math.random() * 30));
  const sum = points.reduce((a, b) => a + b, 0);
  return { points, visitors: sum.toLocaleString(), session: "2m 14s", conv: "4.8%" };
}

function Bars({ points }: { points: number[] }) {
  const max = Math.max(...points);
  return (
    <div className="mt-6 flex h-44 items-end gap-1.5">
      {points.map((p, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md brand-gradient transition-all duration-700 hover:opacity-80"
          style={{ height: `${(p / max) * 100}%`, animation: "fade-up .6s both", animationDelay: `${i * 20}ms` }}
        />
      ))}
    </div>
  );
}
