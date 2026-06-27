import { createContext, useContext, useState, type ReactNode } from "react";
import { X, Send, Check } from "lucide-react";
import { useSound } from "./sound";

type Ctx = { open: (name?: string) => void; close: () => void };
const ContactCtx = createContext<Ctx | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [target, setTarget] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const { play } = useSound();

  const open = (name?: string) => {
    setTarget(name);
    setSent(false);
    setOpen(true);
    play("notify");
  };
  const close = () => setOpen(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    play("success");
    setTimeout(() => setOpen(false), 1600);
  };

  return (
    <ContactCtx.Provider value={{ open, close }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-up">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="relative w-full max-w-md rounded-2xl glass-panel p-6">
            <button
              onClick={close}
              data-sound
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-xl font-semibold tracking-tight">
              {target ? `Hire ${target}` : "Get in touch"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Send a message and we'll get back to you within 24 hours.
            </p>
            {sent ? (
              <div className="mt-8 flex flex-col items-center py-6 text-center animate-fade-up">
                <div className="grid h-14 w-14 place-items-center rounded-full brand-gradient">
                  <Check className="h-7 w-7 text-white" />
                </div>
                <p className="mt-4 font-medium">Message sent</p>
                <p className="text-sm text-muted-foreground">Thanks — we'll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-3">
                <input required placeholder="Your name" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
                <input required type="email" placeholder="Email" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
                <textarea required placeholder="Tell us about your project" rows={4} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors resize-none" />
                <button
                  type="submit"
                  data-sound
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.01] cursor-pointer"
                >
                  Send message <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </ContactCtx.Provider>
  );
}

export function useContactModal() {
  const c = useContext(ContactCtx);
  if (!c) return { open: () => {}, close: () => {} } as Ctx;
  return c;
}
