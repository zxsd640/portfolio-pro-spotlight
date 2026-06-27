import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wand2, Plus, Trash2, Save, Sparkles, Check, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useSound } from "@/lib/sound";
import { polishPortfolio } from "@/lib/ai";

export const Route = createFileRoute("/dashboard/builder")({
  component: BuilderPage,
});

type Project = { id?: string; title: string; description: string; link_url: string; tags: string };
type Skill = { id?: string; name: string; level: number };
type Experience = { id?: string; role: string; company: string; start_date: string; end_date: string; description: string };
type Achievement = { id?: string; title: string; description: string; date: string };
type Social = { id?: string; platform: string; url: string };

type Form = {
  display_name: string;
  title: string;
  bio: string;
  location: string;
  username: string;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  achievements: Achievement[];
  socials: Social[];
};

const empty: Form = {
  display_name: "", title: "", bio: "", location: "", username: "",
  projects: [], skills: [], experience: [], achievements: [], socials: [],
};

const STEPS = ["Basics", "Skills", "Projects", "Experience", "Achievements", "Socials", "Review"] as const;

function BuilderPage() {
  const { user } = useAuth();
  const { play } = useSound();
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
  const [polishing, setPolishing] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: prof }, { data: projects }, { data: skills }, { data: exp }, { data: ach }, { data: soc }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("projects").select("*").eq("user_id", user.id).order("sort_order"),
        supabase.from("skills").select("*").eq("user_id", user.id).order("sort_order"),
        supabase.from("experience").select("*").eq("user_id", user.id).order("sort_order"),
        supabase.from("achievements").select("*").eq("user_id", user.id).order("sort_order"),
        supabase.from("social_links").select("*").eq("user_id", user.id).order("sort_order"),
      ]);
      setForm({
        display_name: prof?.display_name ?? "",
        title: prof?.title ?? "",
        bio: prof?.bio ?? "",
        location: prof?.location ?? "",
        username: prof?.username ?? "",
        projects: (projects ?? []).map((p: any) => ({ id: p.id, title: p.title, description: p.description ?? "", link_url: p.link_url ?? "", tags: (p.tags ?? []).join(", ") })),
        skills: (skills ?? []).map((s: any) => ({ id: s.id, name: s.name, level: s.level })),
        experience: (exp ?? []).map((e: any) => ({ id: e.id, role: e.role, company: e.company ?? "", start_date: e.start_date ?? "", end_date: e.end_date ?? "", description: e.description ?? "" })),
        achievements: (ach ?? []).map((a: any) => ({ id: a.id, title: a.title, description: a.description ?? "", date: a.date ?? "" })),
        socials: (soc ?? []).map((s: any) => ({ id: s.id, platform: s.platform, url: s.url })),
      });
      setLoading(false);
    })();
  }, [user]);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error: pErr } = await supabase.from("profiles").update({
        display_name: form.display_name,
        title: form.title,
        bio: form.bio,
        location: form.location,
        username: form.username || undefined,
      }).eq("id", user.id);
      if (pErr) throw pErr;

      // Replace strategy: delete then insert (simple & reliable)
      await supabase.from("projects").delete().eq("user_id", user.id);
      await supabase.from("skills").delete().eq("user_id", user.id);
      await supabase.from("experience").delete().eq("user_id", user.id);
      await supabase.from("achievements").delete().eq("user_id", user.id);
      await supabase.from("social_links").delete().eq("user_id", user.id);
      const runs: Array<{ error: any } | undefined> = [];
      if (form.projects.length) runs.push(await supabase.from("projects").insert(form.projects.map((p, i) => ({
        user_id: user.id, title: p.title, description: p.description, link_url: p.link_url || null,
        tags: p.tags.split(",").map((t) => t.trim()).filter(Boolean), sort_order: i,
      }))));
      if (form.skills.length) runs.push(await supabase.from("skills").insert(form.skills.map((s, i) => ({ user_id: user.id, name: s.name, level: s.level, sort_order: i }))));
      if (form.experience.length) runs.push(await supabase.from("experience").insert(form.experience.map((e, i) => ({ user_id: user.id, role: e.role, company: e.company, start_date: e.start_date, end_date: e.end_date, description: e.description, sort_order: i }))));
      if (form.achievements.length) runs.push(await supabase.from("achievements").insert(form.achievements.map((a, i) => ({ user_id: user.id, title: a.title, description: a.description, date: a.date, sort_order: i }))));
      if (form.socials.length) runs.push(await supabase.from("social_links").insert(form.socials.map((s, i) => ({ user_id: user.id, platform: s.platform, url: s.url, sort_order: i }))));
      for (const r of runs) if (r?.error) throw r.error;

      play("success");
      setSavedAt(Date.now());
    } catch (e: any) {
      setError(e?.message || "Failed to save");
      play("notify");
    } finally {
      setSaving(false);
    }
  };

  const polish = async () => {
    setPolishing(true);
    setError(null);
    try {
      const result = await polishPortfolio({
        display_name: form.display_name,
        title: form.title,
        bio: form.bio,
        projects: form.projects.map((p) => ({ title: p.title, description: p.description })),
        experience: form.experience.map((e) => ({ role: e.role, company: e.company, description: e.description })),
        achievements: form.achievements.map((a) => ({ title: a.title, description: a.description })),
      });
      setForm((f) => ({
        ...f,
        title: result.title || f.title,
        bio: result.bio || f.bio,
        projects: f.projects.map((p, i) => ({ ...p, description: result.projects?.[i]?.description ?? p.description })),
        experience: f.experience.map((e, i) => ({ ...e, description: result.experience?.[i]?.description ?? e.description })),
        achievements: f.achievements.map((a, i) => ({ ...a, description: result.achievements?.[i]?.description ?? a.description })),
      }));
      play("success");
    } catch (e: any) {
      setError(e?.message || "AI polish failed");
      play("notify");
    } finally {
      setPolishing(false);
    }
  };

  if (loading) {
    return <div className="grid h-64 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--violet)]" /></div>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="animate-fade-up">
        <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">AI portfolio builder</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Tell us about <span className="text-gradient">you.</span></h1>
        <p className="mt-2 text-sm text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => { setStep(i); play("nav"); }}
            data-sound
            className={["rounded-full px-3 py-1 text-xs transition-all", i === step ? "brand-gradient text-white" : i < step ? "bg-white/10 text-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10"].join(" ")}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div className="mt-6 glass-panel rounded-2xl p-6">
        {step === 0 && <BasicsStep form={form} update={update} />}
        {step === 1 && <SkillsStep form={form} update={update} />}
        {step === 2 && <ProjectsStep form={form} update={update} />}
        {step === 3 && <ExperienceStep form={form} update={update} />}
        {step === 4 && <AchievementsStep form={form} update={update} />}
        {step === 5 && <SocialsStep form={form} update={update} />}
        {step === 6 && <ReviewStep form={form} onPolish={polish} polishing={polishing} />}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-300">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            data-sound
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-3 w-3" /> Back
          </button>
          <div className="flex items-center gap-2">
            {savedAt && Date.now() - savedAt < 4000 && (
              <span className="inline-flex items-center gap-1 text-xs text-[color:var(--cyan)]"><Check className="h-3 w-3" /> Saved</span>
            )}
            <button onClick={save} disabled={saving} data-sound data-sound-hover className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 disabled:opacity-60">
              <Save className="h-3 w-3" /> {saving ? "Saving…" : "Save"}
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} data-sound data-sound-hover className="inline-flex items-center gap-1 rounded-xl brand-gradient px-3 py-2 text-xs text-white">
                Next <ChevronRight className="h-3 w-3" />
              </button>
            ) : (
              <button onClick={polish} disabled={polishing} data-sound data-sound-hover className="inline-flex items-center gap-1 rounded-xl brand-gradient px-3 py-2 text-xs text-white disabled:opacity-60">
                <Wand2 className="h-3 w-3" /> {polishing ? "Polishing…" : "Polish with AI"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      <input {...props} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
    </label>
  );
}
function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>
      <textarea {...props} className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors min-h-[100px]" />
    </label>
  );
}

