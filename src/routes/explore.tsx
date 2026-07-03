import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

type PublicProfile = {
  id: string;
  username: string;
  display_name: string | null;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  accent: string | null;
  created_at: string;
};

type SortKey = "newest" | "az";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Portfolios · Portfolio Pro" },
      {
        name: "description",
        content:
          "Discover portfolios from designers, developers, photographers, and creators around the world. Browse the Portfolio Pro community.",
      },
      { property: "og:title", content: "Explore Portfolios · Portfolio Pro" },
      {
        property: "og:description",
        content: "Discover portfolios from designers, developers, and creators — all built with Portfolio Pro.",
      },
    ],
  }),
  component: ExplorePage,
});

const PAGE_SIZE = 24;

function ExplorePage() {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, title, bio, avatar_url, location, accent, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(500);
      if (cancelled) return;
      if (error) setError(error.message);
      else setProfiles((data ?? []) as PublicProfile[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = profiles;
    if (q) {
      list = list.filter((p) =>
        [p.username, p.display_name, p.title, p.bio, p.location]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q)),
      );
    }
    if (sort === "az") {
      list = [...list].sort((a, b) =>
        (a.display_name || a.username).localeCompare(b.display_name || b.username),
      );
    }
    return list;
  }, [profiles, query, sort]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > visible.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <SiteNav />

      <main className="relative mx-auto max-w-6xl px-4 pt-32 pb-16">
        <div className="text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-[color:var(--violet)]" />
            {t("explore.eyebrow", "Explore")}
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
            {t("explore.title", "Discover portfolios from the community")}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            {t(
              "explore.sub",
              "Real portfolios from real creators. Get inspired, or share yours with the world.",
            )}
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t("explore.searchPh", "Search by name, title, or bio…")}
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[color:var(--royal)]"
          >
            <option value="newest">{t("explore.sortNewest", "Newest")}</option>
            <option value="az">{t("explore.sortAZ", "A–Z")}</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl glass-panel p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                    <div className="h-3 w-1/3 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full bg-white/10 rounded" />
                  <div className="h-3 w-2/3 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-sm text-red-300">{error}</div>
        ) : visible.length === 0 ? (
          <EmptyState hasQuery={!!query} />
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((p, i) => (
                <ProfileCard key={p.id} p={p} delay={i * 30} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setPage((v) => v + 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm hover:bg-white/10 cursor-pointer"
                >
                  <Loader2 className="h-4 w-4" /> {t("explore.loadMore", "Load more")}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function ProfileCard({ p, delay }: { p: PublicProfile; delay: number }) {
  const { t } = useTranslation();
  const initials = (p.display_name || p.username || "?")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      to="/$username"
      params={{ username: p.username }}
      className="group relative block rounded-2xl glass-panel p-5 transition-transform hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-30px_rgba(139,92,246,0.6)] animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        {p.avatar_url ? (
          <img
            src={p.avatar_url}
            alt=""
            loading="lazy"
            className="h-12 w-12 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div
            className="grid h-12 w-12 place-items-center rounded-full text-sm font-semibold text-white"
            style={{
              background: `linear-gradient(135deg, ${p.accent || "#8b5cf6"}, oklch(0.55 0.25 295))`,
            }}
          >
            {initials || "•"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{p.display_name || p.username}</div>
          <div className="truncate text-xs text-muted-foreground">
            @{p.username}
            {p.location ? ` · ${p.location}` : ""}
          </div>
        </div>
      </div>

      {p.title && (
        <div className="mt-3 inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">
          {p.title}
        </div>
      )}

      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
        {p.bio || t("explore.noBio", "This creator hasn't added a bio yet.")}
      </p>

      <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-foreground/90 opacity-80 group-hover:opacity-100">
        {t("explore.view", "View portfolio")}
        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="mt-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl brand-gradient">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {hasQuery
          ? t("explore.emptyQuery", "No portfolios match your search")
          : t("explore.emptyTitle", "Be one of the first")}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {hasQuery
          ? t("explore.emptyQuerySub", "Try a different name, title, or keyword.")
          : t(
              "explore.emptySub",
              "The community is just getting started. Publish your portfolio and it will appear here.",
            )}
      </p>
      {!hasQuery && (
        <Link
          to="/auth"
          search={{ mode: "register" }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-sm font-medium text-white"
        >
          {t("explore.publish", "Publish your portfolio")}
          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      )}
    </div>
  );
}
