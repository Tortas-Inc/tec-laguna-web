"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "teclaguna:theme";
const EASE = [0.16, 1, 0.3, 1] as const;

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // El estado real lo decide el script inline en app/layout.tsx (evita
  // parpadeo); aquí solo leemos la clase ya aplicada tras montar.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única del DOM tras montar, no hay forma de derivarlo en el render (evita mismatch de hidratación con el script inline)
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function applyTheme(next: boolean) {
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  }

  function toggle() {
    applyTheme(!isDark);
  }

  if (!mounted) {
    return (
      <div className="h-8 w-15 flex-none rounded-full bg-brand-gray-light/20 ring-1 ring-inset ring-brand-gray-light/35" />
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={isDark}
      className={`relative flex h-8 w-15 flex-none items-center rounded-full px-1 ring-1 ring-inset transition-colors duration-300 ${
        isDark
          ? "bg-brand-primary-tint ring-brand-primary-dark/40"
          : "bg-brand-gray-light/20 ring-brand-gray-light/35"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-surface text-brand-primary-dark shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
        style={{ marginLeft: isDark ? "auto" : 0 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.4 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.4 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <Sun className="h-3.5 w-3.5" strokeWidth={2} />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
}
