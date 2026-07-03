import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ArrowRight, Mail, Lock, User as UserIcon, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteNav } from "@/components/SiteNav";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const search = z.object({ mode: z.enum(["login", "register"]).catch("login") });

export const Route = createFileRoute("/auth")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Sign in · Portfolio Pro" },
      { name: "description", content: "Sign in or create your free Portfolio Pro account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const { play } = useSound();
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifySent, setVerifySent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/dashboard" });
  }, [authLoading, user, navigate]);

  const mapAuthError = (msg: string): string => {
    const m = (msg || "").toLowerCase();
    if (m.includes("already registered") || m.includes("already been registered") || m.includes("user already"))
      return "This email is already registered. Please sign in instead.";
    if (m.includes("invalid login") || m.includes("invalid credentials"))
      return "Invalid email or password. Please try again.";
    if (m.includes("email not confirmed"))
      return "Please verify your email first — check your inbox.";
    if (m.includes("password") && m.includes("6"))
      return "Password must be at least 6 characters.";
    return msg || "Something went wrong";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        // Supabase returns an obfuscated identities:[] when email already exists
        // (when "Confirm email" is on) — treat that as duplicate.
        if (data.user && Array.isArray((data.user as any).identities) && (data.user as any).identities.length === 0) {
          throw new Error("User already registered");
        }
        if (data.session) {
          play("success");
          navigate({ to: "/dashboard" });
        } else {
          play("notify");
          setVerifySent(true);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        play("success");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      setError(mapAuthError(err?.message));
      play("notify");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    try {
      // redirect_uri MUST be a public URL — the /dashboard route is behind
      // the _authenticated gate, so redirecting straight there can bounce
      // the user back to /auth before the session is hydrated.
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error.message || "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      // Popup flow: session is set — the useEffect above will redirect to /dashboard.
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    }
  };

  if (verifySent) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
        <SiteNav />
        <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pt-32 pb-16">
          <div className="glass-panel rounded-3xl p-8 text-center animate-fade-up">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl brand-gradient">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">{t("auth.checkInbox")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("auth.verifySent", { email })}
            </p>
            <Link to="/auth" search={{ mode: "login" }} className="mt-6 inline-flex items-center gap-1 text-sm text-[color:var(--violet)] hover:underline">
              {t("auth.backToSignIn")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <SiteNav />
      <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pt-32 pb-16">
        <div className="glass-panel rounded-3xl p-8 animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-[color:var(--violet)]" />
            {isRegister ? t("auth.createAccount") : t("auth.welcomeBack")}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {isRegister ? t("auth.startBuilding") : t("auth.signIn")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRegister ? t("auth.freeForever") : t("auth.continueDash")}
          </p>

          <button
            onClick={onGoogle}
            data-sound
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm hover:bg-white/10 cursor-pointer"
          >
            <GoogleIcon /> {t("auth.continueGoogle")}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-white/10" /> {t("auth.or")} <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {isRegister && (
              <Field icon={UserIcon} placeholder={t("auth.fullName")} value={name} onChange={(e) => setName(e.target.value)} required />
            )}
            <Field icon={Mail} type="email" placeholder={t("auth.email")} value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Field icon={Lock} type="password" placeholder={t("auth.password")} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              data-sound
              data-sound-hover
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01] cursor-pointer disabled:opacity-70"
            >
              {loading ? t("auth.pleaseWait") : isRegister ? t("auth.submitCreate") : t("auth.submitSignIn")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? t("auth.haveAccount") : t("auth.newHere")}{" "}
            <Link to="/auth" search={{ mode: isRegister ? "login" : "register" }} data-sound className="text-foreground hover:underline">
              {isRegister ? t("auth.submitSignIn") : t("auth.createOne")}
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-[11px] text-muted-foreground/70">
          {t("footer.designedBy")} <span className="text-gradient font-medium">Zyad Abdou</span>
        </p>
      </main>
    </div>
  );
}

function Field({ icon: Icon, ...props }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        {...props}
        className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.9 6.5 29.2 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43.5c5.1 0 9.8-2 13.3-5.2l-6.1-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.1 5.2c-.4.4 6.6-4.8 6.6-14.7 0-1.2-.1-2.3-.3-3.5z"/>
    </svg>
  );
}
