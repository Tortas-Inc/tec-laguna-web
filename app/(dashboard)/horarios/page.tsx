"use client";

import { CalendarDays, CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  MateriaDetail,
  MateriaDetailDrawer,
} from "@/features/horarios/MateriaDetailDrawer";

const SEMESTERS = ["Semestre 3", "Semestre 4", "Semestre 5", "Especialidad"];

const SUBJECTS: (MateriaDetail & {
  prof: string;
  schedule: string;
  done: boolean;
})[] = [
  {
    badge: "C16B",
    name: "Desarrollo en Android",
    prof: "Gil Vázquez Luis Fernando",
    schedule: "15:00–16:00 / 19K",
    done: false,
    weekly: [
      { day: "Lunes", value: "15:00–16:00 / 19K" },
      { day: "Martes", value: "—" },
      { day: "Miércoles", value: "15:00–16:00 / 19K" },
      { day: "Jueves", value: "—" },
      { day: "Viernes", value: "—" },
    ],
  },
  {
    badge: "C11A",
    name: "Bases de Datos II",
    prof: "Martínez Soto Elena",
    schedule: "10:00–11:00 / 12B",
    done: true,
    weekly: [
      { day: "Lunes", value: "—" },
      { day: "Martes", value: "10:00–11:00 / 12B" },
      { day: "Miércoles", value: "—" },
      { day: "Jueves", value: "10:00–11:00 / 12B" },
      { day: "Viernes", value: "—" },
    ],
  },
  {
    badge: "C09C",
    name: "Ingeniería de Software",
    prof: "Ramírez Castro Jorge",
    schedule: "08:00–09:00 / 08A",
    done: false,
    weekly: [
      { day: "Lunes", value: "08:00–09:00 / 08A" },
      { day: "Martes", value: "08:00–09:00 / 08A" },
      { day: "Miércoles", value: "—" },
      { day: "Jueves", value: "—" },
      { day: "Viernes", value: "—" },
    ],
  },
  {
    badge: "C14A",
    name: "Cálculo Diferencial",
    prof: "Ramírez Castro Jorge",
    schedule: "09:00–10:00 / 05C",
    done: false,
    weekly: [
      { day: "Lunes", value: "—" },
      { day: "Martes", value: "—" },
      { day: "Miércoles", value: "09:00–10:00 / 05C" },
      { day: "Jueves", value: "—" },
      { day: "Viernes", value: "09:00–10:00 / 05C" },
    ],
  },
  {
    badge: "C11",
    name: "Taller de Ética",
    prof: "Martínez Soto Elena",
    schedule: "11:00–12:00 / 03A",
    done: true,
    weekly: [
      { day: "Lunes", value: "11:00–12:00 / 03A" },
      { day: "Martes", value: "—" },
      { day: "Miércoles", value: "—" },
      { day: "Jueves", value: "—" },
      { day: "Viernes", value: "—" },
    ],
  },
  {
    badge: "C18B",
    name: "Redes de Computadoras",
    prof: "Gil Vázquez Luis Fernando",
    schedule: "13:00–14:00 / 20L",
    done: false,
    weekly: [
      { day: "Lunes", value: "—" },
      { day: "Martes", value: "13:00–14:00 / 20L" },
      { day: "Miércoles", value: "—" },
      { day: "Jueves", value: "13:00–14:00 / 20L" },
      { day: "Viernes", value: "—" },
    ],
  },
];

export default function HorariosPorCarreraPage() {
  const [selected, setSelected] = useState<MateriaDetail | null>(null);

  return (
    <>
      <PageHeader
        title="Horarios"
        subtitle="Ingeniería en Sistemas Computacionales"
      />

      <div className="mb-4.5 flex flex-col gap-2.5 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-[10px] bg-brand-gray-lighter px-3.5 py-2.5 text-sm text-brand-gray-light sm:max-w-80">
          <Search className="h-[18px] w-[18px] flex-none" strokeWidth={1.7} />
          Buscar materia...
        </div>
        <div className="flex items-center justify-center gap-1.5 rounded-[10px] border border-brand-gray-lighter px-3.5 py-2.25 text-sm font-semibold text-brand-black">
          <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={1.7} />
          Filtros
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {SEMESTERS.map((label, i) => (
          <div
            key={label}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-150 ${
              i === 0
                ? "bg-brand-primary text-white"
                : "bg-brand-gray-lighter text-brand-gray hover:bg-brand-primary-tint hover:text-brand-primary-dark"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.badge}
            type="button"
            onClick={() => setSelected(subject)}
            className={`relative rounded-xl p-4 text-left transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.75 hover:shadow-[0_14px_26px_-12px_rgba(20,14,6,0.22)] ${
              subject.done ? "bg-brand-green-tint" : "bg-brand-primary-tint"
            }`}
          >
            {subject.done ? (
              <CheckCircle2
                className="absolute right-3.5 top-3.5 h-[18px] w-[18px] text-brand-green"
                strokeWidth={1.7}
              />
            ) : null}
            <span
              className={`inline-block rounded-full px-2 py-0.75 text-[11px] font-bold text-white ${
                subject.done ? "bg-brand-green" : "bg-brand-primary-dark"
              }`}
            >
              {subject.badge}
            </span>
            <div
              className={`mt-2 text-base font-bold ${
                subject.done ? "text-brand-green" : "text-brand-primary-dark"
              }`}
            >
              {subject.name}
            </div>
            <div
              className={`mt-0.75 text-[13px] ${
                subject.done ? "text-brand-green" : "text-brand-primary-dark"
              }`}
            >
              {subject.prof}
            </div>
            <div
              className={`mt-2 flex items-center gap-1 ${
                subject.done ? "text-brand-green" : "text-brand-primary-dark"
              }`}
            >
              <CalendarDays className="h-3 w-3" strokeWidth={1.7} />
              <span className="text-xs font-bold">{subject.schedule}</span>
            </div>
          </button>
        ))}
      </div>

      <MateriaDetailDrawer materia={selected} onClose={() => setSelected(null)} />
    </>
  );
}
