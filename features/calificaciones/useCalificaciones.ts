"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/fetchJson";

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

function fetchCalificaciones(): Promise<CalificacionesData> {
  return fetchJson(
    "/api/calificaciones",
    "No pudimos conectar con el portal escolar",
  );
}

export function useCalificaciones() {
  return useQuery({
    queryKey: ["calificaciones"],
    queryFn: fetchCalificaciones,
    staleTime: 3 * 60 * 60 * 1000,
  });
}
