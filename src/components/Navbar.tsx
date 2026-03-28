"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/locale-context";
import { translations, type Locale } from "@/lib/i18n";

const LOCALE_LABELS: Record<Locale, { short: string; flag: string }> = {
  en: { short: "EN", flag: "🇬🇧" },
  nl: { short: "NL", flag: "🇳🇱" },
  es: { short: "ES", flag: "🇪🇸" },
};

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const t = translations[locale].nav;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/voice", label: t.voiceAi },
    { href: "/chat", label: t.textAi },
    { href: "/dashboard", label: t.dashboard },
  ];

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <Link href="/voice" className="flex items-center gap-2">
            <Image src="/x20ai-logo.png" alt="x20ai" width={28} height={28} className="rounded-lg w-6 h-6 sm:w-7 sm:h-7" />
            <span className="text-sm sm:text-base font-bold text-foreground">
              x20<span className="text-primary">ai</span>
              <span className="text-xs font-normal text-muted-foreground ml-1.5 hidden sm:inline">demos</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop language picker */}
          <div className="hidden sm:flex items-center rounded-lg border border-border overflow-hidden">
            {(["en", "nl", "es"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  locale === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {LOCALE_LABELS[l].short}
              </button>
            ))}
          </div>

          {/* Mobile: language flags + hamburger */}
          <div className="flex sm:hidden items-center gap-2" ref={menuRef}>
            {/* Quick language switcher with flags */}
            <div className="flex items-center gap-0.5 rounded-lg border border-border overflow-hidden">
              {(["en", "nl", "es"] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-1.5 py-1 text-sm leading-none transition-all ${
                    locale === l
                      ? "bg-primary/10 scale-110"
                      : "opacity-50"
                  }`}
                  aria-label={LOCALE_LABELS[l].short}
                >
                  {LOCALE_LABELS[l].flag}
                </button>
              ))}
            </div>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            {/* Mobile dropdown menu */}
            {menuOpen && (
              <div className="absolute top-12 right-3 w-48 rounded-xl border border-border bg-card shadow-lg overflow-hidden animate-fade-in-up">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 text-sm font-medium border-b border-border/50 last:border-0 transition-colors ${
                      pathname === item.href
                        ? "bg-primary/5 text-primary"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
