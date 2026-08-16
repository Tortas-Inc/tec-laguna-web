"use client";

import { useQuery } from "@tanstack/react-query";

export type MateriaCalificacion = {
  grupo: string;
  materia: string;
  profesor: string;
  calificacion: string;
  oportunidad: string;
};

export type CalificacionesData = {
  promedio: number | null;
  materias: MateriaCalificacion[];
};

async function fetchCalificaciones(): Promise<CalificacionesData> {
  const res = await fetch("/api/calificaciones");
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      data?.error ?? "No pudimos conectar con el portal escolar",
    );
  }
  return res.json();
}

export function useCalificaciones() {
  return useQuery({
    queryKey: ["calificaciones"],
    queryFn: fetchCalificaciones,
    staleTime: 3 * 60 * 60 * 1000,
  });
}
