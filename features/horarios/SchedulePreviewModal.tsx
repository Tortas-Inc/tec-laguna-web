"use client";

import { buildWeekGrid } from "@/features/horario/useHorario";
import { WeekGrid } from "@/features/horario/WeekGrid";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { MateriaHorarioCarrera } from "./useHorariosCarrera";

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
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="max-h-full w-full max-w-4xl overflow-x-hidden overflow-y-auto rounded-2xl bg-surface p-6.5 shadow-[0_24px_48px_rgba(0,0,0,0.22)]"
            initial={{ scale: 0.96, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-lg font-bold text-brand-black">
                  Vista previa de tu lista guía
                </div>
                <p className="mt-1 text-xs text-brand-gray-light">
                  Simulación del próximo semestre — no es tu inscripción
                  oficial.
                </p>
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

            <WeekGrid
              timeSlots={buildWeekGrid(materias)}
              emptyTitle="Tu lista guía está vacía"
              emptyDescription="Agrega materias desde las tarjetas para ver aquí cómo quedaría tu horario."
              onRemoveBlock={onRemoveGrupo}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
