"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, X } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Aviso informativo: los datos vienen en vivo del portal del ITL, no de
// esta app — si el portal está caído no hay nada que la app pueda hacer.
// Se monta una sola vez en el layout raíz (no por página), así que el
// estado "dismissed" sobrevive la navegación entre páginas — solo
// desaparece si el usuario le da clic a la "×". A propósito no se guarda
// en localStorage: en una recarga completa o una visita nueva vuelve a
// aparecer.
// Toast flotante (no un banner arriba) porque InstallCta ya ocupa esa
// posición y verlos apilados ahí se siente como el mismo aviso repetido.
export function DataSourceDisclaimer() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-x-4 bottom-4 z-40 flex items-start gap-2.5 rounded-xl border border-brand-gray-lighter bg-surface p-3.5 shadow-[0_14px_32px_-12px_rgba(20,14,6,0.25)] sm:inset-x-auto sm:right-4 sm:max-w-[340px]"
        >
          <Info
            className="mt-0.5 h-4 w-4 flex-none text-brand-gray-light"
            strokeWidth={1.8}
          />

          <p className="flex-1 text-[12.5px] leading-snug text-brand-gray">
            Los datos vienen en vivo del portal del ITL — si algo no carga,
            puede que el portal de la escuela esté caído (no depende de
            esta app).
          </p>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Cerrar aviso"
            className="flex-none text-brand-gray-light transition-colors duration-150 hover:text-brand-gray"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
