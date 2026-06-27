import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Heart, TrendingUp, Globe2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
});

type ViewRow = { viewed_at: string; referrer: string | null };

function AnalyticsPage() {
  const { user } = useAuth();
  const [views, setViews] = useState<ViewRow[]>([]);
  const [likes, setLikes] = useState(0);
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();
      const [{ data: v }, { count: l }] = await Promise.all([
        supabase.from("portfolio_views").select("viewed_at, referrer").eq("profile_id", user.id).gte("viewed_at", since).order("viewed_at"),
        supabase.from("portfolio_likes").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
      ]);
      setViews((v ?? []) as ViewRow[]);
      setLikes(l ?? 0);
      setLoading(false);
    })();
  }, [user, range]);

  // Bucket by day
  const buckets: Record<string, number> = {};
  for (let i = range - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const k = d.toISOString().slice(0, 10);
    buckets[k] = 0;
  }
  for (const v of views) {
    const k = v.viewed_at.slice(0, 10);
    if (k in buckets) buckets[k]++;
  }
  const series = Object.entries(buckets);
  const max = Math.max(1, ...series.map(([, n]) => n));

  // Top referrers
  const refMap: Record<string, number> = {};
  for (const v of views) {
    const r = v.referrer ? new URL(v.referrer.startsWith("http") ? v.referrer : `https://${v.referrer}`).hostname : "Direct";
    refMap[r] = (refMap[r] ?? 0) + 1;
  }
  const topRefs = Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Analytics</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Insights</h1>
        </div>
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {[7, 30, 90].map((r) => (
            <button key={r} onClick={() => setRange(r as any)} data-sound className={["rounded-lg px-3 py-1.5 text-xs transition-all", range === r ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"].join(" ")}>
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat icon={Eye} label={`Views (${range}d)`} value={views.length} color="var(--electric)" />
        <Stat icon={Heart} label="Total likes" value={likes} color="var(--violet)" />
        <Stat icon={TrendingUp} label="Daily average" value={Math.round(views.length / range)} color="var(--cyan)" />
      </div>

      <div className="mt-6 glass-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold">Views over time</h2>
        {loading ? (
          <div className="grid h-44 place-items-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--violet)]" /></div>
        ) : (
          <div className="mt-6 flex items-end gap-1 h-44">
            {series.map(([k, n]) => (
              <div key={k} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${k}: ${n}`}>
                <div className="w-full rounded-t brand-gradient transition-all" style={{ height: `${(n / max) * 100}%`, minHeight: 2, opacity: 0.4 + (n / max) * 0.6 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 glass-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold">Top referrers</h2>
        {topRefs.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No traffic yet. Share your portfolio link to start seeing data.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {topRefs.map(([host, n]) => (
              <li key={host} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/5">
                <span className="inline-flex items-center gap-2 text-sm"><Globe2 className="h-3.5 w-3.5 text-muted-foreground" /> {host}</span>
                <span className="text-xs text-muted-foreground">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <div data-sound-hover className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `color-mix(in oklab, ${color} 20%, transparent)`, color }}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
