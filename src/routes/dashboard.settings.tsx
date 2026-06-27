import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/lib/sound";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { enabled, toggle, play } = useSound();
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: "Sara Lin", username: "saralin", bio: "Product designer crafting elegant systems." });
  const [theme, setTheme] = useState<"royal" | "violet" | "cyan">("royal");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    play("success");
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-widest text-[color:var(--violet)]">Settings</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Preferences</h1>

      <form onSubmit={save} className="mt-8 glass-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Name"><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" /></Field>
          <Field label="Username"><input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="input" /></Field>
        </div>
        <Field label="Bio" className="mt-3">
          <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="input resize-none" />
        </Field>

        <h2 className="mt-8 text-base font-semibold">Theme accent</h2>
        <div className="mt-3 flex gap-2">
          {(["royal", "violet", "cyan"] as const).map((t) => (
            <button key={t} type="button" onClick={() => { setTheme(t); play("click"); }} data-sound className={["flex items-center gap-2 rounded-xl border px-3 py-2 text-xs capitalize cursor-pointer transition-all", theme === t ? "border-[color:var(--royal)] bg-white/10" : "border-white/10 hover:bg-white/5"].join(" ")}>
              <span className="h-3 w-3 rounded-full" style={{ background: `var(--${t})` }} />
              {t}
            </button>
          ))}
        </div>

        <h2 className="mt-8 text-base font-semibold">Sound</h2>
        <button type="button" onClick={toggle} data-sound className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 cursor-pointer">
          {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          Sound effects: <span className="font-semibold">{enabled ? "On" : "Off"}</span>
        </button>

        <div className="mt-8 flex items-center gap-3">
          <button type="submit" data-sound data-sound-hover className="inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-2.5 text-sm font-medium text-white hover:scale-[1.03] transition-transform cursor-pointer">
            Save changes
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--cyan)] animate-fade-up">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
        </div>
      </form>

      <div className="mt-8 glass-panel rounded-2xl p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Designed &amp; developed by</p>
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
