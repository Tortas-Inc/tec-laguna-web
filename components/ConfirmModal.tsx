"use client";

import { AnimatePresence, motion } from "framer-motion";

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
  danger = false,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  danger?: boolean;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
        >
          <motion.div
            className="w-full max-w-[380px] rounded-2xl bg-surface p-6.5 shadow-[0_24px_48px_rgba(0,0,0,0.22)]"
            initial={{ scale: 0.94, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 10, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-lg font-bold text-brand-black">{title}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-gray">
              {description}
            </p>
            <div className="mt-4.5 flex gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-[10px] border border-brand-primary-tint py-3 text-sm font-bold text-brand-primary transition-colors duration-150 hover:bg-brand-primary-tint"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 rounded-[10px] py-3 text-sm font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.07] ${
                  danger ? "bg-danger" : "bg-brand-primary"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
