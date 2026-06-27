import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type SoundType = "click" | "hover" | "nav" | "success" | "notify";

type SoundCtx = {
  enabled: boolean;
  toggle: () => void;
  play: (t: SoundType) => void;
};

const Ctx = createContext<SoundCtx | null>(null);

const PRESETS: Record<SoundType, { freq: number; dur: number; type: OscillatorType; gain: number }> = {
  click: { freq: 880, dur: 0.05, type: "sine", gain: 0.05 },
  hover: { freq: 1200, dur: 0.03, type: "sine", gain: 0.025 },
  nav: { freq: 520, dur: 0.08, type: "triangle", gain: 0.05 },
  success: { freq: 660, dur: 0.18, type: "sine", gain: 0.07 },
  notify: { freq: 740, dur: 0.12, type: "triangle", gain: 0.06 },
};

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stored = localStorage.getItem("pp-sound");
    if (stored === "on") setEnabled(true);
    else if (stored === "off") setEnabled(false);
    else setEnabled(!reduced);
  }, []);

  const play = (t: SoundType) => {
    if (!enabled || typeof window === "undefined") return;
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ac = ctxRef.current;
      if (ac.state === "suspended") ac.resume();
      const p = PRESETS[t];
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = p.type;
      osc.frequency.value = p.freq;
      g.gain.value = 0;
      osc.connect(g).connect(ac.destination);
      const now = ac.currentTime;
      g.gain.linearRampToValueAtTime(p.gain, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);
      osc.start(now);
      osc.stop(now + p.dur + 0.02);
    } catch {}
  };

  const toggle = () => {
    setEnabled((v) => {
      const n = !v;
      try { localStorage.setItem("pp-sound", n ? "on" : "off"); } catch {}
      return n;
    });
  };

  // Global delegation: any element with data-sound plays click; data-sound-hover plays hover.
  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-sound]") as HTMLElement | null;
      if (!el) return;
      play((el.dataset.sound as SoundType) || "click");
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-sound-hover]") as HTMLElement | null;
      if (!el) return;
      play("hover");
    };
    document.addEventListener("click", onClick);
    document.addEventListener("mouseover", onOver);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onOver);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return <Ctx.Provider value={{ enabled, toggle, play }}>{children}</Ctx.Provider>;
}

export function useSound() {
  const c = useContext(Ctx);
  if (!c) return { enabled: false, toggle: () => {}, play: () => {} } as SoundCtx;
  return c;
}