function BasicsStep({ form, update }: any) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="Full name" value={form.display_name} onChange={(e) => update("display_name", e.target.value)} placeholder="Ada Lovelace" />
      <Input label="Username (your URL)" value={form.username} onChange={(e) => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))} placeholder="ada" />
      <Input label="Title" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Frontend Developer" />
      <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Remote · London" />
      <div className="sm:col-span-2">
        <TextArea label="Short bio" value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="What do you do? What drives you?" />
      </div>
    </div>
  );
}
function SkillsStep({ form, update }: any) {
  return (
    <ListEditor
      items={form.skills}
      onChange={(v) => update("skills", v)}
      empty={{ name: "", level: 80 }}
      addLabel="Add skill"
      render={(item, set) => (
        <div className="grid gap-2 sm:grid-cols-[1fr_140px]">
          <Input label="Skill" value={item.name} onChange={(e) => set({ ...item, name: e.target.value })} placeholder="React" />
          <Input label="Level (0-100)" type="number" min={0} max={100} value={item.level} onChange={(e) => set({ ...item, level: Number(e.target.value) })} />
        </div>
      )}
    />
  );
}
function ProjectsStep({ form, update }: any) {
  return (
    <ListEditor
      items={form.projects}
      onChange={(v) => update("projects", v)}
      empty={{ title: "", description: "", link_url: "", tags: "" }}
      addLabel="Add project"
      render={(item, set) => (
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input label="Title" value={item.title} onChange={(e) => set({ ...item, title: e.target.value })} />
            <Input label="Link" value={item.link_url} onChange={(e) => set({ ...item, link_url: e.target.value })} placeholder="https://…" />
          </div>
          <Input label="Tags (comma separated)" value={item.tags} onChange={(e) => set({ ...item, tags: e.target.value })} placeholder="React, TypeScript" />
          <TextArea label="Description" value={item.description} onChange={(e) => set({ ...item, description: e.target.value })} />
        </div>
      )}
    />
  );
}
function ExperienceStep({ form, update }: any) {
  return (
    <ListEditor
      items={form.experience}
      onChange={(v) => update("experience", v)}
      empty={{ role: "", company: "", start_date: "", end_date: "", description: "" }}
      addLabel="Add role"
      render={(item, set) => (
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <Input label="Role" value={item.role} onChange={(e) => set({ ...item, role: e.target.value })} />
            <Input label="Company" value={item.company} onChange={(e) => set({ ...item, company: e.target.value })} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input label="Start" value={item.start_date} onChange={(e) => set({ ...item, start_date: e.target.value })} placeholder="2023" />
            <Input label="End" value={item.end_date} onChange={(e) => set({ ...item, end_date: e.target.value })} placeholder="Present" />
          </div>
          <TextArea label="What did you do?" value={item.description} onChange={(e) => set({ ...item, description: e.target.value })} />
        </div>
      )}
    />
  );
}
function AchievementsStep({ form, update }: any) {
  return (
    <ListEditor
      items={form.achievements}
      onChange={(v) => update("achievements", v)}
      empty={{ title: "", description: "", date: "" }}
      addLabel="Add achievement"
      render={(item, set) => (
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_160px]">
            <Input label="Title" value={item.title} onChange={(e) => set({ ...item, title: e.target.value })} />
            <Input label="Date" value={item.date} onChange={(e) => set({ ...item, date: e.target.value })} placeholder="2024" />
          </div>
          <TextArea label="Description" value={item.description} onChange={(e) => set({ ...item, description: e.target.value })} />
        </div>
      )}
    />
  );
}
function SocialsStep({ form, update }: any) {
  return (
    <ListEditor
      items={form.socials}
      onChange={(v) => update("socials", v)}
      empty={{ platform: "", url: "" }}
      addLabel="Add link"
      render={(item, set) => (
        <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
          <Input label="Platform" value={item.platform} onChange={(e) => set({ ...item, platform: e.target.value })} placeholder="GitHub" />
          <Input label="URL" value={item.url} onChange={(e) => set({ ...item, url: e.target.value })} placeholder="https://…" />
        </div>
      )}
    />
  );
}

