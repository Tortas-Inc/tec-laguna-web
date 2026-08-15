import { BookX } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { StatTile } from "@/components/StatTile";

const ROWS = [
  {
    clave: "C11",
    materia: "Taller de Ética",
    periodo: "Ago/Dic 2023",
    creditos: 4,
    calificacion: 92,
  },
  {
    clave: "C14",
    materia: "Cálculo Diferencial",
    periodo: "Ene/Jun 2023",
    creditos: 6,
    calificacion: 87,
  },
  {
    clave: "C16B",
    materia: "Desarrollo en Android",
    periodo: "Ago/Dic 2024",
    creditos: 5,
    calificacion: 95,
  },
  {
    clave: "C18B",
    materia: "Redes de Computadoras",
    periodo: "Ene/Jun 2025",
    creditos: 5,
    calificacion: 88,
  },
];

export default function KardexPage() {
  return (
    <>
      <PageHeader
        title="Kardex"
        subtitle="Ingeniería en Sistemas Computacionales"
      />

      <div className="mb-6 flex flex-wrap gap-3.5">
        <StatTile label="Promedio general" value={9.2} decimals={1} />
        <StatTile label="Créditos totales" value={186} />
      </div>

      {ROWS.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="Todavía no hay kardex disponible"
          description="Cuando el portal escolar tenga datos de tu historial académico, aparecerán aquí."
        />
      ) : (
        <>
      {/* Mobile: lista apilada */}
      <div className="flex flex-col gap-3 sm:hidden">
        {ROWS.map((row) => (
          <div
            key={row.clave}
            className="rounded-xl border border-brand-gray-lighter p-4"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-brand-gray-lighter px-2 py-0.75 text-xs font-bold text-brand-primary-dark">
                {row.clave}
              </span>
              <span className="text-lg font-bold tabular-nums text-brand-primary-dark">
                {row.calificacion}
              </span>
            </div>
            <div className="mt-2.5 text-[15px] font-semibold text-brand-black">
              {row.materia}
            </div>
            <div className="mt-1 flex justify-between text-sm text-brand-gray">
              <span>{row.periodo}</span>
              <span>{row.creditos} créditos</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet: tabla */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              {["Clave", "Materia", "Periodo", "Créditos", "Calificación"].map(
                (h) => (
                  <th
                    key={h}
                    className="border-b border-brand-gray-lighter px-3.5 pb-2.5 text-left text-xs font-bold uppercase tracking-[0.04em] text-brand-gray-light"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr
                key={row.clave}
                className="transition-colors duration-150 hover:bg-brand-primary-tint/40"
              >
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25">
                  <span className="rounded-md bg-brand-gray-lighter px-2 py-0.75 text-xs font-bold text-brand-primary-dark">
                    {row.clave}
                  </span>
                </td>
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25 text-[15px] text-brand-black">
                  {row.materia}
                </td>
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25 text-[15px] text-brand-gray">
                  {row.periodo}
                </td>
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25 text-[15px] text-brand-gray">
                  {row.creditos}
                </td>
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25 text-[15px] font-bold tabular-nums text-brand-primary-dark">
                  {row.calificacion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}
    </>
  );
}
