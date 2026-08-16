"use client";

import { useCallback, useEffect, useState } from "react";
import { MateriaHorarioCarrera } from "./useHorariosCarrera";
import { materiaId, startHour } from "./schedule";

const STORAGE_KEY = "teclaguna:horario-simulado";

export type AddResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" }
  | { ok: false; reason: "conflict"; conflicting: MateriaHorarioCarrera };

export const ADD_RESULT_MESSAGE = {
  duplicate: "Ya agregaste esta materia",
  conflict: (materia: string) => `Ya tienes "${materia}" a esta hora`,
};

// Réplica de AddMateriaUseCase/HorariosCarreraState (Android), pero sin
// servidor: es una "lista guía" local del navegador, no algo que el
// backend deba persistir (issue #25, sección 1). A diferencia de Android,
// no hay límite de materias — el alumno decide cuántas explorar.
export function useSimulatedSchedule() {
  const [materias, setMaterias] = useState<MateriaHorarioCarrera[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setMaterias(JSON.parse(raw));
    } catch {
      // localStorage no disponible o con datos corruptos: seguimos vacíos.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(materias));
  }, [materias, hydrated]);

  const isAdded = useCallback(
    (materia: MateriaHorarioCarrera) =>
      materias.some(
        (m) =>
          materiaId(m.grupo) === materiaId(materia.grupo) ||
          m.materia === materia.materia,
      ),
    [materias],
  );

  const add = useCallback(
    (materia: MateriaHorarioCarrera): AddResult => {
      if (isAdded(materia)) return { ok: false, reason: "duplicate" };
      const conflicting = materias.find(
        (m) => startHour(m) === startHour(materia),
      );
      if (conflicting) {
        return { ok: false, reason: "conflict", conflicting };
      }
      setMaterias((prev) => [...prev, materia]);
      return { ok: true };
    },
    [materias, isAdded],
  );

  const remove = useCallback((grupo: string) => {
    setMaterias((prev) =>
      prev.filter((m) => materiaId(m.grupo) !== materiaId(grupo)),
    );
  }, []);

  // Quita la materia en conflicto y agrega la nueva en su lugar (botón
  // "Reemplazar" en el drawer de detalle).
  const replace = useCallback(
    (previous: MateriaHorarioCarrera, next: MateriaHorarioCarrera) => {
      setMaterias((prev) => [
        ...prev.filter(
          (m) => materiaId(m.grupo) !== materiaId(previous.grupo),
        ),
        next,
      ]);
    },
    [],
  );

  return { materias, isAdded, add, remove, replace };
}
