"use client";

import { useEffect, useState } from "react";
import { computeScheduleStatus, ScheduleStatus } from "./scheduleStatus";
import { WeekGridRow } from "./useHorario";

const REFRESH_MS = 60_000;

// null en el primer render (server y cliente coinciden) — se calcula
// después de montar para no depender de la hora del servidor.
export function useScheduleStatus(
  timeSlots: WeekGridRow[],
): ScheduleStatus | null {
  const [status, setStatus] = useState<ScheduleStatus | null>(null);

  useEffect(() => {
    function update() {
      setStatus(computeScheduleStatus(timeSlots, new Date()));
    }
    update();
    const interval = setInterval(update, REFRESH_MS);
    return () => clearInterval(interval);
  }, [timeSlots]);

  return status;
}
