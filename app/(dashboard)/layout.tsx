"use client";

import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col overflow-hidden lg:flex-row">
      <header className="flex flex-none items-center gap-3 border-b border-divider px-3 py-2.5 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-gray transition-colors duration-150 hover:bg-brand-primary-tint hover:text-brand-primary-dark active:bg-brand-primary-tint"
        >
          <Menu className="h-5.5 w-5.5" strokeWidth={2} />
        </button>
        <span className="text-lg font-bold text-brand-black">TEC Laguna</span>
      </header>

      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-5 sm:px-9 sm:pb-7.5 lg:ml-[216px]">
        {children}
      </main>
    </div>
  );
}
