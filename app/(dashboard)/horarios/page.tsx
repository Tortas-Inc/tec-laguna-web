"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Eye,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { QueryError } from "@/components/QueryError";
import { Snackbar, SnackbarVariant } from "@/components/Snackbar";
import { useKardex } from "@/features/kardex/useKardex";
import {
  MateriaHorarioCarrera,
  useHorariosCarrera,
} from "@/features/horarios/useHorariosCarrera";
import {
  MateriaDetail,
  MateriaDetailDrawer,
} from "@/features/horarios/MateriaDetailDrawer";
import { getSemestre, sortSemesters } from "@/features/horarios/schedule";
import { SchedulePreviewModal } from "@/features/horarios/SchedulePreviewModal";
import {
  ADD_RESULT_MESSAGE,
  useSimulatedSchedule,
} from "@/features/horarios/useSimulatedSchedule";

const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const CLASS_FILTERS = [
  { value: "all", label: "Todas" },
  { value: "cursadas", label: "Cursadas" },
  { value: "pendientes", label: "Pendientes" },
] as const;
type ClassFilterValue = (typeof CLASS_FILTERS)[number]["value"];

function toMateriaDetail(m: MateriaHorarioCarrera): MateriaDetail {
  const values = [m.lunes, m.martes, m.miercoles, m.jueves, m.viernes];
  return {
    badge: m.grupo,
    name: m.materia,
    weekly: DAY_LABELS.map((day, i) => ({ day, value: values[i] || "—" })),
  };
}

function scheduleLabel(m: MateriaHorarioCarrera): string {
  const value = [m.lunes, m.martes, m.miercoles, m.jueves, m.viernes].find(
    (v) => v,
  );
  if (!value) return "Sin horario";
  const match = value.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})\/(.+)$/);
  return match ? `${match[1]}–${match[2]} / ${match[3]}` : value;
}

function matchesQuery(m: MateriaHorarioCarrera, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    m.materia.toLowerCase().includes(q) ||
    m.grupo.toLowerCase().includes(q) ||
    m.profesor.toLowerCase().includes(q)
  );
}

