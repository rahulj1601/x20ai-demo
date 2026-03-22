"use client";

import { LocaleProvider } from "@/lib/locale-context";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
    </LocaleProvider>
  );
}
