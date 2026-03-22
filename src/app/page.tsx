"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { translations } from "@/lib/i18n";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 2000;
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => requestAnimationFrame(tick), 300);
    return () => clearTimeout(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

export default function Home() {
  const { locale } = useLocale();
  const t = translations[locale].home;

  const demos = [
    {
      href: "/voice",
      title: t.demoCards.voiceTitle,
      description: t.demoCards.voiceDescription,
      tag: t.demoCards.voiceTag,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      gradient: "from-[hsl(var(--primary))] to-[hsl(var(--accent))]",
    },
    {
      href: "/chat",
      title: t.demoCards.textTitle,
      description: t.demoCards.textDescription,
      tag: t.demoCards.textTag,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      href: "/dashboard",
      title: t.demoCards.dashboardTitle,
      description: t.demoCards.dashboardDescription,
      tag: t.demoCards.dashboardTag,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.05)] to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[hsl(var(--accent)/0.05)] rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-sm text-muted-foreground mb-6">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {t.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground">
                {t.heroTitle}{" "}
                <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] bg-clip-text text-transparent">
                  {t.heroTitleAccent}
                </span>{" "}
                {t.heroTitleEnd}
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8">
                {t.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/voice"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  {t.tryVoiceDemo}
                </Link>
                <Link
                  href="/chat"
                  className="px-6 py-3 rounded-xl border border-border hover:border-primary text-foreground font-medium transition-all duration-200"
                >
                  {t.tryTextDemo}
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: <AnimatedCounter target={40} suffix="+" />, label: t.stats.hoursSaved },
                  { value: <AnimatedCounter target={85} suffix="%" />, label: t.stats.autoResolved },
                  { value: "<2s", label: t.stats.responseTime },
                  { value: "99.9%", label: t.stats.uptimeSla },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary)/0.2)] to-[hsl(var(--accent)/0.2)] rounded-3xl blur-2xl" />
                <Image
                  src="/x20ai-hero.png"
                  alt="x20ai AI Agents"
                  width={600}
                  height={600}
                  className="relative rounded-3xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3 text-foreground">{t.chooseDemo}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            {t.chooseDemoSubtitle}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {demos.map((demo, i) => (
              <Link
                key={i}
                href={demo.href}
                className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[hsl(var(--primary)/0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center text-white mb-5`}>
                    {demo.icon}
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium mb-3">
                    {demo.tag}
                  </span>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{demo.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{demo.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    {t.launchDemo}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-8">{t.integrationsLabel}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["GoHighLevel", "HubSpot", "Salesforce", "Twilio", "WhatsApp", "n8n", "Make", "Zapier", "Stripe", "Google Calendar", "Calendly", "Airtable"].map((name) => (
              <span key={name} className="px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Image src="/x20ai-brand.png" alt="x20ai" width={200} height={80} className="mx-auto mb-8" />
          <p className="text-muted-foreground max-w-lg mx-auto">
            {translations[locale].footer.description}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/x20ai-logo.png" alt="x20ai" width={24} height={24} className="rounded" />
            <span className="text-sm text-muted-foreground">{translations[locale].footer.copyright}</span>
          </div>
          <a href="https://x20ai.com/Home" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
            {translations[locale].footer.visitSite}
          </a>
        </div>
      </footer>
    </div>
  );
}
