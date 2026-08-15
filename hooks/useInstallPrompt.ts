"use client";

import { useEffect, useState } from "react";

type Platform = "android" | "ios" | "desktop" | null;

export function useInstallPrompt() {
  const [platform, setPlatform] = useState<Platform>(null);

  useEffect(() => {
    const ua = window.navigator.userAgent;
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
