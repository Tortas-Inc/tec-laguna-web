"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Repeat2, Trash2, X } from "lucide-react";

export type MateriaDetail = {
  badge: string;
  name: string;
  weekly: { day: string; value: string }[];
};

export function MateriaDetailDrawer({
  materia,
  onClose,
  actionLabel,
  actionVariant = "add",
  onAction,
  disclaimer,
  actionError,
  onReplace,
}: {
  materia: MateriaDetail | null;
  onClose: () => void;
  actionLabel?: string;
  actionVariant?: "add" | "remove";
  onAction?: () => void;
  disclaimer?: string;
  actionError?: string | null;
  onReplace?: () => void;
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
            className="relative h-full w-full max-w-[380px] overflow-y-auto bg-surface p-7 shadow-[-14px_0_34px_rgba(0,0,0,0.16)]"
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

            {disclaimer ? (
              <p className="mt-4 text-xs leading-relaxed text-brand-gray-light">
                {disclaimer}
              </p>
            ) : null}

            <AnimatePresence>
              {actionError ? (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 overflow-hidden rounded-[10px] bg-danger-tint"
                >
                  <div className="px-3.5 py-2.5">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-danger">
                      <AlertCircle
                        className="h-4 w-4 flex-none"
                        strokeWidth={2}
                      />
                      {actionError}
                    </div>
                    {onReplace ? (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={onReplace}
                        className="mt-2.5 flex items-center gap-1.5 text-[13px] font-bold text-danger transition-colors duration-150 hover:text-danger-dark"
                      >
                        <Repeat2 className="h-4 w-4" strokeWidth={2.2} />
                        Reemplazar
                      </motion.button>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {actionLabel && onAction ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onAction}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] py-3.5 text-sm font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.07] ${
                  actionVariant === "remove"
                    ? "bg-danger"
                    : "bg-brand-primary"
                }`}
              >
                {actionVariant === "remove" ? (
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                ) : null}
                {actionLabel}
              </motion.button>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
