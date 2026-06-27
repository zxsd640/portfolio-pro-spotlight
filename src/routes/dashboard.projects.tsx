import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, Image as ImageIcon, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useSound } from "@/lib/sound";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

type Project = { id: string; name: string; category: string; tags: string[]; grad: string; date: string };

const initial: Project[] = [
  { id: "1", name: "Lumen Banking", category: "Product Design", tags: ["UI", "Fintech"], grad: "linear-gradient(135deg,#7c3aed,#06b6d4)", date: "2024-08" },
  { id: "2", name: "Nova Brand", category: "Brand Identity", tags: ["Logo", "Brand"], grad: "linear-gradient(135deg,#f43f5e,#f97316)", date: "2024-06" },
  { id: "3", name: "Reel Studio", category: "Motion", tags: ["After Effects"], grad: "linear-gradient(135deg,#3b82f6,#22d3ee)", date: "2024-03" },
];

const gradients = [
  "linear-gradient(135deg,#7c3aed,#06b6d4)",
  "linear-gradient(135deg,#f43f5e,#f97316)",
  "linear-gradient(135deg,#3b82f6,#22d3ee)",
  "linear-gradient(135deg,#a855f7,#ec4899)",
  "linear-gradient(135deg,#10b981,#6366f1)",
];

function ProjectsPage() {
  const [projects, setProjects] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", tags: "" });
  const { play } = useSound();

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const g = gradients[Math.floor(Math.random() * gradients.length)];
    setProjects((p) => [{ id: String(Date.now()), name: form.name, category: form.category, tags: form.tags.split(",").map(s => s.trim()).filter(Boolean), grad: g, date: new Date().toISOString().slice(0, 7) }, ...p]);
    setForm({ name: "", category: "", tags: "" });
    setOpen(false);
    play("success");
  };

  const remove = (id: string) => {
    setProjects((p) => p.filter((x) => x.id !== id));
    play("click");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Projects</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your work</h1>
          <p className="mt-1 text-sm text-muted-foreground">{projects.length} projects · unlimited storage</p>
        </div>
        <button onClick={() => { setOpen(true); play("notify"); }} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-sm font-medium text-white hover:scale-[1.03] transition-transform cursor-pointer">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState onAdd={() => setOpen(true)} />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div
              key={p.id}
              data-sound-hover
              className="group relative overflow-hidden rounded-2xl glass-panel transition-all duration-300 hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-110" style={{ background: p.grad }} />
                <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button data-sound className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white hover:bg-black/70 cursor-pointer backdrop-blur-md"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(p.id)} data-sound className="grid h-8 w-8 place-items-center rounded-lg bg-black/50 text-white hover:bg-red-500/70 cursor-pointer backdrop-blur-md"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.date}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{t}</span>
                  ))}
                </div>
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
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
              <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
              <button type="submit" data-sound data-sound-hover className="w-full inline-flex items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-medium text-white hover:scale-[1.01] transition-transform cursor-pointer">
                Add project
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
