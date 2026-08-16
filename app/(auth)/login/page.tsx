"use client";

import { useMutation } from "@tanstack/react-query";
import Lottie from "lottie-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import loginAnimation from "@/public/lottie/login.json";
import { ThemeToggle } from "@/components/ThemeToggle";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  leave: { transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  leave: { opacity: 0, y: -10, transition: { duration: 0.25, ease: EASE } },
};

type LoginInput = { controlNumber: string; password: string };

async function login({ controlNumber, password }: LoginInput): Promise<void> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ controlNumber, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "No se pudo iniciar sesión");
  }
}

export default function LoginPage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      setTimeout(() => router.push("/horario"), 280);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      controlNumber: String(formData.get("controlNumber") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(195,132,81,0.22),rgba(195,132,81,0)_60%),linear-gradient(160deg,rgba(195,132,81,0.16),rgba(195,132,81,0)_60%)]"
      />

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        variants={container}
        initial="hidden"
        animate={mutation.isSuccess ? "leave" : "show"}
        className="relative z-10 w-full max-w-[380px]"
      >
        <motion.div variants={item} className="mb-3 flex items-center justify-center">
          <Lottie
            animationData={loginAnimation}
            loop
            autoplay
            className="h-[320px] w-[320px]"
          />
        </motion.div>

        <motion.h1 variants={item} className="text-2xl font-bold text-brand-black">
          TEC Laguna
        </motion.h1>
        <motion.p variants={item} className="mb-5 mt-1 text-sm text-brand-gray">
          Inicia sesión para continuar
        </motion.p>

        {mutation.isError ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mb-3 rounded-[10px] bg-danger-tint px-3.5 py-2.5 text-[13px] font-semibold text-danger"
          >
            {mutation.error.message}
          </motion.p>
        ) : null}

        <motion.div variants={item}>
          <label htmlFor="controlNumber" className="sr-only">
            Número de control
          </label>
          <input
            id="controlNumber"
            name="controlNumber"
            placeholder="Número de control"
            autoComplete="username"
            required
            disabled={mutation.isPending || mutation.isSuccess}
            className="mb-3 w-full rounded-[10px] bg-brand-primary-tint px-3.5 py-3 text-[15px] text-brand-black outline-none placeholder:text-brand-black/50 disabled:opacity-60"
          />
        </motion.div>

        <motion.div variants={item}>
          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            required
            disabled={mutation.isPending || mutation.isSuccess}
            className="mb-3 w-full rounded-[10px] bg-brand-primary-tint px-3.5 py-3 text-[15px] text-brand-black outline-none placeholder:text-brand-black/50 disabled:opacity-60"
          />
        </motion.div>

        <motion.button
          variants={item}
          type="submit"
          disabled={mutation.isPending || mutation.isSuccess}
          whileTap={{ scale: 0.98 }}
          className="mt-1.5 w-full rounded-[10px] bg-brand-primary py-3.5 text-[15px] font-bold text-white shadow-[0_8px_16px_-6px_rgba(195,132,81,0.5)] disabled:opacity-60"
        >
          {mutation.isPending
            ? "Iniciando sesión…"
            : mutation.isSuccess
              ? "¡Bienvenido!"
              : "Iniciar sesión"}
        </motion.button>

        <motion.p
          variants={item}
          className="mt-3.5 text-center text-[11px] leading-relaxed text-brand-gray-light"
        >
          Aplicación independiente, no afiliada al ITL/TecNM.
          <br />
          Tus credenciales nunca se guardan en nuestros servidores.{" "}
          <Link href="/privacidad" className="underline">
            Aviso de privacidad
          </Link>
        </motion.p>
      </motion.form>
    </main>
  );
}
