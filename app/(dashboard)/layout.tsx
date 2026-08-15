import Link from "next/link";

const NAV_ITEMS = [
  { href: "/horario", label: "Tu horario" },
  { href: "/horarios", label: "Horarios por carrera" },
  { href: "/kardex", label: "Kardex" },
  { href: "/calificaciones", label: "Calificaciones" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col border-r border-neutral-200 p-4">
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-sm hover:bg-neutral-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-neutral-200 pt-4 text-xs text-neutral-500">
          <p>No. de control</p>
          <button className="mt-2 text-left hover:underline">
            Cerrar sesión
          </button>
          <Link href="/privacidad" className="mt-2 block hover:underline">
            Aviso de privacidad
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
