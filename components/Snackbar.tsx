"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export type SnackbarVariant = "success" | "error";

export function Snackbar({
  message,
  variant = "success",
}: {
  message: string | null;
  variant?: SnackbarVariant;
}) {
  const isSuccess = variant === "success";

  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          className={`fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-[10px] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(0,0,0,0.35)] ${
            isSuccess ? "bg-brand-green" : "bg-danger"
          }`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-4 w-4 flex-none" strokeWidth={2} />
          ) : (
            <AlertCircle className="h-4 w-4 flex-none" strokeWidth={2} />
          )}
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
