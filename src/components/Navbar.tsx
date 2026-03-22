"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/voice", label: "Voice AI" },
  { href: "/chat", label: "Text AI" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              x20
            </div>
            <span className="text-lg font-bold">
              x20<span className="text-[var(--accent)]">ai</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-[var(--accent)]/10 text-[var(--accent-light)]"
                    : "text-[var(--muted)] hover:text-white hover:bg-[var(--surface-light)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <a
            href="https://x20ai.com/Home"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white text-sm font-medium transition-all duration-200"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
