"use client";

import { ConfirmModal } from "@/components/ConfirmModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Award,
  BookOpen,
  Home,
  Layers,
  LogIn,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { GUEST_MODE_KEY, MANUAL_CARRERA_KEY } from "@/lib/guestMode";

const NAV_ITEMS = [
  { href: "/horario", label: "Tu horario", icon: Home },
  { href: "/horarios", label: "Simulador", icon: Layers },
  { href: "/calificaciones", label: "Calificaciones", icon: Award },
  { href: "/kardex", label: "Kardex", icon: BookOpen },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
  isLoggedIn,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [logoutOpen, setLogoutOpen] = useState(false);
  // Invitado: solo tiene sentido ver el simulador — el resto de páginas
  // necesita sesión y solo mostraría el error de "no autenticado".
  const navItems = isLoggedIn
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => item.href === "/horarios");

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
          {isLoggedIn ? (
            // TODO: reemplazar por el número de control real (issue #25, sección 3)
            <div className="mt-1 text-xs font-semibold text-brand-primary-dark">
              20211234
            </div>
          ) : (
            <div className="mt-1 text-xs font-semibold text-brand-gray-light">
              Modo invitado
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
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
          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="flex items-center gap-2 text-[13.5px] text-brand-gray transition-colors duration-150 hover:text-brand-primary-dark"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.7} />
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-[13.5px] text-brand-gray transition-colors duration-150 hover:text-brand-primary-dark"
            >
              <LogIn className="h-4 w-4" strokeWidth={1.7} />
              Iniciar sesión
            </Link>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-brand-gray-light">
            No afiliado con el ITL/TecNM ·{" "}
            <Link href="/privacidad" className="underline">
              Aviso de privacidad
            </Link>
          </p>
        </div>
      </aside>

      <ConfirmModal
        open={logoutOpen}
        title="Cerrar sesión"
        description="¿Estás seguro de que quieres cerrar sesión?"
        confirmLabel="Cerrar sesión"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={async () => {
          setLogoutOpen(false);
          // Borra la cookie httpOnly server-side (el navegador no puede
          // tocarla por JS) y limpia el cache de TanStack Query — si no,
          // "Continuar como invitado" seguiría mostrando los datos de la
          // sesión anterior hasta que expire el staleTime.
          await fetch("/api/logout", { method: "POST" });
          queryClient.clear();
          window.localStorage.removeItem(GUEST_MODE_KEY);
          // Si antes se usó "Continuar como invitado" y se eligió una
          // carrera a mano, no debe quedar pegada para la próxima vez que
          // alguien entre como invitado en este navegador.
          window.localStorage.removeItem(MANUAL_CARRERA_KEY);
          router.push("/login");
        }}
      />
    </>
  );
}
