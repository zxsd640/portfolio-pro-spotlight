import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Mail, Lock, User, Github, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { useSound } from "@/lib/sound";

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
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    play("success");
    setTimeout(() => navigate({ to: "/dashboard" }), 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <SiteNav />
      <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 pt-32 pb-16">
        <div className="glass-panel rounded-3xl p-8 animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-[color:var(--violet)]" />
            {isRegister ? "Create your free account" : "Welcome back"}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {isRegister ? "Start building." : "Sign in."}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRegister ? "Free forever — no credit card." : "Continue to your dashboard."}
          </p>

          <div className="mt-6 flex gap-2">
            <button data-sound className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm hover:bg-white/10 cursor-pointer">
              <Github className="h-4 w-4" /> GitHub
            </button>
            <button data-sound className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm hover:bg-white/10 cursor-pointer">
              Google
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {isRegister && (
              <Field icon={User} placeholder="Full name" required />
            )}
            <Field icon={Mail} type="email" placeholder="Email" required />
            <Field icon={Lock} type="password" placeholder="Password" required />
            <button
              type="submit"
              disabled={loading}
              data-sound
              data-sound-hover
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient px-4 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01] cursor-pointer disabled:opacity-70"
            >
              {loading ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "New to Portfolio Pro?"}{" "}
            <Link to="/auth" search={{ mode: isRegister ? "login" : "register" }} data-sound className="text-foreground hover:underline">
              {isRegister ? "Sign in" : "Create one"}
            </Link>
          </p>
        </div>
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
