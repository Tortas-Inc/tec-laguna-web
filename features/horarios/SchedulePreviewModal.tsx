"use client";

import { useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { buildWeekGrid } from "@/features/horario/useHorario";
import { WeekGrid } from "@/features/horario/WeekGrid";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CalendarX, List, X } from "lucide-react";
import { MateriaHorarioCarrera } from "./useHorariosCarrera";

type ViewMode = "calendar" | "list";

const DAY_FIELDS = [
  { key: "lunes", label: "L" },
  { key: "martes", label: "M" },
  { key: "miercoles", label: "I" },
  { key: "jueves", label: "J" },
  { key: "viernes", label: "V" },
] as const;

function scheduleLabel(m: MateriaHorarioCarrera): string {
  const value = DAY_FIELDS.map((d) => m[d.key]).find((v) => v);
  if (!value) return "Sin horario";
  const match = value.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})\/(.+)$/);
  return match ? `${match[1]}–${match[2]} / ${match[3]}` : value;
}

function ScheduleList({
  materias,
  onRemoveGrupo,
}: {
  materias: MateriaHorarioCarrera[];
  onRemoveGrupo?: (grupo: string) => void;
}) {
  if (materias.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="Tu lista guía está vacía"
        description="Agrega materias desde la tabla para ver aquí cómo quedaría tu horario."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {materias.map((m) => (
        <div
          key={m.grupo}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-gray-lighter px-3.5 py-3"
        >
          <span className="flex-none rounded-full bg-brand-primary-dark px-2 py-0.75 text-[11px] font-bold text-white">
            {m.grupo}
          </span>
          <div className="min-w-[180px] flex-1">
            <div className="text-sm font-bold text-brand-black">
              {m.materia}
            </div>
            <div className="text-xs text-brand-gray-light">{m.profesor}</div>
          </div>
          <div className="flex gap-1">
            {DAY_FIELDS.map((d) => (
              <span
                key={d.label}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  m[d.key]
                    ? "bg-brand-primary-dark text-white"
                    : "bg-brand-gray-lighter text-brand-gray-light"
                }`}
              >
                {d.label}
              </span>
            ))}
          </div>
          <div className="whitespace-nowrap text-xs text-brand-gray">
            {scheduleLabel(m)}
          </div>
          {onRemoveGrupo ? (
            <button
              type="button"
              onClick={() => onRemoveGrupo(m.grupo)}
              aria-label={`Quitar ${m.materia}`}
              className="flex-none text-brand-gray-light transition-colors duration-150 hover:text-danger"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function SchedulePreviewModal({
  open,
  materias,
  onClose,
  onRemoveGrupo,
}: {
  open: boolean;
  materias: MateriaHorarioCarrera[];
  onClose: () => void;
  onRemoveGrupo?: (grupo: string) => void;
}) {
  const [view, setView] = useState<ViewMode>("calendar");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-full w-full max-w-6xl overflow-x-hidden overflow-y-auto rounded-2xl bg-surface p-7 shadow-[0_24px_48px_rgba(0,0,0,0.22)]"
            initial={{ scale: 0.96, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-brand-black">
                  Vista previa de tu lista guía
                </div>
                <p className="mt-1 text-xs text-brand-gray-light">
                  Simulación del próximo semestre — no es tu inscripción
                  oficial.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-brand-gray-lighter p-1">
                  <button
                    type="button"
                    onClick={() => setView("calendar")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                      view === "calendar"
                        ? "bg-surface text-brand-black shadow-sm"
                        : "text-brand-gray-light hover:text-brand-gray"
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Calendario
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                      view === "list"
                        ? "bg-surface text-brand-black shadow-sm"
                        : "text-brand-gray-light hover:text-brand-gray"
                    }`}
                  >
                    <List className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Lista
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="text-brand-gray-light"
                >
                  <X className="h-4 w-4" strokeWidth={1.7} />
                </button>
              </div>
            </div>

            {view === "calendar" ? (
              <WeekGrid
                timeSlots={buildWeekGrid(materias)}
                emptyTitle="Tu lista guía está vacía"
                emptyDescription="Agrega materias desde la tabla para ver aquí cómo quedaría tu horario."
                onRemoveBlock={onRemoveGrupo}
              />
            ) : (
              <ScheduleList materias={materias} onRemoveGrupo={onRemoveGrupo} />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
