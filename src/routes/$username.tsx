import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download, ExternalLink, Heart, MapPin, Share2, Sparkles, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MouseGlow } from "@/components/MouseGlow";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const username = params.username.toLowerCase();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();
    if (!profile) throw notFound();
    const [{ data: projects }, { data: skills }, { data: experience }, { data: achievements }, { data: socials }, { count: likes }] = await Promise.all([
      supabase.from("projects").select("*").eq("user_id", profile.id).order("sort_order"),
      supabase.from("skills").select("*").eq("user_id", profile.id).order("sort_order"),
      supabase.from("experience").select("*").eq("user_id", profile.id).order("sort_order"),
      supabase.from("achievements").select("*").eq("user_id", profile.id).order("sort_order"),
      supabase.from("social_links").select("*").eq("user_id", profile.id).order("sort_order"),
      supabase.from("portfolio_likes").select("id", { count: "exact", head: true }).eq("profile_id", profile.id),
    ]);
    return { profile, projects: projects ?? [], skills: skills ?? [], experience: experience ?? [], achievements: achievements ?? [], socials: socials ?? [], likes: likes ?? 0 };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.profile?.display_name || loaderData?.profile?.username} · Portfolio` },
      { name: "description", content: loaderData?.profile?.bio?.slice(0, 160) || "Personal portfolio" },
    ],
  }),
  component: PublicPortfolio,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background text-center px-4">
      <div>
        <h1 className="text-4xl font-semibold">Portfolio not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This username doesn't exist or the portfolio isn't published yet.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-1 text-sm text-[color:var(--violet)] hover:underline">
          <ArrowLeft className="h-3 w-3" /> Go home
        </Link>
      </div>
    </div>
  ),
});

function getVisitorHash() {
  if (typeof window === "undefined") return "ssr";
  let h = localStorage.getItem("pp-vh");
  if (!h) {
    h = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("pp-vh", h);
  }
  return h;
}

function PublicPortfolio() {
  const data = Route.useLoaderData() as any;
  const profile: any = data.profile;
  const projects: any[] = data.projects;
  const skills: any[] = data.skills;
  const experience: any[] = data.experience;
  const achievements: any[] = data.achievements;
  const socials: any[] = data.socials;
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(data.likes as number);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile.published) return;
    const hash = getVisitorHash();
    supabase.from("portfolio_views").insert({
      profile_id: profile.id,
      referrer: typeof document !== "undefined" ? document.referrer.slice(0, 200) : null,
      visitor_hash: hash,
    }).then(() => {});
    supabase.from("portfolio_likes").select("id").eq("profile_id", profile.id).eq("visitor_hash", hash).maybeSingle().then(({ data }) => {
      if (data) setLiked(true);
    });
  }, [profile.id, profile.published]);

  const toggleLike = async () => {
    const hash = getVisitorHash();
    if (liked) {
      await supabase.from("portfolio_likes").delete().eq("profile_id", profile.id).eq("visitor_hash", hash);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from("portfolio_likes").insert({ profile_id: profile.id, visitor_hash: hash });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: profile.display_name || profile.username, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    } catch {}
  };

  const downloadPdf = async () => {
    if (!ref.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(ref.current, { backgroundColor: "#0a0a0f", scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ unit: "px", format: [canvas.width, canvas.height], orientation: "portrait" });
      pdf.addImage(img, "JPEG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${profile.username}-portfolio.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  if (!profile.published) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-center px-4">
        <div>
          <h1 className="text-3xl font-semibold">Portfolio in draft</h1>
          <p className="mt-2 text-sm text-muted-foreground">This portfolio hasn't been published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <MouseGlow />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />

      <div className="fixed right-4 top-4 z-40 flex gap-2">
        <button onClick={toggleLike} className={["inline-flex items-center gap-1.5 rounded-xl border border-white/10 backdrop-blur-xl px-3 py-2 text-xs transition-all", liked ? "bg-[color:var(--violet)]/20 text-foreground" : "bg-background/50 text-muted-foreground hover:bg-white/10"].join(" ")}>
          <Heart className={["h-3.5 w-3.5", liked ? "fill-current" : ""].join(" ")} /> {likeCount}
        </button>
        <button onClick={share} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-background/50 backdrop-blur-xl px-3 py-2 text-xs text-muted-foreground hover:bg-white/10">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />} {copied ? "Copied" : "Share"}
        </button>
        <button onClick={downloadPdf} disabled={downloading} className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-background/50 backdrop-blur-xl px-3 py-2 text-xs text-muted-foreground hover:bg-white/10 disabled:opacity-60">
          <Download className="h-3.5 w-3.5" /> {downloading ? "…" : "PDF"}
        </button>
      </div>

      <div ref={ref} className="mx-auto max-w-4xl px-6 pt-24 pb-24">
        <header className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-[color:var(--violet)]" /> @{profile.username}
          </div>
          <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
            {profile.display_name || profile.username}
          </h1>
          {profile.title && <p className="mt-3 text-xl text-gradient">{profile.title}</p>}
          {profile.location && (
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" /> {profile.location}</p>
          )}
          {profile.bio && <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">{profile.bio}</p>}

          {socials.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
                  {s.platform} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </header>

        {skills.length > 0 && (
          <Section title="Skills">
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.id} className="rounded-xl bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-xs text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full brand-gradient" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <a key={p.id} href={p.link_url || "#"} target={p.link_url ? "_blank" : undefined} rel="noreferrer" className="group glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  {p.description && <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>}
                  {p.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t: string) => <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>)}
                    </div>
                  )}
                  {p.link_url && <span className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--violet)]">Visit <ExternalLink className="h-3 w-3" /></span>}
                </a>
              ))}
            </div>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            <div className="space-y-4">
              {experience.map((e) => (
                <div key={e.id} className="glass-panel rounded-2xl p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold">{e.role}{e.company ? ` · ${e.company}` : ""}</h3>
                    <span className="text-xs text-muted-foreground">{[e.start_date, e.end_date].filter(Boolean).join(" — ")}</span>
                  </div>
                  {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        {achievements.length > 0 && (
          <Section title="Achievements">
            <div className="grid gap-3 sm:grid-cols-2">
              {achievements.map((a) => (
                <div key={a.id} className="glass-panel rounded-2xl p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    {a.date && <span className="text-xs text-muted-foreground">{a.date}</span>}
                  </div>
                  {a.description && <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>}
                </div>
              ))}
            </div>
          </Section>
        )}

        <footer className="mt-24 border-t border-white/5 pt-6 text-center text-xs text-muted-foreground">
          Built with <Link to="/" className="text-foreground hover:underline">Portfolio Pro</Link> · Designed by <span className="text-gradient">Zyad Abdou</span>
        </footer>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16 animate-fade-up">
      <h2 className="text-xs uppercase tracking-widest text-[color:var(--violet)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
