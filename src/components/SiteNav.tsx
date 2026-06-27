import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Volume2, VolumeX, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSound } from "@/lib/sound";

function LogoMark() {
  return (
    <div className="relative h-7 w-7 overflow-hidden rounded-lg brand-gradient">
      <div className="absolute inset-0 grid place-items-center text-[11px] font-black text-white">P</div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
    </div>
  );
}

const links = [
  { label: "Templates", to: "/templates" },
  { label: "Demo", to: "/demo" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { enabled, toggle } = useSound();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={[
          "flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
          scrolled || open ? "glass-panel" : "bg-transparent",
        ].join(" ")}
      >
        <Link to="/" className="flex items-center gap-2.5" data-sound="nav">
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight">Portfolio Pro</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-sound="nav"
              data-sound-hover
              className={[
                "relative transition-colors hover:text-foreground",
                pathname === l.to ? "text-foreground" : "",
              ].join(" ")}
            >
              {l.label}
              {pathname === l.to && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full brand-gradient" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            data-sound
            title={enabled ? "Sound on" : "Sound off"}
            aria-label="Toggle sound"
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground cursor-pointer"
          >
            {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <Link
            to="/auth"
            search={{ mode: "login" }}
            data-sound
            className="hidden rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            search={{ mode: "register" }}
            data-sound
            data-sound-hover
            className="inline-flex items-center gap-1.5 rounded-xl brand-gradient px-3.5 py-2 text-sm font-medium text-white shadow-[0_8px_30px_-10px_oklch(0.55_0.25_295/0.7)] transition-all hover:scale-[1.03]"
          >
            Start free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            data-sound
            className="grid h-9 w-9 place-items-center rounded-xl md:hidden cursor-pointer"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-x-4 top-[68px] z-50 rounded-2xl glass-panel p-4 md:hidden animate-fade-up">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-sound="nav"
                className="rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
