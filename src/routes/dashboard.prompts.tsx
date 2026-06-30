import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Pencil, Copy, Check, Search, X, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useSound } from "@/lib/sound";

export const Route = createFileRoute("/dashboard/prompts")({
  head: () => ({
    meta: [
      { title: "Prompts · Portfolio Pro" },
      { name: "description", content: "Curate a library of prompts to showcase on your portfolio." },
    ],
  }),
  component: PromptsPage,
});

type Prompt = {
  id: string;
  title: string;
  description: string | null;
  body: string;
  category: string | null;
  tags: string[];
  sort_order: number;
};

const CATEGORIES = ["AI", "Design", "Coding", "Writing", "Marketing", "Other"];

function PromptsPage() {
  const { user } = useAuth();
  const { play } = useSound();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Partial<Prompt> | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPrompts((data ?? []) as Prompt[]);
        setLoading(false);
      });
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prompts;
    return prompts.filter((p) =>
      [p.title, p.description, p.body, p.category, ...(p.tags || [])]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(q)),
    );
  }, [prompts, query]);

  const save = async () => {
    if (!user || !editing) return;
    const payload = {
      user_id: user.id,
      title: (editing.title || "").trim(),
      description: editing.description?.trim() || null,
      body: (editing.body || "").trim(),
      category: editing.category || null,
      tags: (editing.tags || []).filter(Boolean),
      sort_order: editing.sort_order ?? prompts.length,
    };
    if (!payload.title || !payload.body) {
      play("notify");
      return;
    }
    if (editing.id) {
      const { data, error } = await supabase.from("prompts").update(payload).eq("id", editing.id).select().single();
      if (!error && data) {
        setPrompts((ps) => ps.map((p) => (p.id === data.id ? (data as Prompt) : p)));
        play("success");
      } else play("notify");
    } else {
      const { data, error } = await supabase.from("prompts").insert(payload).select().single();
      if (!error && data) {
        setPrompts((ps) => [data as Prompt, ...ps]);
        play("success");
      } else play("notify");
    }
    setEditing(null);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (!error) {
      setPrompts((ps) => ps.filter((p) => p.id !== id));
      play("success");
    }
  };

  const copy = async (p: Prompt) => {
    try {
      await navigator.clipboard.writeText(p.body);
      setCopiedId(p.id);
      play("success");
      setTimeout(() => setCopiedId(null), 1400);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="animate-fade-up">
        <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Prompt Library</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your <span className="text-gradient">prompts.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A mini marketplace inside your portfolio. Copy, edit, share — all visible to visitors when your portfolio is published.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, tags, categories…"
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 ps-9 pe-3 text-sm placeholder:text-muted-foreground focus:border-[color:var(--violet)]/50 focus:outline-none"
          />
        </div>
        <button
          onClick={() => { play("click"); setEditing({ title: "", description: "", body: "", category: "AI", tags: [] }); }}
          data-sound
          data-sound-hover
          className="inline-flex items-center gap-1.5 rounded-xl brand-gradient px-4 py-2 text-sm font-medium text-white shadow-[0_8px_30px_-10px_oklch(0.55_0.25_295/0.7)] transition-transform hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" /> New prompt
        </button>
      </div>

      {loading ? (
        <div className="mt-12 grid place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--violet)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 grid place-items-center rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <Sparkles className="h-6 w-6 text-[color:var(--violet)]" />
          <p className="mt-3 text-sm font-medium">{prompts.length === 0 ? "No prompts yet" : "No matches"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {prompts.length === 0 ? "Add your first prompt to start your library." : "Try a different keyword."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <article key={p.id} className="group glass-panel rounded-2xl p-5 transition-all hover:-translate-y-1">
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold">{p.title}</h3>
                  {p.category && (
                    <span className="mt-1 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => copy(p)} aria-label="Copy" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground">
                    {copiedId === p.id ? <Check className="h-3.5 w-3.5 text-[color:var(--violet)]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => { play("click"); setEditing(p); }} aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(p.id)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </header>
              {p.description && <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>}
              <pre className="mt-3 max-h-40 overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
{p.body}
              </pre>
              {p.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">#{t}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl glass-panel p-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? "Edit prompt" : "New prompt"}</h2>
              <button onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Title">
                <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} placeholder="Killer product brief generator" />
              </Field>
              <Field label="Short description">
                <input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inp} placeholder="What does it do?" />
              </Field>
              <Field label="Category">
                <select value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inp}>
                  <option value="">—</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Tags (comma-separated)">
                <input
                  value={(editing.tags || []).join(", ")}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                  className={inp}
                  placeholder="gpt, marketing, copy"
                />
              </Field>
              <Field label="Prompt body">
                <textarea
                  rows={8}
                  value={editing.body || ""}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  className={`${inp} font-mono leading-relaxed min-h-[160px]`}
                  placeholder="You are a..."
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground hover:bg-white/10">Cancel</button>
              <button onClick={save} className="inline-flex items-center gap-1.5 rounded-xl brand-gradient px-4 py-2 text-sm font-medium text-white hover:scale-[1.03] transition-transform">
                {editing.id ? "Save changes" : "Create prompt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-[color:var(--violet)]/50 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
