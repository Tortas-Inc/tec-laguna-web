import * as cheerio from "cheerio";
import { ITL_STATUS_BASE } from "./constants";
import { itlCookieHeader } from "./itl-fetch";
import { SessionExpiredError } from "./session-expired-error";
import { capitalizeWords, cleanText } from "./text";

export type Materia = {
  grupo: string;
  materia: string;
  profesor: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
};

export type HorarioResult = {
  studentName: string;
  materias: Materia[];
};

// Misma estructura que HorarioRepositoryImpl.kt (Android): nombre en
// #MainContent_lblNombre, datos en la segunda tabla del documento
// (índice 1), columnas por posición.
export function parseHorario(html: string): HorarioResult {
  const $ = cheerio.load(html);
  const studentName = capitalizeWords(
    cleanText($("#MainContent_lblNombre").text()),
  );

  const tables = $("table");
  // Con sesión viva, StatusAlumno siempre responde esta estructura (tabla
  // de encabezado + tabla de datos, aunque esta última venga sin filas) —
  // si falta, el ITL ya no reconoce la sesión y mandó otra página.
  if (tables.length < 2) {
    throw new SessionExpiredError();
  }

  const materias: Materia[] = [];
  tables.eq(1).find("tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length === 0) return;
    const cell = (i: number) => cleanText($(cols[i]).text());
    materias.push({
      grupo: cell(0),
      materia: cell(1),
      profesor: cell(2),
      lunes: cell(3),
      martes: cell(4),
      miercoles: cell(5),
      jueves: cell(6),
      viernes: cell(7),
    });
  });

  return { studentName, materias };
}

export async function fetchHorario(sessionId: string): Promise<HorarioResult> {
  const res = await fetch(
    `${ITL_STATUS_BASE}/alumnos/frmCargaAcademica.aspx`,
    {
      method: "POST",
      headers: { Cookie: itlCookieHeader(sessionId) },
    },
  );
  if (!res.ok) {
    throw new Error(`El portal ITL respondió ${res.status}`);
  }
  const html = await res.text();
  return parseHorario(html);
}
