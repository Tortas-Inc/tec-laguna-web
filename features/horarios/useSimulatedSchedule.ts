"use client";

import { useCallback, useEffect, useState } from "react";
import { MateriaHorarioCarrera } from "./useHorariosCarrera";
import { materiaId, startHour } from "./schedule";

const STORAGE_KEY = "teclaguna:horario-simulado";
// Formato de la versión con múltiples horarios con nombre (se quitó para
// simplificar la función a un solo horario) — se migra una vez tomando el
// que estaba activo y se descartan los demás.
const MULTI_SCHEDULE_KEY = "teclaguna:horarios-guardados";
const MULTI_ACTIVE_KEY = "teclaguna:horario-activo-id";

export type AddResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" }
  | { ok: false; reason: "different-career" }
  | { ok: false; reason: "conflict"; conflicting: MateriaHorarioCarrera };

export const ADD_RESULT_MESSAGE = {
  duplicate: "Ya agregaste esta materia",
  differentCarrera:
    "Esta materia es de otra carrera — vacía tu horario para poder agregarla",
  conflict: (materia: string) => `Ya tienes "${materia}" a esta hora`,
};

type PersistedState = {
  materias: MateriaHorarioCarrera[];
  carreraCode: string | null;
};

function readInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Formato original (antes de guardar la carrera): array plano.
      if (Array.isArray(parsed)) return { materias: parsed, carreraCode: null };
      return {
        materias: Array.isArray(parsed.materias) ? parsed.materias : [],
        carreraCode: parsed.carreraCode ?? null,
      };
    }

    const multiRaw = window.localStorage.getItem(MULTI_SCHEDULE_KEY);
    if (multiRaw) {
      const schedules = JSON.parse(multiRaw);
      const activeId = window.localStorage.getItem(MULTI_ACTIVE_KEY);
      const active =
        (Array.isArray(schedules) &&
          (schedules.find((s) => s.id === activeId) ?? schedules[0])) ||
        null;
      window.localStorage.removeItem(MULTI_SCHEDULE_KEY);
      window.localStorage.removeItem(MULTI_ACTIVE_KEY);
      if (active) {
        return {
          materias: Array.isArray(active.materias) ? active.materias : [],
          carreraCode: active.carreraCode ?? null,
        };
      }
    }

    return { materias: [], carreraCode: null };
  } catch {
    return { materias: [], carreraCode: null };
  }
}

// Réplica de AddMateriaUseCase (Android), pero sin servidor — una "lista
// guía" local del navegador, no algo que el backend deba persistir
// (issue #25, sección 1). carreraCode se fija sola con la primera
// materia que se agrega, para no poder mezclar materias de carreras
// distintas en el mismo horario.
export function useSimulatedSchedule() {
  const [materias, setMaterias] = useState<MateriaHorarioCarrera[]>([]);
  const [carreraCode, setCarreraCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initial = readInitialState();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de localStorage al montar, no hay forma de derivarlo en el render
    setMaterias(initial.materias);
    setCarreraCode(initial.carreraCode);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ materias, carreraCode }),
    );
  }, [materias, carreraCode, hydrated]);

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
    (materia: MateriaHorarioCarrera, especialidad: string | null): AddResult => {
      if (especialidad && carreraCode && carreraCode !== especialidad) {
        return { ok: false, reason: "different-career" };
      }
      if (isAdded(materia)) return { ok: false, reason: "duplicate" };
      const conflicting = materias.find(
        (m) => startHour(m) === startHour(materia),
      );
      if (conflicting) return { ok: false, reason: "conflict", conflicting };
      setMaterias([...materias, materia]);
      if (!carreraCode && especialidad) setCarreraCode(especialidad);
      return { ok: true };
    },
    [materias, carreraCode, isAdded],
  );

  const remove = useCallback(
    (grupo: string) => {
      const next = materias.filter(
        (m) => materiaId(m.grupo) !== materiaId(grupo),
      );
      setMaterias(next);
      // Sin materias, el horario queda libre para cualquier carrera otra vez.
      if (next.length === 0) setCarreraCode(null);
    },
    [materias],
  );

  // Quita la materia en conflicto y agrega la nueva en su lugar (botón
  // "Reemplazar" en el drawer de detalle / en la tabla).
  const replace = useCallback(
    (previous: MateriaHorarioCarrera, next: MateriaHorarioCarrera) => {
      setMaterias([
        ...materias.filter(
          (m) => materiaId(m.grupo) !== materiaId(previous.grupo),
        ),
        next,
      ]);
    },
    [materias],
  );

  const clear = useCallback(() => {
    setMaterias([]);
    setCarreraCode(null);
  }, []);

  return {
    materias,
    carreraCode,
    isAdded,
    add,
    remove,
    replace,
    clear,
  };
}
