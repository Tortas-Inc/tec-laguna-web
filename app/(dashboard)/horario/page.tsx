import { CalendarX } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const DAYS_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

type ClassBlock = { subject: string; room: string } | null;

const TIME_SLOTS: { time: string; classes: ClassBlock[] }[] = [
  {
    time: "08:00",
    classes: [null, null, null, { subject: "Ing. Software", room: "08A" }, null],
  },
  {
    time: "10:00",
    classes: [null, { subject: "Bases de Datos II", room: "12B" }, null, null, null],
  },
  {
    time: "15:00",
    classes: [
      null,
      { subject: "Desarrollo Android", room: "19K" },
      null,
      null,
      null,
    ],
  },
];

export default function HorarioPage() {
  const hasAnyClass = TIME_SLOTS.some(({ classes }) =>
    classes.some((c) => c !== null),
  );

  return (
    <>
      <PageHeader title="Tu horario" subtitle="Bienvenido" />

      {!hasAnyClass ? (
        <EmptyState
          icon={CalendarX}
          title="Todavía no tienes materias registradas"
          description="Cuando el portal escolar tenga tu carga académica, tu horario semanal aparecerá aquí."
        />
      ) : (
        <>
      {/* Mobile: lista por día */}
      <div className="flex flex-col gap-4 sm:hidden">
        {DAYS_FULL.map((dayLabel, dayIndex) => {
          const classesForDay = TIME_SLOTS.filter(
            ({ classes }) => classes[dayIndex] !== null,
          );
          return (
            <div key={dayLabel}>
              <div className="mb-2 text-sm font-bold text-brand-gray">
                {dayLabel}
              </div>
              {classesForDay.length === 0 ? (
                <div className="rounded-lg bg-brand-gray-lighter px-3.5 py-3 text-sm text-brand-gray-light">
                  Sin clases
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {classesForDay.map(({ time, classes }) => {
                    const block = classes[dayIndex]!;
                    return (
                      <div
                        key={time}
                        className="flex items-center gap-3 rounded-lg border-l-[3px] border-brand-primary bg-brand-primary-tint px-3.5 py-2.5"
                      >
                        <span className="text-sm font-semibold text-brand-primary-dark">
                          {time}
                        </span>
                        <span className="h-1 w-1 flex-none rounded-full bg-brand-primary-dark/40" />
                        <span className="text-sm font-bold text-brand-primary-dark">
                          {block.subject}
                        </span>
                        <span className="ml-auto text-xs text-brand-primary-dark opacity-85">
                          {block.room}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tablet/desktop: grid semanal */}
      <div className="hidden overflow-x-auto rounded-xl border border-brand-gray-lighter sm:block">
        <div className="grid min-w-[620px] grid-cols-[72px_repeat(5,1fr)] overflow-hidden">
          <div className="border-b border-r border-brand-gray-lighter bg-brand-gray-lighter" />
          {DAYS.map((day) => (
            <div
              key={day}
              className="border-b border-r border-brand-gray-lighter bg-brand-gray-lighter py-3 text-center text-base font-bold text-brand-gray last:border-r-0"
            >
              {day}
            </div>
          ))}

          {TIME_SLOTS.map(({ time, classes }) => (
            <div className="contents" key={time}>
              <div className="min-h-[76px] border-b border-r border-brand-gray-lighter bg-[#FCFCFC] p-2 pt-3 text-right text-sm text-brand-gray-light">
                {time}
              </div>
              {classes.map((block, i) => (
                <div
                  key={i}
                  className="min-h-[76px] border-b border-r border-brand-gray-lighter p-2 text-sm last:border-r-0"
                >
                  {block ? (
                    <div className="rounded-md border-l-[3px] border-brand-primary bg-brand-primary-tint px-2 py-1.5 text-sm font-bold leading-tight text-brand-primary-dark transition-transform duration-200 ease-out motion-safe:hover:scale-[1.03] motion-safe:hover:-translate-y-0.5">
                      {block.subject}
                      <div className="text-xs font-normal opacity-85">
                        {block.room}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </>
  );
}
