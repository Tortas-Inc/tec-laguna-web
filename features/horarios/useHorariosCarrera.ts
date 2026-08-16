"use client";

import { useQuery } from "@tanstack/react-query";
import { DAY_MS } from "@/lib/queryConfig";

export type MateriaHorarioCarrera = {
  materia: string;
  grupo: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  profesor: string;
  isFinished: boolean;
};

async function fetchHorariosCarrera(
  especialidad: string,
): Promise<MateriaHorarioCarrera[]> {
  const res = await fetch(
    `/api/horarios?especialidad=${encodeURIComponent(especialidad)}`,
  );
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      data?.error ?? "No pudimos conectar con el portal escolar",
    );
  }
  const data = await res.json();
  return data.materias;
}

// especialidad viene del carreraCode del kardex del alumno (ver
// app/(dashboard)/horarios/page.tsx) — mientras no se conoce, la query
// queda deshabilitada en vez de pegarle con un valor arbitrario.
export function useHorariosCarrera(especialidad: string | null) {
  return useQuery({
    queryKey: ["horarios-carrera", especialidad],
    queryFn: () => fetchHorariosCarrera(especialidad as string),
    enabled: Boolean(especialidad),
    staleTime: DAY_MS,
  });
}
