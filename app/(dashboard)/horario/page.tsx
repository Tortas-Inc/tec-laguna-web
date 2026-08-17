"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { QueryError } from "@/components/QueryError";
import { buildWeekGrid, useHorario } from "@/features/horario/useHorario";
import { useScheduleStatus } from "@/features/horario/useScheduleStatus";
import { WeekGrid } from "@/features/horario/WeekGrid";
import { useSessionExpiredRedirect } from "@/hooks/useSessionExpiredRedirect";

export default function HorarioPage() {
  const { data, isLoading, isError, error, dataUpdatedAt } = useHorario();
  const { suppressError } = useSessionExpiredRedirect({
    isError,
    error,
    dataUpdatedAt,
  });
  const timeSlots = useMemo(
    () => (data ? buildWeekGrid(data.materias) : []),
    [data],
  );
  const status = useScheduleStatus(timeSlots);

  return (
    <>
      <PageHeader
        title="Tu horario"
        subtitle={data ? `Bienvenido, ${data.studentName}` : "Bienvenido"}
      />

      {isLoading ? (
        <p className="text-sm text-brand-gray">Cargando…</p>
      ) : null}
      {isError && !suppressError ? (
        <QueryError message={error.message} />
      ) : null}

      {data ? <WeekGrid timeSlots={timeSlots} status={status} /> : null}
    </>
  );
}
