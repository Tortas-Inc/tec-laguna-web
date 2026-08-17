"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { WeekGridRow } from "./useHorario";
import { isPastOccurrence, ScheduleStatus } from "./scheduleStatus";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const DAYS_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const EASE = [0.16, 1, 0.3, 1] as const;
const STAGGER_STEP = 0.03;
const STAGGER_MAX = 0.4;

type BlockState = "current" | "next" | "past" | "default";

function staggerDelay(index: number) {
  return Math.min(index * STAGGER_STEP, STAGGER_MAX);
}

export function WeekGrid({
  timeSlots,
  emptyTitle = "Todavía no tienes materias registradas",
  emptyDescription = "Cuando el portal escolar tenga tu carga académica, tu horario semanal aparecerá aquí.",
  onRemoveBlock,
  status,
}: {
  timeSlots: WeekGridRow[];
  emptyTitle?: string;
  emptyDescription?: string;
  onRemoveBlock?: (grupo: string) => void;
  status?: ScheduleStatus | null;
}) {
  const anchor = status?.current ?? status?.next ?? null;
  const anchorKey = anchor ? `${anchor.dayIndex}-${anchor.time}` : null;
  const anchorRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (hasScrolledRef.current || !anchorKey || !anchorRef.current) return;
    hasScrolledRef.current = true;
    anchorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [anchorKey]);

  if (timeSlots.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  function getBlockState(dayIndex: number, time: string): BlockState {
    if (status?.current?.dayIndex === dayIndex && status.current.time === time) {
      return "current";
    }
    if (status?.next?.dayIndex === dayIndex && status.next.time === time) {
      return "next";
    }
    if (status && isPastOccurrence(dayIndex, time, status.nowWeekMinutes)) {
      return "past";
    }
    return "default";
  }

  let mobileIndex = 0;
  let desktopIndex = 0;

  return (
    <>
      {/* Mobile: lista por día */}
      <div className="flex flex-col gap-4 sm:hidden">
        {DAYS_FULL.map((dayLabel, dayIndex) => {
          const classesForDay = timeSlots.filter(
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
                    const delay = staggerDelay(mobileIndex++);
                    const state = getBlockState(dayIndex, time);
                    const isLight = state === "current";
                    const isAnchor = `${dayIndex}-${time}` === anchorKey;
                    return (
                      <motion.div
                        key={time}
                        ref={isAnchor ? anchorRef : undefined}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{
                          opacity: state === "past" ? 0.45 : 1,
                          x: 0,
                        }}
                        transition={{ duration: 0.25, delay, ease: EASE }}
                        className={`flex items-center gap-3 rounded-lg border-l-[3px] px-3.5 py-2.5 ${
                          state === "current"
                            ? "border-brand-primary-dark bg-brand-primary text-white motion-safe:animate-[pulse-primary_2s_ease-in-out_infinite]"
                            : state === "next"
                              ? "border-dashed border-brand-primary-dark/60 bg-brand-primary-tint"
                              : "border-brand-primary bg-brand-primary-tint"
                        }`}
                      >
                        {state === "current" || state === "next" ? (
                          <span
                            className={`flex-none rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                              isLight
                                ? "bg-white/25 text-white"
                                : "bg-surface text-brand-primary-dark ring-1 ring-brand-primary-dark/40"
                            }`}
                          >
                            {state === "current" ? "Ahora" : "Próxima"}
                          </span>
                        ) : null}
                        <span
                          className={`text-sm font-semibold ${isLight ? "text-white" : "text-brand-primary-dark"}`}
                        >
                          {time}
                        </span>
                        <span
                          className={`h-1 w-1 flex-none rounded-full ${isLight ? "bg-white/40" : "bg-brand-primary-dark/40"}`}
                        />
                        <span
                          className={`text-sm font-bold ${isLight ? "text-white" : "text-brand-primary-dark"}`}
                        >
                          {block.subject}
                        </span>
                        <span
                          className={`ml-auto text-xs opacity-85 ${isLight ? "text-white" : "text-brand-primary-dark"}`}
                        >
                          {block.room}
                        </span>
                        {onRemoveBlock ? (
                          <button
                            type="button"
                            onClick={() => onRemoveBlock(block.grupo)}
                            aria-label={`Quitar ${block.subject}`}
                            className={`flex-none ${isLight ? "text-white/70 hover:text-white" : "text-brand-primary-dark/60 hover:text-brand-primary-dark"}`}
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        ) : null}
                      </motion.div>
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

          {timeSlots.map(({ time, classes }) => (
            <div className="contents" key={time}>
              <div className="min-h-[76px] border-b border-r border-brand-gray-lighter bg-surface-subtle p-2 pt-3 text-right text-sm text-brand-gray-light">
                {time}
              </div>
              {classes.map((block, dayIndex) => {
                const delay = block ? staggerDelay(desktopIndex++) : 0;
                const state = block ? getBlockState(dayIndex, time) : "default";
                const isLight = state === "current";
                return (
                  <div
                    key={dayIndex}
                    className="min-h-[76px] border-b border-r border-brand-gray-lighter p-2 text-sm last:border-r-0"
                  >
                    {block ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: state === "past" ? 0.45 : 1,
                          scale: 1,
                        }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        transition={{
                          default: { duration: 0.15, ease: EASE },
                          opacity: { duration: 0.2, delay, ease: EASE },
                        }}
                        className={`group relative flex h-full flex-col justify-center rounded-md border-l-[3px] px-2 py-1.5 text-sm font-bold leading-tight ${
                          state === "current"
                            ? "border-brand-primary-dark bg-brand-primary text-white motion-safe:animate-[pulse-primary_2s_ease-in-out_infinite]"
                            : state === "next"
                              ? "border-dashed border-brand-primary-dark/60 bg-brand-primary-tint text-brand-primary-dark"
                              : "border-brand-primary bg-brand-primary-tint text-brand-primary-dark"
                        }`}
                      >
                        {state === "current" || state === "next" ? (
                          <span
                            className={`absolute -top-2 left-1.5 rounded-full px-1.5 py-0.25 text-[8px] font-bold ${
                              isLight
                                ? "bg-brand-primary-dark text-white"
                                : "bg-surface text-brand-primary-dark ring-1 ring-brand-primary-dark/40"
                            }`}
                          >
                            {state === "current" ? "Ahora" : "Próxima"}
                          </span>
                        ) : null}
                        {onRemoveBlock ? (
                          <button
                            type="button"
                            onClick={() => onRemoveBlock(block.grupo)}
                            aria-label={`Quitar ${block.subject}`}
                            className="absolute right-1 top-1 hidden rounded-full bg-white/70 p-0.5 text-brand-primary-dark hover:bg-white group-hover:block"
                          >
                            <X className="h-3 w-3" strokeWidth={2.4} />
                          </button>
                        ) : null}
                        <div className="line-clamp-2">{block.subject}</div>
                        <div
                          className={`truncate text-xs font-normal opacity-85 ${isLight ? "text-white" : ""}`}
                        >
                          {block.room}
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
