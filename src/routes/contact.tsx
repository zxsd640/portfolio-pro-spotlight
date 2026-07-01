import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Check, Mail, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useSound } from "@/lib/sound";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Portfolio Pro" },
      { name: "description", content: "Get in touch with the Portfolio Pro team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const { play } = useSound();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    play("success");
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hero-glow" />
      <SiteNav />
      <main className="px-4 pt-36 pb-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--violet)]">{t("contact.eyebrow")}</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {t("contact.titleA")} <span className="text-gradient">{t("contact.titleB")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("contact.sub")}</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <InfoCard icon={Mail} title={t("contact.email")} value="hello@portfoliopro.app" />
            <InfoCard icon={MessageSquare} title={t("contact.response")} value={t("contact.responseTime")} />
          </div>
          <div className="md:col-span-2 glass-panel rounded-2xl p-6">
            {sent ? (
              <div className="flex flex-col items-center py-10 animate-fade-up text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full brand-gradient">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <p className="mt-4 text-lg font-semibold">{t("contact.sent")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("contact.sentSub")}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <input required placeholder={t("contact.name")} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
                <input required type="email" placeholder={t("contact.emailPh")} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
                <input placeholder={t("contact.subject")} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors" />
                <textarea required placeholder={t("contact.message")} rows={6} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[color:var(--royal)] transition-colors resize-none" />
                <button type="submit" data-sound data-sound-hover className="inline-flex w-full items-center justify-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-medium text-white hover:scale-[1.01] transition-transform cursor-pointer">
                  {t("contact.send")} <Send className="h-4 w-4 rtl:-scale-x-100" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({ icon: Icon, title, value }: { icon: any; title: string; value: string }) {
  return (
    <div data-sound-hover className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
