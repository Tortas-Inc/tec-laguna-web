"use client";

import { useQuery } from "@tanstack/react-query";

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

async function fetchKardex(): Promise<KardexData> {
  const res = await fetch("/api/kardex");
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      data?.error ?? "No pudimos conectar con el portal escolar",
    );
  }
  return res.json();
}

export function useKardex() {
  return useQuery({
    queryKey: ["kardex"],
    queryFn: fetchKardex,
    staleTime: 3 * 60 * 60 * 1000,
  });
}
