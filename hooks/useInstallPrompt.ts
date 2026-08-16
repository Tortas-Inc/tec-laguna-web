"use client";

import { useEffect, useState } from "react";

type Platform = "android" | "ios" | "desktop" | null;

export function useInstallPrompt() {
  const [platform, setPlatform] = useState<Platform>(null);

  useEffect(() => {
    // Si ya se abrió como PWA instalada no tiene caso seguir invitando a
    // instalarla. iOS no soporta la media query estándar y expone su
    // propio flag (navigator.standalone); el resto de navegadores sí
    // respetan "display-mode: standalone" una vez instalada la PWA.
    const isStandalone =
      (window.navigator as Navigator & { standalone?: boolean })
        .standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Detección de plataforma solo puede correr en cliente (userAgent no
    // existe en SSR); se hace en el efecto a propósito para evitar un
    // hydration mismatch entre el render del servidor y el del navegador.
    const ua = window.navigator.userAgent;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (/iPhone|iPad|iPod/.test(ua)) setPlatform("ios");
    else if (/Android/.test(ua)) setPlatform("android");
    else setPlatform("desktop");

    // Suprime el banner nativo de instalación de Chrome/Android: en su
    // lugar mostramos nuestro propio CTA hacia Play Store (issue #25,
    // sección 9) porque la app nativa ya existe.
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt,
      );
  }, []);

  return platform;
}
