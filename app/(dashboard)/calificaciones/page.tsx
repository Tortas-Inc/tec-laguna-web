import { PageHeader } from "@/components/PageHeader";
import { StatTile } from "@/components/StatTile";

const ROWS = [
  {
    grupo: "C11",
    materia: "Taller de Ética",
    profesor: "Martínez Soto Elena",
    oportunidad: "Ordinario",
    calificacion: 92,
  },
  {
    grupo: "C14",
    materia: "Cálculo Diferencial",
    profesor: "Ramírez Castro Jorge",
    oportunidad: "Ordinario",
    calificacion: 87,
  },
  {
    grupo: "C16B",
    materia: "Desarrollo en Android",
    profesor: "Gil Vázquez Luis Fernando",
    oportunidad: "Ordinario",
    calificacion: 95,
  },
];

export default function CalificacionesPage() {
  return (
    <>
      <PageHeader
        title="Calificaciones finales"
        subtitle="Estas son tus calificaciones del semestre"
      />

      <div className="mb-6 flex flex-wrap gap-3.5">
        <StatTile label="Promedio semestral" value={8.7} decimals={1} />
      </div>

      {/* Mobile: lista apilada */}
      <div className="flex flex-col gap-3 sm:hidden">
        {ROWS.map((row) => (
          <div
            key={row.grupo}
            className="rounded-xl border border-brand-gray-lighter p-4"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-brand-gray-lighter px-2 py-0.75 text-xs font-bold text-brand-primary-dark">
                {row.grupo}
              </span>
              <span className="text-lg font-bold tabular-nums text-brand-primary-dark">
                {row.calificacion}
              </span>
            </div>
            <div className="mt-2.5 text-[15px] font-semibold text-brand-black">
              {row.materia}
            </div>
            <div className="mt-1 flex justify-between text-sm text-brand-gray">
              <span>{row.profesor}</span>
              <span>{row.oportunidad}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/tablet: tabla */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              {["Grupo", "Materia", "Profesor", "Oportunidad", "Calificación"].map(
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
                key={row.grupo}
                className="transition-colors duration-150 hover:bg-brand-primary-tint/40"
              >
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25">
                  <span className="rounded-md bg-brand-gray-lighter px-2 py-0.75 text-xs font-bold text-brand-primary-dark">
                    {row.grupo}
                  </span>
                </td>
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25 text-[15px] text-brand-black">
                  {row.materia}
                </td>
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25 text-[15px] text-brand-gray">
                  {row.profesor}
                </td>
                <td className="border-b border-brand-gray-lighter px-3.5 py-3.25 text-[15px] text-brand-gray">
                  {row.oportunidad}
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
  );
}
