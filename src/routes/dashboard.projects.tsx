import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, X, Image as ImageIcon, ExternalLink, Trash2, Wand2 } from "lucide-react";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

type Project = { id: string; title: string; description: string | null; link_url: string | null; tags: string[]; image_url: string | null; created_at: string };

const gradients = [
  "linear-gradient(135deg,#7c3aed,#06b6d4)",
  "linear-gradient(135deg,#f43f5e,#f97316)",
  "linear-gradient(135deg,#3b82f6,#22d3ee)",
  "linear-gradient(135deg,#a855f7,#ec4899)",
  "linear-gradient(135deg,#10b981,#6366f1)",
];

function ProjectsPage() {
  const { user } = useAuth();
  const { play } = useSound();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", link_url: "", tags: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setProjects((data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      link_url: form.link_url || null,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSaving(false);
    if (error) { play("notify"); return; }
    setForm({ title: "", description: "", link_url: "", tags: "" });
    setOpen(false);
    play("success");
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects((p) => p.filter((x) => x.id !== id));
    play("click");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Projects</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your work</h1>
          <p className="mt-1 text-sm text-muted-foreground">{projects.length} {projects.length === 1 ? "project" : "projects"}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/builder" data-sound className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm hover:bg-white/10">
            <Wand2 className="h-4 w-4" /> Builder
          </Link>
          <button onClick={() => { setOpen(true); play("notify"); }} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-sm font-medium text-white hover:scale-[1.03] transition-transform cursor-pointer">
            <Plus className="h-4 w-4" /> New project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-12 grid h-40 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--violet)]" /></div>
      ) : projects.length === 0 ? (
        <EmptyState onAdd={() => setOpen(true)} />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div key={p.id} data-sound-hover className="group relative overflow-hidden rounded-2xl glass-panel transition-all duration-300 hover:-translate-y-2 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="relative aspect-[4/3] overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-110" style={{ background: gradients[i % gradients.length] }} />
                )}
                <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => remove(p.id)} data-sound className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white hover:bg-red-500/70 cursor-pointer backdrop-blur-md"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.title}</p>
                    {p.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>}
                  </div>
                  {p.link_url && (
                    <a href={p.link_url} target="_blank" rel="noreferrer" data-sound>
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  )}
                </div>
                {p.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-up">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={add} className="relative w-full max-w-md rounded-2xl glass-panel p-6">
            <button type="button" onClick={() => setOpen(false)} data-sound className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-xl font-semibold">New project</h3>
            <div className="mt-4 space-y-3">
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
              <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="Link (https://…)" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" rows={3} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors resize-none" />
              <button type="submit" disabled={saving} data-sound data-sound-hover className="w-full inline-flex items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-medium text-white hover:scale-[1.01] transition-transform cursor-pointer disabled:opacity-60">
                {saving ? "Adding…" : "Add project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="mt-12 glass-panel rounded-3xl p-12 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl brand-gradient">
        <ImageIcon className="h-7 w-7 text-white" />
      </div>
      <p className="mt-4 text-lg font-semibold">No projects yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Add your first project to start building your portfolio.</p>
      <button onClick={onAdd} data-sound className="mt-6 inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-sm font-medium text-white">
        <Plus className="h-4 w-4" /> Create project
      </button>
    </div>
  );
}
