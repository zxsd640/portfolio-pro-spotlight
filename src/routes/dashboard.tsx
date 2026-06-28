import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, BarChart3, Settings, LogOut, Volume2, VolumeX, Wand2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Portfolio Pro" },
      { name: "description", content: "Manage your portfolio, projects and analytics." },
    ],
  }),
  component: DashboardLayout,
});

const ITEMS = [
  { to: "/dashboard", labelKey: "dashboard.overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/builder", labelKey: "dashboard.builder", icon: Wand2, exact: false },
  { to: "/dashboard/projects", labelKey: "dashboard.projects", icon: FolderKanban, exact: false },
  { to: "/dashboard/analytics", labelKey: "dashboard.analytics", icon: BarChart3, exact: false },
  { to: "/dashboard/settings", labelKey: "dashboard.settings", icon: Settings, exact: false },
] as const;

function DashboardLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { enabled, toggle } = useSound();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("username").eq("id", user.id).maybeSingle().then(({ data }) => {
      setUsername(data?.username ?? null);
    });
  }, [user]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--violet)]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow opacity-50" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/5 bg-background/60 backdrop-blur-xl md:flex">
        <Link to="/" data-sound className="flex items-center gap-2.5 px-5 py-5">
          <div className="relative h-7 w-7 overflow-hidden rounded-lg brand-gradient">
            <div className="absolute inset-0 grid place-items-center text-[11px] font-black text-white">P</div>
          </div>
          <span className="text-sm font-semibold">Portfolio Pro</span>
        </Link>

        <nav className="flex-1 space-y-1 px-3">
          {ITEMS.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                data-sound="nav"
                data-sound-hover
                className={[
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                  active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                ].join(" ")}
              >
                <span className={["grid h-7 w-7 place-items-center rounded-lg transition-all", active ? "brand-gradient text-white shadow-[0_8px_20px_-8px_oklch(0.55_0.25_295/0.8)]" : "bg-white/5"].join(" ")}>
                  <it.icon className="h-4 w-4" />
                </span>
                {t(it.labelKey)}
                {active && <span className="ms-auto h-1.5 w-1.5 rounded-full brand-gradient" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="mb-2 flex items-center justify-between rounded-xl px-1">
            <LanguageSwitcher />
          </div>
          <button onClick={toggle} data-sound className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground cursor-pointer">
            {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {enabled ? t("nav.soundOn") : t("nav.soundOff")}
          </button>
          <button onClick={() => { signOut(); navigate({ to: "/" }); }} data-sound className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground cursor-pointer">
            <LogOut className="h-4 w-4" /> {t("dashboard.signOut")}
          </button>
          <p className="mt-3 px-3 text-[10px] text-muted-foreground/70">
            {t("footer.designedBy")} <span className="text-gradient font-medium">Zyad Abdou</span>
          </p>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-background/70 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/" data-sound className="text-sm font-semibold">Portfolio Pro</Link>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            {username && (
              <a
                href={`/${username}`}
                target="_blank"
                rel="noreferrer"
                data-sound
                data-sound-hover
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              >
                {t("dashboard.viewPortfolio")} <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Link
              to="/dashboard/builder"
              data-sound
              data-sound-hover
              className="inline-flex items-center gap-1.5 rounded-xl brand-gradient px-3.5 py-2 text-xs font-medium text-white hover:scale-[1.03] transition-transform"
            >
              <Wand2 className="h-3.5 w-3.5" /> {t("dashboard.openBuilder")}
            </Link>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-white/5 bg-background/50 px-4 py-2 md:hidden">
          {ITEMS.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to} data-sound="nav" className={["whitespace-nowrap rounded-lg px-3 py-1.5 text-xs", active ? "bg-white/10" : "text-muted-foreground"].join(" ")}>
                {t(it.labelKey)}
              </Link>
            );
          })}
        </nav>

        <main className="px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
