"use client";

import { TriangleAlert } from "lucide-react";

export default function HorariosError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-10 py-15 text-center">
      <div className="mb-3.5 flex h-17 w-17 items-center justify-center rounded-full bg-danger-tint text-danger motion-safe:animate-[pulse-ring_2.4s_ease-in-out_infinite]">
        <TriangleAlert className="h-8 w-8" strokeWidth={1.7} />
      </div>
      <div className="text-lg font-bold text-brand-black">
        No pudimos conectar con el portal escolar
      </div>
      <p className="mb-4.5 mt-1 max-w-[360px] text-sm leading-relaxed text-brand-gray">
        Revisa tu conexión a internet o intenta de nuevo en unos minutos. El
        resto de la app sigue funcionando con normalidad.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-[10px] bg-brand-primary px-6 py-3 text-sm font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.07]"
      >
        Reintentar
      </button>
    </div>
  );
}
