"use client";

import { useQuery } from "@tanstack/react-query";

export type Materia = {
  grupo: string;
  materia: string;
  profesor: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
};

export type HorarioData = {
  studentName: string;
  materias: Materia[];
};

export type WeekGridRow = {
  time: string;
  classes: ({ subject: string; room: string; grupo: string } | null)[];
};

const DAY_KEYS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
] as const;

function parseSlot(value: string): { time: string; room: string } | null {
  const match = value.match(/^(\d{2}:\d{2})-\d{2}:\d{2}\/(.+)$/);
  return match ? { time: match[1], room: match[2] } : null;
}

// Reconstruye el grid semanal (issue #25, sección 8) a partir de las
// columnas lunes..viernes que trae el portal, agrupando por hora de inicio.
export function buildWeekGrid(materias: Materia[]): WeekGridRow[] {
  const times = new Set<string>();
  for (const m of materias) {
    for (const key of DAY_KEYS) {
      const slot = parseSlot(m[key]);
      if (slot) times.add(slot.time);
    }
  }

  return Array.from(times)
    .sort()
    .map((time) => ({
      time,
      classes: DAY_KEYS.map((key) => {
        for (const m of materias) {
          const slot = parseSlot(m[key]);
          if (slot?.time === time) {
            return { subject: m.materia, room: slot.room, grupo: m.grupo };
          }
        }
        return null;
      }),
    }));
}

async function fetchHorario(): Promise<HorarioData> {
  const res = await fetch("/api/horario");
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(
      data?.error ?? "No pudimos conectar con el portal escolar",
    );
  }
  return res.json();
}

export function useHorario() {
  return useQuery({
    queryKey: ["horario"],
    queryFn: fetchHorario,
    staleTime: 3 * 60 * 60 * 1000,
  });
}
