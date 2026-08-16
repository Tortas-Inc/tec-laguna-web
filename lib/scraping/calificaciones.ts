import * as cheerio from "cheerio";
import { ITL_STATUS_BASE } from "./constants";
import { itlCookieHeader } from "./itl-fetch";
import { cleanText } from "./text";

export type MateriaCalificacion = {
  grupo: string;
  materia: string;
  profesor: string;
  calificacion: string;
  oportunidad: string;
};

export type CalificacionesResult = {
  // A diferencia de Kardex (que trae #MainContent_Label1 ya calculado por
  // el portal), este endpoint no expone un promedio — CalificacionesRepositoryImpl.kt
  // tampoco lo tiene. Lo calculamos aquí, en escala 0-10 para mantener
  // consistencia visual con "Promedio general" de Kardex.
  promedio: number | null;
  materias: MateriaCalificacion[];
};

// Misma estructura que CalificacionesRepositoryImpl.kt: datos en la
// segunda tabla del documento (índice 1), columnas por posición.
export function parseCalificaciones(html: string): CalificacionesResult {
  const $ = cheerio.load(html);
  const tables = $("table");
  if (tables.length < 2) {
    return { promedio: null, materias: [] };
  }

  const materias: MateriaCalificacion[] = [];
  tables.eq(1).find("tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length === 0) return;
    const cell = (i: number) => cleanText($(cols[i]).text());
    materias.push({
      grupo: cell(0),
      materia: cell(1),
      profesor: cell(2),
      calificacion: cell(3),
      oportunidad: cell(4),
    });
  });

  return { promedio: computePromedio(materias), materias };
}

function computePromedio(materias: MateriaCalificacion[]): number | null {
  const values = materias
    .map((m) => Number.parseFloat(m.calificacion))
    .filter((n) => !Number.isNaN(n));
  if (values.length === 0) return null;

  const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.round(avg) / 10;
}

export async function fetchCalificaciones(
  sessionId: string,
): Promise<CalificacionesResult> {
  const res = await fetch(
    `${ITL_STATUS_BASE}/alumnos/frmCargaAcademicaCal.aspx`,
    { headers: { Cookie: itlCookieHeader(sessionId) } },
  );
  if (!res.ok) {
    throw new Error(`El portal ITL respondió ${res.status}`);
  }
  const html = await res.text();
  return parseCalificaciones(html);
}
