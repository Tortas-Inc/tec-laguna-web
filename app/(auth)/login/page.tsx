"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import loginAnimation from "@/public/lottie/login.json";

export default function LoginPage() {
  const router = useRouter();

  // TODO: conectar con POST /api/login (issue #25, sección 3) en vez de navegar directo.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/horario");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,rgba(195,132,81,0.10),rgba(255,255,255,0)_55%),#fff] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-[380px]">
        <div className="mb-3 flex items-center justify-center">
          <Lottie
            animationData={loginAnimation}
            loop
            autoplay
            className="h-[320px] w-[320px]"
          />
        </div>

        <h1 className="text-xl font-bold text-brand-black">TEC Laguna</h1>
        <p className="mb-5 mt-1 text-[12.5px] text-brand-gray">
          Inicia sesión para continuar
        </p>

        <label htmlFor="controlNumber" className="sr-only">
          Número de control
        </label>
        <input
          id="controlNumber"
          name="controlNumber"
          placeholder="Número de control"
          autoComplete="username"
          required
          className="mb-3 w-full rounded-[10px] bg-brand-primary-tint px-3.5 py-3 text-[13px] text-black outline-none placeholder:text-black/50"
        />

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
          className="mb-3 w-full rounded-[10px] bg-brand-primary-tint px-3.5 py-3 text-[13px] text-black outline-none placeholder:text-black/50"
        />

        <button
          type="submit"
          className="mt-1.5 w-full rounded-[10px] bg-brand-primary py-3.5 text-[13px] font-bold text-white shadow-[0_8px_16px_-6px_rgba(195,132,81,0.5)]"
        >
          Iniciar sesión
        </button>

        <p className="mt-3.5 text-center text-[9.5px] leading-relaxed text-brand-gray-light">
          App independiente, no afiliada al ITL/TecNM.
          <br />
          Tus credenciales nunca se guardan en nuestros servidores.{" "}
          <Link href="/privacidad" className="underline">
            Aviso de privacidad
          </Link>
        </p>
      </form>
    </main>
  );
}
