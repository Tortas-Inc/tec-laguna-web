"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type MateriaDetail = {
  badge: string;
  name: string;
  weekly: { day: string; value: string }[];
};

export function MateriaDetailDrawer({
  materia,
  onClose,
}: {
  materia: MateriaDetail | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {materia ? (
        <motion.div
          className="fixed inset-0 z-40 flex justify-end bg-black/45"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="relative h-full w-full max-w-[380px] overflow-y-auto bg-white p-7 shadow-[-14px_0_34px_rgba(0,0,0,0.16)]"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4.5 top-4.5 text-brand-gray-light"
            >
              <X className="h-4 w-4" strokeWidth={1.7} />
            </button>

            <div className="mb-2 pr-6 text-xl font-bold text-brand-black">
              {materia.name}
            </div>
            <span className="mb-3 inline-block rounded-full bg-brand-primary-dark px-2.5 py-1 text-xs font-bold text-white">
              {materia.badge}
            </span>

            <div className="mt-3">
              {materia.weekly.map((d) => (
                <div
                  key={d.day}
                  className="flex justify-between border-b border-brand-gray-lighter py-2.5 text-sm"
                >
                  <span className="text-brand-gray">{d.day}</span>
                  <span className="font-semibold text-brand-black">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-[10px] bg-brand-primary py-3.5 text-sm font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.07]"
            >
              Eliminar materia
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
