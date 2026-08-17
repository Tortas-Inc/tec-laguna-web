"use client";

import {
  Check,
  ChevronDown,
  Clock,
  Eye,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmModal } from "@/components/ConfirmModal";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { PageHeader } from "@/components/PageHeader";
import { QueryError } from "@/components/QueryError";
import { Snackbar, SnackbarVariant } from "@/components/Snackbar";
import { GUEST_MODE_KEY, MANUAL_CARRERA_KEY } from "@/lib/guestMode";
import { useKardex } from "@/features/kardex/useKardex";
import {
  MateriaHorarioCarrera,
  useHorariosCarrera,
} from "@/features/horarios/useHorariosCarrera";
import { CARRERAS } from "@/features/horarios/carreras";
import { getSemestre, sortSemesters, startHour } from "@/features/horarios/schedule";
import { SchedulePreviewModal } from "@/features/horarios/SchedulePreviewModal";
import {
  ADD_RESULT_MESSAGE,
  useSimulatedSchedule,
} from "@/features/horarios/useSimulatedSchedule";

const STATUS_FILTERS = [
  { value: "all", label: "Todas" },
  { value: "added", label: "En tu horario" },
  { value: "available", label: "Disponibles" },
] as const;
type StatusFilterValue = (typeof STATUS_FILTERS)[number]["value"];

// Las clases siempre empiezan en punto, así que alcanza con elegir hora
// entera — cubre el rango real observado en el portal (07:00 a 20:00).
const HOUR_OPTIONS = Array.from({ length: 14 }, (_, i) =>
  String(i + 7).padStart(2, "0"),
);

function startHourNumber(subject: MateriaHorarioCarrera): number | null {
  const time = startHour(subject);
  return time ? Number(time.slice(0, 2)) : null;
}

function scheduleLabel(m: MateriaHorarioCarrera): string {
  const value = [m.lunes, m.martes, m.miercoles, m.jueves, m.viernes].find(
    (v) => v,
  );
  if (!value) return "Sin horario";
  const match = value.match(/^(\d{2}:\d{2})-(\d{2}:\d{2})\/(.+)$/);
  return match ? `${match[1]}–${match[2]} / ${match[3]}` : value;
}

