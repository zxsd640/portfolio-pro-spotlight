import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Heart, FolderKanban, Sparkles, ArrowRight, Wand2, ExternalLink, Share2, Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function useCounter(target: number, duration = 900) {
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
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, views: 0, likes: 0 });
  const [profile, setProfile] = useState<{ username: string; display_name: string | null; published: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: prof }, { count: projects }, { count: views }, { count: likes }] = await Promise.all([
        supabase.from("profiles").select("username, display_name, published").eq("id", user.id).maybeSingle(),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("portfolio_views").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("portfolio_likes").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
      ]);
      setProfile(prof as any);
      setStats({ projects: projects ?? 0, views: views ?? 0, likes: likes ?? 0 });
    })();
  }, [user]);

  const shareUrl = profile ? `${typeof window !== "undefined" ? window.location.origin : ""}/${profile.username}` : "";

  const copyShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="animate-fade-up">
        <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Welcome{profile?.display_name ? `, ${profile.display_name.split(" ")[0]}` : ""}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Let's grow your <span className="text-gradient">presence.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Your live numbers, updated in real time.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FolderKanban} label="Projects" value={stats.projects} color="var(--violet)" delay={0} />
        <StatCard icon={Eye} label="Portfolio views" value={stats.views} color="var(--electric)" delay={80} />
        <StatCard icon={Heart} label="Likes" value={stats.likes} color="var(--cyan)" delay={160} />
      </div>

      {profile && (
        <div className="mt-8 glass-panel rounded-2xl p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl brand-gradient">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Your public portfolio</p>
              <p className="truncate text-xs text-muted-foreground">{shareUrl}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={copyShare} data-sound className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
                {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Share2 className="h-3 w-3" /> Share</>}
              </button>
              <a href={`/${profile.username}`} target="_blank" rel="noreferrer" data-sound className="inline-flex items-center gap-1.5 rounded-xl brand-gradient px-3 py-2 text-xs text-white">
                Open <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          {!profile.published && (
            <p className="mt-3 text-xs text-muted-foreground">
              Portfolio is in <span className="text-foreground">draft</span>. Publish it in Settings to make it public.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Link to="/dashboard/builder" data-sound data-sound-hover className="glass-panel group rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl brand-gradient"><Wand2 className="h-4 w-4 text-white" /></div>
            <p className="text-sm font-semibold">Build with AI</p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Answer a few questions and let AI write a polished portfolio for you in seconds.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs text-[color:var(--violet)]">Start <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
        </Link>
        <Link to="/dashboard/projects" data-sound data-sound-hover className="glass-panel group rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><FolderKanban className="h-4 w-4" /></div>
            <p className="text-sm font-semibold">Manage projects</p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Add, edit, and reorder the work you want to showcase.</p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs text-[color:var(--violet)]">Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></span>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay }: any) {
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
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{v.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
