"use client";

import { useCalificaciones } from "@/features/calificaciones/useCalificaciones";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { QueryError } from "@/components/QueryError";
import { StatTile } from "@/components/StatTile";

const EASE = [0.16, 1, 0.3, 1] as const;
const rowMotion = (index: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, delay: Math.min(index * 0.04, 0.4), ease: EASE },
});

export default function CalificacionesPage() {
  const { data, isLoading, isError, error } = useCalificaciones();

  return (
    <>
      <PageHeader
        title="Calificaciones finales"
        subtitle="Estas son tus calificaciones del semestre"
      />

      {isLoading ? (
        <p className="text-sm text-brand-gray">Cargando…</p>
      ) : null}
      {isError ? <QueryError message={error.message} /> : null}

      {data ? (
        <>
          {data.promedio !== null ? (
            <div className="mb-6 flex flex-wrap gap-3.5">
              <StatTile
                label="Promedio semestral"
                value={data.promedio}
                decimals={1}
              />
            </div>
          ) : null}

          {data.materias.length === 0 ? (
            <EmptyState
              title="Todavía no hay calificaciones"
              description="Cuando el portal escolar publique tus calificaciones del semestre, aparecerán aquí."
            />
          ) : (
            <>
              {/* Mobile: lista apilada */}
              <div className="flex flex-col gap-3 sm:hidden">
                {data.materias.map((row, index) => (
                  <motion.div
                    key={row.grupo}
                    {...rowMotion(index)}
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
                  </motion.div>
                ))}
              </div>

              {/* Desktop/tablet: tabla */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[560px] border-collapse">
                  <thead>
                    <tr>
                      {[
                        "Grupo",
                        "Materia",
                        "Profesor",
                        "Oportunidad",
                        "Calificación",
                      ].map((h) => (
                        <th
                          key={h}
                          className="border-b border-brand-gray-lighter px-3.5 pb-2.5 text-left text-xs font-bold uppercase tracking-[0.04em] text-brand-gray-light"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.materias.map((row, index) => (
                      <motion.tr
                        key={row.grupo}
                        {...rowMotion(index)}
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
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      ) : null}
    </>
  );
}
