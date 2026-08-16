import {
  Bot,
  Briefcase,
  CircuitBoard,
  Cpu,
  Factory,
  FlaskConical,
  GraduationCap,
  Leaf,
  LucideIcon,
  MemoryStick,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";

// Mismas opciones y códigos que el <select id="ddlPlan"> real de
// apps2.itlalaguna.edu.mx/horarios/login.aspx (rediseño 2026) — a
// diferencia de LIST_OF_CARRERAS en lib/scraping/kardex.ts (que solo
// mapea la carrera que trae el Kardex del alumno logueado), esta lista
// se usa para el selector manual cuando no hay sesión (modo invitado).
export const CARRERAS: { code: string; label: string; icon: LucideIcon }[] = [
  { code: "1", label: "Ingeniería en Sistemas Computacionales", icon: Cpu },
  { code: "2", label: "Ingeniería Industrial", icon: Factory },
  { code: "3", label: "Ingeniería Eléctrica", icon: Zap },
  { code: "4", label: "Ingeniería Mecánica", icon: Wrench },
  { code: "5", label: "Ingeniería Química", icon: FlaskConical },
  { code: "6", label: "Ingeniería Electrónica", icon: CircuitBoard },
  { code: "7", label: "Licenciatura en Administración", icon: Briefcase },
  { code: "8", label: "Ingeniería Mecatrónica", icon: Bot },
  { code: "9", label: "Ingeniería en Energías Renovables", icon: Leaf },
  { code: "Z", label: "Ingeniería en Gestión Empresarial", icon: TrendingUp },
  { code: "a", label: "Ingeniería en Semiconductores", icon: MemoryStick },
  {
    code: "p",
    label: "Maestría en Ciencias en Ingeniería Eléctrica",
    icon: GraduationCap,
  },
];
