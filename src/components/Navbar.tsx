"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/locale-context";
import { translations, type Locale } from "@/lib/i18n";

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", nl: "NL", es: "ES" };

const navItems = (t: typeof translations.en.nav) => [
  { href: "/", label: t.home },
  { href: "/voice", label: t.voiceAi },
  { href: "/chat", label: t.textAi },
  { href: "/dashboard", label: t.dashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const t = translations[locale].nav;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/x20ai-logo.png" alt="x20ai" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold text-foreground">
              x20<span className="text-primary">ai</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems(t).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
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
                  {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>

            <a
              href="https://x20ai.com/Home"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-all duration-200"
            >
              {t.getStarted}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