export default function HorariosPorCarreraPage() {
  const kardex = useKardex();
  const especialidad = kardex.data?.carreraCode ?? null;
  const horarios = useHorariosCarrera(especialidad);
  const simulated = useSimulatedSchedule();

  const [selected, setSelected] = useState<MateriaHorarioCarrera | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [conflicting, setConflicting] =
    useState<MateriaHorarioCarrera | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackVariant, setFeedbackVariant] =
    useState<SnackbarVariant>("success");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<ClassFilterValue>("all");
  const [semestre, setSemestre] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!filterRef.current?.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // El filtro Cursadas/Pendientes se aplica primero: los chips de semestre
  // solo muestran los semestres que realmente tienen materias visibles con
  // el filtro activo.
  const classFiltered = useMemo(() => {
    if (!horarios.data) return [];
    return horarios.data.filter((m) => {
      if (classFilter === "cursadas") return m.isFinished;
      if (classFilter === "pendientes") return !m.isFinished;
      return true;
    });
  }, [horarios.data, classFilter]);

  const semesters = useMemo(() => {
    const unique = new Set(
      classFiltered.map((m) => getSemestre(m.grupo)).filter(Boolean),
    );
    return sortSemesters(Array.from(unique));
  }, [classFiltered]);

  // Si el semestre seleccionado ya no aplica con el filtro Cursadas/
  // Pendientes activo (p. ej. no quedan pendientes de ese semestre), se
  // trata como "Todas" en vez de mostrar una lista vacía silenciosa.
  const effectiveSemestre = semestre && semesters.includes(semestre)
    ? semestre
    : "";

  const filteredMaterias = useMemo(() => {
    const filtered = classFiltered.filter((m) => {
      if (effectiveSemestre && getSemestre(m.grupo) !== effectiveSemestre) {
        return false;
      }
      return matchesQuery(m, query);
    });
    // Las materias pendientes van primero — son las que el alumno puede
    // agregar a su lista guía; las ya cursadas quedan al final, como
    // referencia, sin competir por atención.
    return [...filtered].sort(
      (a, b) => Number(a.isFinished) - Number(b.isFinished),
    );
  }, [classFiltered, effectiveSemestre, query]);

  function showFeedback(message: string, variant: SnackbarVariant) {
    setFeedback(message);
    setFeedbackVariant(variant);
  }

  function handleAction() {
    if (!selected) return;
    if (simulated.isAdded(selected)) {
      simulated.remove(selected.grupo);
      showFeedback("Quitada de tu lista", "success");
      setSelected(null);
      return;
    }
    const result = simulated.add(selected);
    if (result.ok) {
      showFeedback("¡Materia agregada!", "success");
      setSelected(null);
    } else if (result.reason === "duplicate") {
      // Duplicado/choque de horario: se muestra dentro del drawer (no en
      // el snackbar) porque ahí es donde está la atención del usuario.
      setActionError(ADD_RESULT_MESSAGE.duplicate);
      setConflicting(null);
    } else {
      setActionError(ADD_RESULT_MESSAGE.conflict(result.conflicting.materia));
      setConflicting(result.conflicting);
    }
  }

  function handleReplace() {
    if (!selected || !conflicting) return;
    simulated.replace(conflicting, selected);
    showFeedback("¡Materia reemplazada!", "success");
    setSelected(null);
    setActionError(null);
    setConflicting(null);
  }

  function handleSelect(subject: MateriaHorarioCarrera) {
    setActionError(null);
    setConflicting(null);
    setSelected(subject);
  }

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const activeFilterLabel = CLASS_FILTERS.find(
    (f) => f.value === classFilter,
  )!.label;

  return (
    <>
      <PageHeader
        title="Horarios"
        subtitle={kardex.data?.carrera ?? "Horarios por carrera"}
      />

      <AnimatePresence>
        {simulated.materias.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-xl border border-brand-primary/[0.08] bg-brand-gray-lighter shadow-[0_1px_2px_rgba(20,14,6,0.04)]"
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-brand-primary/[0.08] p-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-primary text-white">
                <ClipboardList className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="text-sm font-bold text-brand-black">
                Tu lista guía{" "}
                <span className="font-normal text-brand-gray">
                  · {simulated.materias.length}{" "}
                  {simulated.materias.length === 1 ? "materia" : "materias"}
                </span>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setPreviewOpen(true)}
                className="ml-auto flex flex-none items-center gap-1.5 rounded-lg bg-brand-primary px-2.5 py-1.5 text-xs font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.1]"
              >
                <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                Vista previa
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3">
              <AnimatePresence>
                {simulated.materias.map((m) => (
                  <motion.span
                    key={m.grupo}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-brand-primary-dark"
                  >
                    {m.materia}
                    <button
                      type="button"
                      onClick={() => simulated.remove(m.grupo)}
                      aria-label={`Quitar ${m.materia}`}
                      className="text-brand-gray-light hover:text-brand-primary-dark"
                    >
                      <X className="h-3 w-3" strokeWidth={2} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-4.5 flex flex-col gap-2.5 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-[10px] bg-brand-gray-lighter px-3.5 py-2.5 text-sm text-brand-gray-light transition-shadow duration-150 focus-within:ring-2 focus-within:ring-brand-primary/40 sm:max-w-80">
          <Search className="h-[18px] w-[18px] flex-none" strokeWidth={1.7} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar materia..."
            className="w-full bg-transparent text-brand-black outline-none placeholder:text-brand-gray-light"
          />
        </div>

        <div ref={filterRef} className="relative">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setFilterOpen((v) => !v)}
            className="flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-brand-gray-lighter px-3.5 py-2.25 text-sm font-semibold text-brand-black sm:w-auto"
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={1.7} />
            {activeFilterLabel}
            <motion.span
              animate={{ rotate: filterOpen ? 180 : 0 }}
              transition={{ duration: 0.18 }}
            >
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {filterOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-10 mt-1.5 w-40 overflow-hidden rounded-[10px] border border-brand-gray-lighter bg-surface shadow-[0_10px_24px_-8px_rgba(20,14,6,0.18)]"
              >
                {CLASS_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => {
                      setClassFilter(f.value);
                      setFilterOpen(false);
                    }}
                    className={`block w-full px-3.5 py-2.5 text-left text-sm font-semibold transition-colors duration-150 hover:bg-brand-primary-tint ${
                      classFilter === f.value
                        ? "text-brand-primary-dark"
                        : "text-brand-black"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {semesters.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            onClick={() => setSemestre("")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-150 ${
              effectiveSemestre === ""
                ? "bg-brand-primary text-white"
                : "bg-brand-gray-lighter text-brand-gray hover:bg-brand-primary-tint hover:text-brand-primary-dark"
            }`}
          >
            Todas
          </motion.button>
          <AnimatePresence>
            {semesters.map((s) => (
              <motion.button
                key={s}
                type="button"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSemestre(s)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-150 ${
                  effectiveSemestre === s
                    ? "bg-brand-primary text-white"
                    : "bg-brand-gray-lighter text-brand-gray hover:bg-brand-primary-tint hover:text-brand-primary-dark"
                }`}
              >
                {s === "Especialidad" ? s : `Semestre ${s}`}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      ) : null}

      {kardex.isError ? <QueryError message={kardex.error.message} /> : null}
      {horarios.isLoading || kardex.isLoading ? (
        <p className="text-sm text-brand-gray">Cargando…</p>
      ) : null}
      {horarios.isError ? (
        <QueryError message={horarios.error.message} />
      ) : null}

      {horarios.data ? (
        filteredMaterias.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No encontramos materias"
            description="Prueba con otro semestre o ajusta los filtros de búsqueda."
          />
        ) : (
          <motion.div
            key={`${classFilter}-${effectiveSemestre}-${query}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredMaterias.map((subject, index) => {
              const cardClass = `relative rounded-xl p-4 text-left ${
                subject.isFinished
                  ? "cursor-default bg-brand-green-tint"
                  : "cursor-pointer bg-brand-primary-tint transition-shadow duration-200 ease-out hover:shadow-[0_14px_26px_-12px_rgba(20,14,6,0.22)]"
              }`;
              const content = (
                <>
                  {subject.isFinished ? (
                    <CheckCircle2
                      className="absolute right-3.5 top-3.5 h-[18px] w-[18px] text-brand-green"
                      strokeWidth={1.7}
                    />
                  ) : simulated.isAdded(subject) ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="absolute right-3.5 top-3.5 rounded-full bg-brand-primary-dark px-2 py-0.5 text-[9px] font-bold text-white"
                    >
                      En tu lista
                    </motion.span>
                  ) : null}
                  <span
                    className={`inline-block rounded-full px-2 py-0.75 text-[11px] font-bold text-white ${
                      subject.isFinished
                        ? "bg-brand-green"
                        : "bg-brand-primary-dark"
                    }`}
                  >
                    {subject.grupo}
                  </span>
                  <div
                    className={`mt-2 text-base font-bold ${
                      subject.isFinished
                        ? "text-brand-green"
                        : "text-brand-primary-dark"
                    }`}
                  >
                    {subject.materia}
                  </div>
                  <div
                    className={`mt-0.75 text-[13px] ${
                      subject.isFinished
                        ? "text-brand-green"
                        : "text-brand-primary-dark"
                    }`}
                  >
                    {subject.profesor}
                  </div>
                  <div
                    className={`mt-2 flex items-center gap-1 ${
                      subject.isFinished
                        ? "text-brand-green"
                        : "text-brand-primary-dark"
                    }`}
                  >
                    <CalendarDays className="h-3 w-3" strokeWidth={1.7} />
                    <span className="text-xs font-bold">
                      {scheduleLabel(subject)}
                    </span>
                  </div>
                </>
              );

              const motionProps = {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: subject.isFinished ? 0.65 : 1, y: 0 },
                transition: {
                  duration: 0.2,
                  delay: Math.min(index * 0.025, 0.3),
                  ease: [0.16, 1, 0.3, 1] as const,
                },
              };

              if (subject.isFinished) {
                return (
                  <motion.div
                    key={subject.grupo}
                    {...motionProps}
                    className={cardClass}
                    aria-disabled="true"
                  >
                    {content}
                  </motion.div>
                );
              }

              return (
                <motion.button
                  key={subject.grupo}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(subject)}
                  className={cardClass}
                  {...motionProps}
                >
                  {content}
                </motion.button>
              );
            })}
          </motion.div>
        )
      ) : null}

      <MateriaDetailDrawer
        materia={selected ? toMateriaDetail(selected) : null}
        onClose={() => {
          setSelected(null);
          setActionError(null);
          setConflicting(null);
        }}
        actionLabel={
          selected
            ? simulated.isAdded(selected)
              ? "Quitar de mi lista"
              : "Agregar a mi lista"
            : undefined
        }
        actionVariant={
          selected && simulated.isAdded(selected) ? "remove" : "add"
        }
        onAction={handleAction}
        actionError={actionError}
        onReplace={conflicting ? handleReplace : undefined}
        disclaimer="Da clic para agregarla a tu lista guía del próximo semestre — no es tu inscripción oficial."
      />

      <SchedulePreviewModal
        open={previewOpen}
        materias={simulated.materias}
        onClose={() => setPreviewOpen(false)}
        onRemoveGrupo={simulated.remove}
      />

      <Snackbar message={feedback} variant={feedbackVariant} />
    </>
  );
}
