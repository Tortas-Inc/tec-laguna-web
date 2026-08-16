import { WeekGridRow } from "./useHorario";

export type ScheduleOccurrence = {
  dayIndex: number;
  time: string;
  subject: string;
  room: string;
};

export type ScheduleStatus = {
  current: ScheduleOccurrence | null;
  next: ScheduleOccurrence | null;
  // Minutos transcurridos en la semana (día*1440+minuto, 0=Lun 00:00) —
  // permite saber si un bloque cualquiera ya pasó (Google Calendar solo
  // baja la opacidad de los eventos pasados, no cambia su color).
  nowWeekMinutes: number;
};

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

const CLASS_DURATION_MINUTES = 60;
const MINUTES_PER_DAY = 24 * 60;

export function isPastOccurrence(
  dayIndex: number,
  time: string,
  nowWeekMinutes: number,
): boolean {
  return (
    dayIndex * MINUTES_PER_DAY +
      parseTimeToMinutes(time) +
      CLASS_DURATION_MINUTES <=
    nowWeekMinutes
  );
}

// Marca dónde está el alumno "ahora mismo" en su horario semanal y cuál es
// su próxima clase (puede caer en otro día, incluso la próxima semana si
// ya no queda ninguna). Recibe `now` como parámetro para poder testearlo.
export function computeScheduleStatus(
  timeSlots: WeekGridRow[],
  now: Date,
): ScheduleStatus {
  const jsDay = now.getDay(); // 0=domingo..6=sábado
  const currentDayIndex = jsDay >= 1 && jsDay <= 5 ? jsDay - 1 : -1; // 0=Lun..4=Vie
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let current: ScheduleOccurrence | null = null;
  if (currentDayIndex >= 0) {
    for (const slot of timeSlots) {
      const block = slot.classes[currentDayIndex];
      if (!block) continue;
      const start = parseTimeToMinutes(slot.time);
      if (
        currentMinutes >= start &&
        currentMinutes < start + CLASS_DURATION_MINUTES
      ) {
        current = {
          dayIndex: currentDayIndex,
          time: slot.time,
          subject: block.subject,
          room: block.room,
        };
        break;
      }
    }
  }

  const occurrences: ScheduleOccurrence[] = [];
  for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
    for (const slot of timeSlots) {
      const block = slot.classes[dayIndex];
      if (block) {
        occurrences.push({
          dayIndex,
          time: slot.time,
          subject: block.subject,
          room: block.room,
        });
      }
    }
  }
  occurrences.sort(
    (a, b) =>
      a.dayIndex * MINUTES_PER_DAY +
      parseTimeToMinutes(a.time) -
      (b.dayIndex * MINUTES_PER_DAY + parseTimeToMinutes(b.time)),
  );

  // Fin de semana (sábado o domingo): el horario es recurrente semana a
  // semana, así que ninguna clase de la próxima semana ha "pasado" todavía
  // — se trata igual que "antes de la primera clase de la semana".
  const nowWeekMinutes = currentDayIndex >= 0
    ? currentDayIndex * MINUTES_PER_DAY + currentMinutes
    : -1;

  const cutoff = current
    ? current.dayIndex * MINUTES_PER_DAY +
      parseTimeToMinutes(current.time) +
      CLASS_DURATION_MINUTES
    : nowWeekMinutes;

  const next =
    occurrences.find(
      (occ) =>
        occ.dayIndex * MINUTES_PER_DAY + parseTimeToMinutes(occ.time) >=
        cutoff,
    ) ??
    occurrences[0] ??
    null;

  return { current, next, nowWeekMinutes };
}
