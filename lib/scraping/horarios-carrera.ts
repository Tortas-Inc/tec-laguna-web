import * as cheerio from "cheerio";
import { ITL_HORARIOS_BASE } from "./constants";
import { cleanText } from "./text";

export type MateriaHorarioCarrera = {
  materia: string;
  grupo: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  profesor: string;
  isFinished: boolean;
};

// A diferencia de los otros endpoints, este usa la PRIMERA tabla del
// documento (índice 0) y no requiere sesión (endpoint público del ITL,
// dominio distinto). Misma estructura que HorariosCarreraRepositoryImpl.kt.
// "isFinished" se marca comparando el grupo contra las claves ya cursadas
// del kardex del alumno (si hay sesión activa) — en Android sale de una
// caché local en Room; aquí, al no persistir nada server-side, se resuelve
// en la misma request si el caller pasa clavesCursadas.
export function parseHorariosCarrera(
  html: string,
  clavesCursadas: string[] = [],
): MateriaHorarioCarrera[] {
  const $ = cheerio.load(html);
  const tables = $("table");
  if (tables.length < 1) return [];

  const materias: MateriaHorarioCarrera[] = [];
  tables
    .eq(0)
    .find("tr")
    .each((index, row) => {
      if (index === 0) return; // encabezado
      const cols = $(row).find("td");
      if (cols.length === 0) return;
      const cell = (i: number) => cleanText($(cols[i]).text());
      const grupo = cell(1);
      materias.push({
        materia: cell(0),
        grupo,
        lunes: cell(2),
        martes: cell(3),
        miercoles: cell(4),
        jueves: cell(5),
        viernes: cell(6),
        profesor: cell(7),
        isFinished: clavesCursadas.some((clave) => grupo.includes(clave)),
      });
    });

  return materias;
}

export async function fetchHorariosCarreraHtml(
  especialidad: string,
): Promise<string> {
  const form = new URLSearchParams();
  form.set("ESPECIALIDAD", especialidad);

  const res = await fetch(`${ITL_HORARIOS_BASE}/horarios.asp`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  return res.text();
}
