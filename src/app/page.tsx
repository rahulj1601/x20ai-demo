"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return <span>{count}{suffix}</span>;
}

const demos = [
  {
    href: "/voice",
    title: "Voice AI Agent",
    description: "Experience a live simulated phone call with our AI voice agent. Watch real-time transcripts as the agent handles inquiries, qualifies leads, and books appointments.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    gradient: "from-indigo-500 to-purple-600",
    tag: "Live Simulation",
  },
  {
    href: "/chat",
    title: "Text AI Agent",
    description: "Chat with our WhatsApp-style AI agent in real time. Ask about services, pricing, integrations - trained on all of x20ai's knowledge base.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-600",
    tag: "Interactive Chat",
  },
  {
    href: "/dashboard",
    title: "Analytics Dashboard",
    description: "See real-time performance metrics, conversation analytics, and ROI tracking. Animated data visualizations show what managing AI agents looks like.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-600",
    tag: "Live Metrics",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            Interactive AI Agent Demos
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Experience{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
              x20ai
            </span>{" "}
            agents in action
          </h1>

          <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto mb-12">
            See how production-ready AI agents handle voice calls, text conversations, and deliver real-time analytics. Live in 3-7 business days.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/voice"
              className="px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Try Voice Demo
            </Link>
            <Link
              href="/chat"
              className="px-6 py-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] text-white font-medium transition-all duration-200"
            >
              Try Text Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: <AnimatedCounter target={40} suffix="+" />, label: "Hours saved/month" },
              { value: <AnimatedCounter target={85} suffix="%" />, label: "Auto-resolved" },
              { value: "<2s", label: "Response time" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[var(--muted)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Choose a Demo</h2>
          <p className="text-[var(--muted)] text-center mb-12 max-w-xl mx-auto">
            Each demo is a fully simulated experience showing how x20ai agents work in production.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {demos.map((demo, i) => (
              <Link
                key={i}
                href={demo.href}
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 hover:border-[var(--accent)]/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${demo.gradient} flex items-center justify-center text-white mb-5`}>
                    {demo.icon}
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent-light)] text-xs font-medium mb-3">
                    {demo.tag}
                  </span>
                  <h3 className="text-xl font-semibold mb-3">{demo.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{demo.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-[var(--accent-light)] text-sm font-medium group-hover:gap-3 transition-all">
                    Launch Demo
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

      {/* Integrations strip */}
      <section className="py-16 px-4 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[var(--muted)] mb-8">Plugs into what you already use</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["GoHighLevel", "HubSpot", "Salesforce", "Twilio", "WhatsApp", "n8n", "Make", "Zapier", "Stripe", "Google Calendar"].map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white font-bold text-[10px]">
              x20
            </div>
            <span className="text-sm text-[var(--muted)]">&copy; 2026 x20ai. Demo experience.</span>
          </div>
          <a
            href="https://x20ai.com/Home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--accent-light)] hover:underline"
          >
            Visit x20ai.com &rarr;
          </a>
        </div>
      </footer>
    </div>
  );
}
