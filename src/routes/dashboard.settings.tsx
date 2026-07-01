import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Volume2, VolumeX, Sun, Moon, Globe2, Lock, LogOut, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useTranslation();
  const { enabled, toggle, play } = useSound();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ display_name: "", username: "", bio: "", title: "", location: "", theme: "dark" as "dark" | "light", published: false });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm({
        display_name: data.display_name ?? "",
        username: data.username,
        bio: data.bio ?? "",
        title: data.title ?? "",
        location: data.location ?? "",
        theme: (data.theme as any) ?? "dark",
        published: !!data.published,
      });
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", form.theme === "dark");
  }, [form.theme]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from("profiles").update({
        display_name: form.display_name,
        username: form.username,
        bio: form.bio,
        title: form.title,
        location: form.location,
        theme: form.theme,
        published: form.published,
      }).eq("id", user.id);
      if (error) throw error;
      play("success");
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (err: any) {
      setError(err?.message || t("settings.saveFailed"));
      play("notify");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="grid h-64 place-items-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--violet)]" /></div>;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">{t("settings.eyebrow")}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{t("settings.title")}</h1>

      <form onSubmit={save} className="mt-8 glass-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold">{t("settings.profile")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label={t("settings.name")}><input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="input" /></Field>
          <Field label={t("settings.username")}><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })} className="input" /></Field>
          <Field label={t("settings.titleField")}><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></Field>
          <Field label={t("settings.location")}><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" /></Field>
        </div>
        <Field label={t("settings.bio")} className="mt-3">
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="input resize-none" />
        </Field>

        <h2 className="mt-8 text-base font-semibold">{t("settings.visibility")}</h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => setForm({ ...form, published: true })} className={["flex flex-1 items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-all", form.published ? "border-[color:var(--royal)] bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"].join(" ")}>
            <Globe2 className="h-4 w-4" /> {t("settings.published")}
          </button>
          <button type="button" onClick={() => setForm({ ...form, published: false })} className={["flex flex-1 items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-all", !form.published ? "border-[color:var(--royal)] bg-white/10" : "border-white/10 bg-white/5 hover:bg-white/10"].join(" ")}>
            <Lock className="h-4 w-4" /> {t("settings.draft")}
          </button>
        </div>

        <h2 className="mt-8 text-base font-semibold">{t("settings.theme")}</h2>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => setForm({ ...form, theme: "dark" })} className={["flex items-center gap-2 rounded-xl border px-3 py-2 text-xs cursor-pointer transition-all", form.theme === "dark" ? "border-[color:var(--royal)] bg-white/10" : "border-white/10 hover:bg-white/5"].join(" ")}>
            <Moon className="h-3 w-3" /> {t("settings.dark")}
          </button>
          <button type="button" onClick={() => setForm({ ...form, theme: "light" })} className={["flex items-center gap-2 rounded-xl border px-3 py-2 text-xs cursor-pointer transition-all", form.theme === "light" ? "border-[color:var(--royal)] bg-white/10" : "border-white/10 hover:bg-white/5"].join(" ")}>
            <Sun className="h-3 w-3" /> {t("settings.light")}
          </button>
        </div>

        <h2 className="mt-8 text-base font-semibold">{t("settings.sound")}</h2>
        <button type="button" onClick={toggle} data-sound className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 cursor-pointer">
          {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {t("settings.soundFx")} <span className="font-semibold">{enabled ? t("common.on") : t("common.off")}</span>
        </button>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-300">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="mt-8 flex items-center gap-3">
          <button type="submit" disabled={saving} data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-2.5 text-sm font-medium text-white hover:scale-[1.03] transition-transform cursor-pointer disabled:opacity-60">
            {saving ? t("settings.saving") : t("settings.saveChanges")}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--cyan)] animate-fade-up">
              <Check className="h-3.5 w-3.5" /> {t("settings.savedShort")}
            </span>
          )}
        </div>
      </form>

      <div className="mt-6 glass-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold">{t("settings.account")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
        <button onClick={() => { signOut(); navigate({ to: "/" }); }} data-sound className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
          <LogOut className="h-4 w-4" /> {t("settings.signOut")}
        </button>
      </div>

      <div className="mt-8 glass-panel rounded-2xl p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("footer.designedBy")}</p>
        <p className="mt-1 text-xl font-semibold text-gradient">Zyad Abdou</p>
      </div>

      <style>{`.input{width:100%;border-radius:.75rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);padding:.625rem 1rem;font-size:.875rem;outline:none;transition:border-color .2s}.input:focus{border-color:oklch(0.55 0.25 295)}`}</style>
    </div>
  );
}

function Field({ label, children, className = "" }: any) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

