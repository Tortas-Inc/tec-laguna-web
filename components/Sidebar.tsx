"use client";

import { LogoutConfirmModal } from "@/features/auth/LogoutConfirmModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Award, BookOpen, Home, Layers, LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/horario", label: "Tu horario", icon: Home },
  { href: "/horarios", label: "Horarios", icon: Layers },
  { href: "/calificaciones", label: "Calificaciones", icon: Award },
  { href: "/kardex", label: "Kardex", icon: BookOpen },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-none flex-col overflow-y-auto bg-brand-gray-lighter px-3.5 py-5.5 transition-transform duration-300 ease-out lg:w-[216px] lg:translate-x-0 lg:border-r lg:border-divider ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-7 px-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-brand-black">
              TEC Laguna
            </span>
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Cerrar menú"
              className="text-brand-gray lg:hidden"
            >
              <X className="h-5 w-5" strokeWidth={1.7} />
            </button>
          </div>
          {/* TODO: reemplazar por el número de control real cuando exista sesión (issue #25, sección 3) */}
          <div className="mt-1 text-xs font-semibold text-brand-primary-dark">
            20211234
          </div>
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseMobile}
                className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[15px] font-semibold transition-colors duration-150 ${
                  active
                    ? "bg-brand-primary text-white"
                    : "text-brand-gray hover:bg-brand-primary-tint hover:text-brand-primary-dark"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-divider px-2.5 pt-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13.5px] font-semibold text-brand-gray">
              Modo oscuro
            </span>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-2 text-[13.5px] text-brand-gray transition-colors duration-150 hover:text-brand-primary-dark"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.7} />
            Cerrar sesión
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-brand-gray-light">
            No afiliado con el ITL/TecNM ·{" "}
            <Link href="/privacidad" className="underline">
              Aviso de privacidad
            </Link>
          </p>
        </div>
      </aside>

      <LogoutConfirmModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          router.push("/login");
        }}
      />
    </>
  );
}
