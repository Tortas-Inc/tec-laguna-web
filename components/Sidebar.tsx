"use client";

import { Award, BookOpen, Home, Layers, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/horario", label: "Tu horario", icon: Home },
  { href: "/horarios", label: "Horarios", icon: Layers },
  { href: "/calificaciones", label: "Calificaciones", icon: Award },
  { href: "/kardex", label: "Kardex", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[216px] flex-none flex-col bg-brand-gray-lighter px-3.5 py-5.5 border-r border-[#ECECEC]">
      <div className="mb-7 px-2.5 text-[17px] font-bold text-brand-black">
        TEC Laguna
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-brand-primary text-white"
                  : "text-brand-gray hover:bg-black/5"
              }`}
            >
              <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#E9E9E9] px-2.5 pt-3">
        {/* TODO: reemplazar por el número de control real cuando exista sesión (issue #25, sección 3) */}
        <div className="text-xs font-bold text-brand-primary-dark">
          20211234
        </div>
        <button
          type="button"
          className="mt-2.5 flex items-center gap-2 text-[11.5px] text-brand-gray"
        >
          <LogOut className="h-3.5 w-3.5" strokeWidth={1.7} />
          Cerrar sesión
        </button>
        <p className="mt-3 text-[9px] leading-relaxed text-brand-gray-light">
          No afiliado con el ITL/TecNM ·{" "}
          <Link href="/privacidad" className="underline">
            Aviso de privacidad
          </Link>
        </p>
      </div>
    </aside>
  );
}
