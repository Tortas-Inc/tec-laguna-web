"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/fetchJson";

export type MateriaKardex = {
  clave: string;
  materia: string;
  creditos: number;
  calificacion: string;
  periodo1: string;
  periodo2: string;
  periodo3: string;
};

export type KardexData = {
  carrera: string;
  carreraCode: string;
  promedio: string;
  creditosTotales: number;
  materias: MateriaKardex[];
};

function fetchKardex(): Promise<KardexData> {
  return fetchJson("/api/kardex", "No pudimos conectar con el portal escolar");
}

export function useKardex({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["kardex"],
    queryFn: fetchKardex,
    staleTime: 3 * 60 * 60 * 1000,
    // Por defecto TanStack Query reintenta 3 veces con backoff — un 401
    // (sin sesión, el caso normal para invitados) va a seguir fallando
    // igual, así que solo alarga innecesariamente isLoading varios
    // segundos. Este hook también se usa para saber "¿hay sesión?", así
    // que conviene que falle rápido.
    retry: false,
    enabled,
  });
}