function ReviewStep({ form, onPolish, polishing }: any) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl brand-gradient"><Sparkles className="h-4 w-4 text-white" /></div>
        <div>
          <p className="text-sm font-semibold">Review your portfolio</p>
          <p className="text-xs text-muted-foreground">Hit “Polish with AI” to instantly rewrite your bio, projects, and experience.</p>
        </div>
        <button onClick={onPolish} disabled={polishing} data-sound className="ml-auto inline-flex items-center gap-1 rounded-xl brand-gradient px-3 py-2 text-xs text-white disabled:opacity-60">
          <Wand2 className="h-3 w-3" /> {polishing ? "Polishing…" : "Polish with AI"}
        </button>
      </div>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <Stat k="Name" v={form.display_name || "—"} />
        <Stat k="Username" v={form.username ? `/${form.username}` : "—"} />
        <Stat k="Title" v={form.title || "—"} />
        <Stat k="Location" v={form.location || "—"} />
        <Stat k="Projects" v={String(form.projects.length)} />
        <Stat k="Skills" v={String(form.skills.length)} />
        <Stat k="Experience" v={String(form.experience.length)} />
        <Stat k="Achievements" v={String(form.achievements.length)} />
      </dl>
      {form.bio && (
        <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-muted-foreground">
          <p className="mb-1 text-xs uppercase tracking-widest text-foreground">Bio</p>
          {form.bio}
        </div>
      )}
    </div>
  );
}
function Stat({ k, v }: any) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
      <p className="mt-0.5 truncate">{v}</p>
    </div>
  );
}

function ListEditor<T>({ items, onChange, empty, addLabel, render }: { items: T[]; onChange: (v: T[]) => void; empty: T; addLabel: string; render: (item: T, set: (next: T) => void) => React.ReactNode }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          {render(item, (next) => onChange(items.map((it, j) => (j === i ? next : it))))}
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} data-sound className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-300">
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { ...empty }])} data-sound className="inline-flex items-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-3 py-2 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground">
        <Plus className="h-3 w-3" /> {addLabel}
      </button>
    </div>
  );
}