// Electivas/Residencia/Tutoría se muestran tal cual; los semestres
// numéricos (1..8) llevan el prefijo "Semestre".
function semestreLabel(value: string): string {
  return /^\d+$/.test(value) ? `Semestre ${value}` : value;
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

export default function SimuladorHorarioPage() {
  const [manualCarrera, setManualCarrera] = useState("");
  const [guestMode, setGuestMode] = useState(false);
  // El cache de queries persiste en localStorage (ver app/providers.tsx) y
  // se restaura después de montar, así que kardex.isLoading puede diferir
  // entre el primer render del servidor y el del cliente — se espera a
  // montar antes de decidir qué mostrar, para no romper la hidratación.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // La carrera elegida como invitado también se guarda — si no, aunque
    // el catálogo ya esté cacheado 24h, cada recarga volvería a mostrar
    // el selector y habría que elegirla de nuevo.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura única de localStorage al montar, no hay forma de derivarlo en el render (evita mismatch de hidratación con el cache persistido)
    setManualCarrera(
      window.localStorage.getItem(MANUAL_CARRERA_KEY) ?? "",
    );
    setGuestMode(window.localStorage.getItem(GUEST_MODE_KEY) === "true");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (manualCarrera) {
      window.localStorage.setItem(MANUAL_CARRERA_KEY, manualCarrera);
    } else {
      window.localStorage.removeItem(MANUAL_CARRERA_KEY);
    }
  }, [manualCarrera, mounted]);

  // Un invitado (botón "Continuar como invitado" en /login) por
  // definición no tiene sesión — ni vale la pena consultar Kardex.
  const kardex = useKardex({ enabled: !guestMode });

  // Sin sesión, kardex.data nunca llega — se le pregunta la carrera a mano
  // (modo invitado, ver botón "Continuar como invitado" en /login).
  const especialidad = kardex.data?.carreraCode ?? manualCarrera ?? null;
  // Mientras no sepamos si hay sesión o no, no mostramos ni el simulador
  // ni el selector — evita un parpadeo del panel completo antes de saber
  // si hace falta preguntar la carrera.
  const checkingSession = !mounted || (kardex.isLoading && !manualCarrera);
  const needsCarreraPicker =
    !checkingSession && !kardex.data && !manualCarrera;
  const isGuest = !kardex.data;
  const horarios = useHorariosCarrera(especialidad);
  const saved = useSimulatedSchedule();
  const savedClear = saved.clear;
  const savedCarreraCode = saved.carreraCode;

  // El horario simulado puede venir de una sesión de invitado anterior en
  // este navegador — si el usuario ahora inició sesión de verdad y su
  // carrera real no coincide con la de ese horario, ya no aplica.
  useEffect(() => {
    if (!especialidad || !savedCarreraCode) return;
    if (savedCarreraCode !== especialidad) savedClear();
  }, [especialidad, savedCarreraCode, savedClear]);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackVariant, setFeedbackVariant] =
    useState<SnackbarVariant>("success");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [semestreFilter, setSemestreFilter] = useState("all");
  const [horaDesde, setHoraDesde] = useState("");
  const [horaHasta, setHoraHasta] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [horaOpen, setHoraOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [changeCarreraConfirmOpen, setChangeCarreraConfirmOpen] =
    useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const horaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!filterRef.current?.contains(event.target as Node)) {
        setFilterOpen(false);
      }
      if (!horaRef.current?.contains(event.target as Node)) {
        setHoraOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Ya no se muestran las materias cursadas en el catálogo — para eso está
  // Kardex, en el menú.
  const pendientes = useMemo(
    () => (horarios.data ?? []).filter((m) => !m.isFinished),
    [horarios.data],
  );

  const { isAdded, materias: savedMaterias } = saved;
  const statusFiltered = useMemo(() => {
    return pendientes.filter((m) => {
      if (statusFilter === "added") return isAdded(m);
      if (statusFilter === "available") return !isAdded(m);
      return true;
    });
  }, [pendientes, statusFilter, isAdded]);

  // Semestres disponibles en la carrera actual (antes de aplicar el
  // propio filtro de semestre), para no ofrecer opciones vacías.
  const availableSemesters = useMemo(() => {
    const set = new Set(pendientes.map((m) => getSemestre(m)));
    return sortSemesters(Array.from(set));
  }, [pendientes]);

  // Degradados a los costados de los chips de semestre, para insinuar
  // que hay más opciones scrolleables — solo del lado que de verdad
  // tiene contenido oculto todavía.
  const semestreScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateSemestreScrollShadows = useCallback(() => {
    const el = semestreScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateSemestreScrollShadows();
    window.addEventListener("resize", updateSemestreScrollShadows);
    return () =>
      window.removeEventListener("resize", updateSemestreScrollShadows);
  }, [availableSemesters, updateSemestreScrollShadows]);

  const semestreFiltered = useMemo(() => {
    if (semestreFilter === "all") return statusFiltered;
    return statusFiltered.filter((m) => getSemestre(m) === semestreFilter);
  }, [statusFiltered, semestreFilter]);

  const horaFiltered = useMemo(() => {
    if (!horaDesde && !horaHasta) return semestreFiltered;
    return semestreFiltered.filter((m) => {
      const hour = startHourNumber(m);
      if (hour === null) return false;
      if (horaDesde && hour < Number(horaDesde)) return false;
      if (horaHasta && hour > Number(horaHasta)) return false;
      return true;
    });
  }, [semestreFiltered, horaDesde, horaHasta]);

  const filteredMaterias = useMemo(() => {
    return horaFiltered.filter((m) => matchesQuery(m, query));
  }, [horaFiltered, query]);

  // Estados de cada fila, compartidos entre la tabla (desktop) y las
  // cards (mobile) para no duplicar esta lógica en los dos layouts.
  const catalogRows = useMemo(() => {
    return filteredMaterias.map((subject) => {
      // "Seleccionada" = exactamente este grupo (clave+sección) ya está
      // en el horario activo — se marca en verde.
      // "Bloqueada" = la MISMA materia ya está cubierta por OTRO
      // profesor/sección — no tiene caso agregar dos secciones de la
      // misma materia, así que se deshabilita.
      const isSelected = savedMaterias.some((m) => m.grupo === subject.grupo);
      const isBlocked = !isSelected && isAdded(subject);
      // Choca en horario con algo que YA está en el horario activo
      // (misma hora de inicio) — se puede resolver con "Reemplazar" en
      // vez de bloquearla del todo.
      const timeConflict =
        !isSelected && !isBlocked
          ? savedMaterias.find((m) => startHour(m) === startHour(subject))
          : undefined;
      const days = [
        { label: "L", value: subject.lunes },
        { label: "M", value: subject.martes },
        { label: "I", value: subject.miercoles },
        { label: "J", value: subject.jueves },
        { label: "V", value: subject.viernes },
      ];
      return { subject, isSelected, isBlocked, timeConflict, days };
    });
  }, [filteredMaterias, savedMaterias, isAdded]);

  const activeStatusLabel = STATUS_FILTERS.find(
    (f) => f.value === statusFilter,
  )!.label;
  const activeHoraLabel =
    horaDesde || horaHasta
      ? `${horaDesde ? `${horaDesde}:00` : "…"}–${horaHasta ? `${horaHasta}:00` : "…"}`
      : "Horario";

  function showFeedback(message: string, variant: SnackbarVariant) {
    setFeedback(message);
    setFeedbackVariant(variant);
  }

  // Un solo toggle para agregar/quitar — clic en cualquier parte de la
  // fila o en el botón "+" que aparece al pasar el mouse, sin abrir nada
  // aparte (antes esto abría un drawer de detalle).
  function handleToggle(subject: MateriaHorarioCarrera) {
    if (saved.isAdded(subject)) {
      saved.remove(subject.grupo);
      showFeedback("Quitada de tu horario", "success");
      return;
    }
    const result = saved.add(subject, especialidad);
    if (result.ok) {
      showFeedback("¡Materia agregada!", "success");
    } else if (result.reason === "duplicate") {
      showFeedback(ADD_RESULT_MESSAGE.duplicate, "error");
    } else if (result.reason === "different-career") {
      showFeedback(ADD_RESULT_MESSAGE.differentCarrera, "error");
    } else {
      showFeedback(
        ADD_RESULT_MESSAGE.conflict(result.conflicting.materia),
        "error",
      );
    }
  }

  // Botón "Reemplazar" directo en la fila de la tabla.
  function handleQuickReplace(
    subject: MateriaHorarioCarrera,
    conflictingMateria: MateriaHorarioCarrera,
  ) {
    saved.replace(conflictingMateria, subject);
    showFeedback("¡Materia reemplazada!", "success");
  }

  function handleClearAll() {
    saved.clear();
    setClearConfirmOpen(false);
    setPreviewOpen(false);
    showFeedback("Horario vaciado", "success");
  }

  function handleChangeCarrera() {
    // El horario armado no tiene sentido para otra carrera (ya quedaría
    // bloqueado por la validación de carrera de todas formas) — se
    // reinicia al cambiar.
    saved.clear();
    setManualCarrera("");
    setChangeCarreraConfirmOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Simulador de horario"
        subtitle={
          kardex.data?.carrera
            ? `${kardex.data.carrera} · próximo semestre`
            : "Arma y compara tus opciones para el próximo semestre"
        }
        stickyOnMobile={false}
      >
        {!checkingSession && !needsCarreraPicker ? (
          <>
            {isGuest ? (
              <div className="mb-4 flex flex-col gap-2.5 rounded-xl bg-brand-gray-lighter px-3.5 py-2.5 text-xs text-brand-gray sm:flex-row sm:items-center">
                <span>
                  Viendo materias de{" "}
                  <b className="text-brand-black">
                    {CARRERAS.find((c) => c.code === manualCarrera)?.label}
                  </b>
                </span>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    if (saved.materias.length > 0) {
                      setChangeCarreraConfirmOpen(true);
                    } else {
                      setManualCarrera("");
                    }
                  }}
                  className="flex w-full flex-none items-center justify-center gap-1.5 rounded-lg bg-brand-gray px-2.5 py-1.5 text-xs font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-110 sm:ml-auto sm:w-auto"
                >
                  <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Cambiar carrera
                </motion.button>
              </div>
            ) : null}

            <div className="flex flex-col gap-2.5 sm:flex-row">
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
                  {activeStatusLabel}
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
                      className="absolute right-0 z-10 mt-1.5 w-44 overflow-hidden rounded-[10px] border border-brand-gray-lighter bg-surface shadow-[0_10px_24px_-8px_rgba(20,14,6,0.18)]"
                    >
                      {STATUS_FILTERS.map((f) => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => {
                            setStatusFilter(f.value);
                            setFilterOpen(false);
                          }}
                          className={`block w-full px-3.5 py-2.5 text-left text-sm font-semibold transition-colors duration-150 hover:bg-brand-primary-tint ${
                            statusFilter === f.value
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

              <div ref={horaRef} className="relative">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setHoraOpen((v) => !v)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-[10px] border px-3.5 py-2.25 text-sm font-semibold sm:w-auto ${
                    horaDesde || horaHasta
                      ? "border-brand-primary-dark bg-brand-primary-tint text-brand-primary-dark"
                      : "border-brand-gray-lighter text-brand-black"
                  }`}
                >
                  <Clock className="h-[18px] w-[18px]" strokeWidth={1.7} />
                  {activeHoraLabel}
                  <motion.span
                    animate={{ rotate: horaOpen ? 180 : 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {horaOpen ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-10 mt-1.5 w-64 rounded-[10px] border border-brand-gray-lighter bg-surface p-3.5 shadow-[0_10px_24px_-8px_rgba(20,14,6,0.18)]"
                    >
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.04em] text-brand-gray-light">
                            Desde
                          </label>
                          <select
                            value={horaDesde}
                            onChange={(e) => setHoraDesde(e.target.value)}
                            className="w-full rounded-[8px] border border-brand-gray-lighter bg-background px-2 py-2 text-sm font-semibold text-brand-black outline-none focus:ring-2 focus:ring-brand-primary/40"
                          >
                            <option value="">Cualquiera</option>
                            {HOUR_OPTIONS.map((h) => (
                              <option key={h} value={h}>
                                {h}:00
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.04em] text-brand-gray-light">
                            Hasta
                          </label>
                          <select
                            value={horaHasta}
                            onChange={(e) => setHoraHasta(e.target.value)}
                            className="w-full rounded-[8px] border border-brand-gray-lighter bg-background px-2 py-2 text-sm font-semibold text-brand-black outline-none focus:ring-2 focus:ring-brand-primary/40"
                          >
                            <option value="">Cualquiera</option>
                            {HOUR_OPTIONS.map((h) => (
                              <option key={h} value={h}>
                                {h}:00
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {horaDesde || horaHasta ? (
                        <button
                          type="button"
                          onClick={() => {
                            setHoraDesde("");
                            setHoraHasta("");
                          }}
                          className="mt-2.5 text-xs font-semibold text-brand-primary-dark hover:underline"
                        >
                          Limpiar
                        </button>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="flex flex-none gap-2.5 sm:ml-auto">
                <button
                  type="button"
                  onClick={() => setClearConfirmOpen(true)}
                  disabled={!saved.materias.length}
                  aria-label="Vaciar tu horario"
                  className="flex flex-none items-center justify-center gap-1.5 rounded-[10px] px-3.5 py-2.25 text-sm font-semibold text-brand-gray transition-colors duration-150 hover:bg-danger-tint hover:text-danger disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.7} />
                  Vaciar
                </button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setPreviewOpen(true)}
                  disabled={!saved.materias.length}
                  className="flex flex-none items-center justify-center gap-1.5 rounded-[10px] bg-brand-primary px-3.5 py-2.25 text-sm font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.1] disabled:pointer-events-none disabled:opacity-40"
                >
                  <Eye className="h-[18px] w-[18px]" strokeWidth={1.7} />
                  Vista previa
                  {saved.materias.length > 0 ? (
                    <span className="rounded-full bg-white/25 px-1.5 py-0.25 text-xs">
                      {saved.materias.length}
                    </span>
                  ) : null}
                </motion.button>
              </div>
            </div>

            {availableSemesters.length > 0 ? (
              <div className="relative mt-2.5">
                <div
                  ref={semestreScrollRef}
                  onScroll={updateSemestreScrollShadows}
                  className="flex gap-2 overflow-x-auto pb-1"
                >
                  <button
                    type="button"
                    onClick={() => setSemestreFilter("all")}
                    className={`flex-none rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
                      semestreFilter === "all"
                        ? "bg-brand-black text-background"
                        : "bg-brand-gray-lighter text-brand-black hover:bg-brand-primary-tint"
                    }`}
                  >
                    Todos
                  </button>
                  {availableSemesters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSemestreFilter(s)}
                      className={`flex-none rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-150 ${
                        semestreFilter === s
                          ? "bg-brand-black text-background"
                          : "bg-brand-gray-lighter text-brand-black hover:bg-brand-primary-tint"
                      }`}
                    >
                      {semestreLabel(s)}
                    </button>
                  ))}
                </div>

                {/* Degradados que insinúan que hay más chips fuera de
                    vista — solo se muestran del lado que todavía tiene
                    contenido por scrollear. */}
                {canScrollLeft ? (
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
                ) : null}
                {canScrollRight ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </PageHeader>

      {checkingSession ? (
        <LoadingState />
      ) : needsCarreraPicker ? (
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-lg font-bold text-brand-black">
            ¿Cuál es tu carrera?
          </div>
          <p className="mx-auto mt-1 max-w-sm text-sm text-brand-gray">
            Como no iniciaste sesión no sabemos tu carrera todavía — elígela
            para ver el catálogo de materias disponibles.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
            {CARRERAS.map((c, index) => (
              <motion.button
                key={c.code}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(index * 0.03, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setManualCarrera(c.code)}
                className="flex items-center gap-3 rounded-xl bg-brand-gray-lighter p-4 transition-shadow duration-200 ease-out hover:shadow-[0_14px_26px_-12px_rgba(20,14,6,0.14)]"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-gray text-white">
                  <c.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-bold text-brand-black">
                  {c.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <>

      {horarios.isLoading ? <LoadingState label="Cargando materias…" /> : null}
      {horarios.isError ? (
        <QueryError message={horarios.error.message} />
      ) : null}

      {horarios.data ? (
        filteredMaterias.length === 0 ? (
          <EmptyState
            title="No encontramos materias"
            description="Ajusta la búsqueda o los filtros e intenta de nuevo."
          />
        ) : (
          <motion.div
            key={`${statusFilter}-${semestreFilter}-${horaDesde}-${horaHasta}-${query}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mobile: cards — una tabla con scroll horizontal es incómoda
                en pantallas chicas, y el botón "+" hover-only tampoco
                funciona con touch, así que aquí siempre queda visible. */}
            <div className="flex flex-col gap-2.5 sm:hidden">
              {catalogRows.map(
                ({ subject, isSelected, isBlocked, timeConflict, days }, index) => (
                  <div
                    key={`${subject.grupo}-${index}`}
                    onClick={isBlocked ? undefined : () => handleToggle(subject)}
                    aria-disabled={isBlocked}
                    className={`rounded-xl border p-3.5 transition-colors duration-150 ${
                      isSelected
                        ? "cursor-pointer border-brand-green/30 bg-brand-green-tint"
                        : isBlocked
                          ? "cursor-not-allowed border-divider opacity-50"
                          : timeConflict
                            ? "cursor-pointer border-danger/30 bg-danger-tint"
                            : "cursor-pointer border-divider active:bg-brand-primary-tint"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.75 text-[11px] font-bold text-white ${
                          isSelected ? "bg-brand-green" : "bg-brand-primary-dark"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        ) : null}
                        {subject.grupo}
                      </span>

                      {isBlocked || timeConflict ? null : (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleToggle(subject);
                          }}
                          aria-label={
                            isSelected
                              ? `Quitar ${subject.materia}`
                              : `Agregar ${subject.materia}`
                          }
                          className={`inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-white ${
                            isSelected ? "bg-danger" : "bg-brand-green"
                          }`}
                        >
                          {isSelected ? (
                            <X className="h-3.5 w-3.5" strokeWidth={2.4} />
                          ) : (
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                          )}
                        </button>
                      )}
                    </div>

                    <div
                      className={`mt-2 text-sm font-bold ${
                        isSelected ? "text-brand-green" : "text-brand-black"
                      }`}
                    >
                      {subject.materia}
                    </div>
                    <div className="mt-0.5 text-xs text-brand-gray">
                      {subject.profesor}
                    </div>

                    {isBlocked ? (
                      <div className="mt-1.5 text-[11px] font-semibold text-brand-gray-light">
                        Ya la tienes con otro profesor
                      </div>
                    ) : null}
                    {timeConflict ? (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-danger">
                        Choca con &quot;{timeConflict.materia}&quot;
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleQuickReplace(subject, timeConflict);
                          }}
                          className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold text-white"
                        >
                          Reemplazar
                        </button>
                      </div>
                    ) : null}

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex gap-1">
                        {days.map((d) => (
                          <span
                            key={d.label}
                            className={`flex h-5 w-5 flex-none items-center justify-center rounded text-[10px] font-bold ${
                              d.value
                                ? isSelected
                                  ? "bg-brand-green text-white"
                                  : "bg-brand-primary-dark text-white"
                                : "bg-brand-gray-lighter text-brand-gray-light"
                            }`}
                          >
                            {d.label}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-brand-gray">
                        {scheduleLabel(subject)}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Tablet/desktop: tabla */}
            <div className="hidden overflow-x-auto rounded-xl border border-brand-gray-lighter sm:block">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-brand-gray-lighter bg-brand-gray-lighter text-left text-[11px] font-bold uppercase tracking-[0.04em] text-brand-gray">
                    <th className="px-3.5 py-2.5">Grupo</th>
                    <th className="px-3.5 py-2.5">Materia</th>
                    <th className="px-3.5 py-2.5">Profesor</th>
                    <th className="px-3.5 py-2.5">Días</th>
                    <th className="px-3.5 py-2.5">Horario</th>
                    <th className="px-3.5 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {catalogRows.map(
                    ({ subject, isSelected, isBlocked, timeConflict, days }, index) => (
                      <tr
                        key={`${subject.grupo}-${index}`}
                        onClick={
                          isBlocked ? undefined : () => handleToggle(subject)
                        }
                        aria-disabled={isBlocked}
                        className={`group border-b border-brand-gray-lighter transition-colors duration-150 last:border-b-0 ${
                          isSelected
                            ? "cursor-pointer bg-brand-green-tint"
                            : isBlocked
                              ? "cursor-not-allowed opacity-50"
                              : timeConflict
                                ? "cursor-pointer bg-danger-tint"
                                : "cursor-pointer hover:bg-brand-primary-tint"
                        }`}
                      >
                        <td className="whitespace-nowrap px-3.5 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.75 text-[11px] font-bold text-white ${
                              isSelected
                                ? "bg-brand-green"
                                : "bg-brand-primary-dark"
                            }`}
                          >
                            {isSelected ? (
                              <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            ) : null}
                            {subject.grupo}
                          </span>
                        </td>
                        <td
                          className={`px-3.5 py-2.5 font-bold ${
                            isSelected ? "text-brand-green" : "text-brand-black"
                          }`}
                        >
                          {subject.materia}
                          {isBlocked ? (
                            <span className="ml-2 text-[11px] font-semibold text-brand-gray-light">
                              Ya la tienes con otro profesor
                            </span>
                          ) : null}
                          {timeConflict ? (
                            <span className="ml-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-danger">
                              Choca con &quot;{timeConflict.materia}&quot;
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleQuickReplace(subject, timeConflict);
                                }}
                                className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold text-white transition-[transform,filter] duration-150 motion-safe:hover:-translate-y-0.5 hover:brightness-[1.1]"
                              >
                                Reemplazar
                              </button>
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3.5 py-2.5 text-brand-gray">
                          {subject.profesor}
                        </td>
                        <td className="px-3.5 py-2.5">
                          <div className="flex gap-1">
                            {days.map((d) => (
                              <span
                                key={d.label}
                                className={`flex h-5 w-5 flex-none items-center justify-center rounded text-[10px] font-bold ${
                                  d.value
                                    ? isSelected
                                      ? "bg-brand-green text-white"
                                      : "bg-brand-primary-dark text-white"
                                    : "bg-brand-gray-lighter text-brand-gray-light"
                                }`}
                              >
                                {d.label}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3.5 py-2.5 text-brand-gray">
                          {scheduleLabel(subject)}
                        </td>
                        <td className="whitespace-nowrap px-3.5 py-2.5 text-right">
                          {isBlocked || timeConflict ? null : (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleToggle(subject);
                              }}
                              aria-label={
                                isSelected
                                  ? `Quitar ${subject.materia}`
                                  : `Agregar ${subject.materia}`
                              }
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-opacity duration-150 hover:brightness-110 group-hover:opacity-100 ${
                                isSelected
                                  ? "bg-danger text-white"
                                  : "bg-brand-green text-white"
                              }`}
                            >
                              {isSelected ? (
                                <X className="h-3.5 w-3.5" strokeWidth={2.4} />
                              ) : (
                                <Plus className="h-3.5 w-3.5" strokeWidth={2.4} />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )
      ) : null}

      <SchedulePreviewModal
        open={previewOpen}
        materias={saved.materias}
        onClose={() => setPreviewOpen(false)}
        onRemoveGrupo={saved.remove}
      />

      <ConfirmModal
        open={clearConfirmOpen}
        title="Vaciar tu horario"
        description={`Vas a quitar las ${saved.materias.length} materias de tu horario. Esta acción no se puede deshacer.`}
        confirmLabel="Vaciar horario"
        danger
        onCancel={() => setClearConfirmOpen(false)}
        onConfirm={handleClearAll}
      />

      <ConfirmModal
        open={changeCarreraConfirmOpen}
        title="Cambiar de carrera"
        description={`Al cambiar de carrera se va a borrar el horario que armaste (${saved.materias.length} ${saved.materias.length === 1 ? "materia" : "materias"}). Esta acción no se puede deshacer.`}
        confirmLabel="Cambiar carrera"
        danger
        onCancel={() => setChangeCarreraConfirmOpen(false)}
        onConfirm={handleChangeCarrera}
      />
        </>
      )}

      <Snackbar message={feedback} variant={feedbackVariant} />
    </>
  );
}
