"use client";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Play, Share2 } from "lucide-react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.tortasmcfly.teclaguna";

export function InstallCta() {
  const platform = useInstallPrompt();

  if (platform !== "android" && platform !== "ios") return null;

  return (
    <div
      className={`flex gap-2.5 border-b border-brand-primary/[0.18] bg-brand-primary-tint px-3.5 py-3.25 ${
        platform === "android" ? "items-center" : "items-start"
      }`}
    >
      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] bg-brand-primary-dark text-white">
        {platform === "android" ? (
          <Play className="h-4 w-4" strokeWidth={1.7} fill="currentColor" />
        ) : (
          <Share2 className="h-4 w-4" strokeWidth={1.7} />
        )}
      </div>

      <p className="flex-1 text-[13px] font-semibold leading-snug text-brand-primary-dark">
        {platform === "android" ? (
          <>
            La app de TEC Laguna ya existe en <b>Google Play</b> — mejor
            experiencia que el navegador.
          </>
        ) : (
          <>
            Instala esta app: toca <b>Compartir</b> (▢↑) en la barra inferior
            y luego <b>&quot;Agregar a pantalla de inicio&quot;</b>.
          </>
        )}
      </p>

      {platform === "android" ? (
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex-none whitespace-nowrap self-center rounded-lg bg-brand-primary px-3 py-2 text-xs font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.07]"
        >
          Ver en Play
        </a>
      ) : null}
    </div>
  );
}
