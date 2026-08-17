"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/apiError";

// La sesión del ITL dura pocos minutos y volver a pedir login a cada
// rato es muy molesto — la info de estas pantallas casi nunca cambia de
// un día para otro. Si la sesión expiró (401) pero todavía tenemos datos
// cacheados de hace menos de 6h, se ignora el error y se sigue mostrando
// ese cache tal cual, en silencio. Pasadas las 6h (o si nunca hubo datos
// que mostrar), se manda a /login.
const SESSION_GRACE_MS = 6 * 60 * 60 * 1000;

export function useSessionExpiredRedirect({
  isError,
  error,
  dataUpdatedAt,
}: {
  isError: boolean;
  error: unknown;
  dataUpdatedAt: number;
}) {
  const router = useRouter();
  const isSessionError =
    isError && error instanceof ApiError && error.status === 401;

  // "¿el cache sigue dentro del margen de 6h?" depende de Date.now(),
  // que es impuro — se calcula dentro del efecto (no durante el render)
  // y se guarda en estado. Arranca en true para no redirigir de más
  // antes de que el efecto corra la primera vez.
  const [withinGrace, setWithinGrace] = useState(true);

  useEffect(() => {
    const grace =
      dataUpdatedAt > 0 && Date.now() - dataUpdatedAt < SESSION_GRACE_MS;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende de Date.now(), no se puede derivar puro en el render
    setWithinGrace(grace);

    if (!isSessionError || grace) return;
    router.push("/login?expired=1");
  }, [isSessionError, dataUpdatedAt, router]);

  return { suppressError: isSessionError && withinGrace };
}
