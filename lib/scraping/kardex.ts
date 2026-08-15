import * as cheerio from "cheerio";
import { ITL_STATUS_BASE } from "./constants";
import { itlCookieHeader } from "./itl-fetch";
import { capitalizeWords, cleanText } from "./text";

// Mismo listado y orden que Kardex.LIST_OF_CARRERAS en el modelo de dominio
// de Android — el índice (1-based) es el código ESPECIALIDAD que usa el
// endpoint de horarios por carrera (sección 2.5 del issue #25), salvo la
// 10ª carrera, que usa "Z" en vez de "10".
export const LIST_OF_CARRERAS = [
  "INGENIERIA EN SISTEMAS COMPUTACIONALES",
  "INGENIERIA INDUSTRIAL",
  "INGENIERIA ELECTRICA",
  "INGENIERIA MECANICA",
  "INGENIERIA QUIMICA",
  "INGENIERIA ELECTRONICA",
  "LICENCIATURA EN ADMINISTRACION",
  "INGENIERIA MECATRONICA",
  "INGENIERIA EN ENERGIAS RENOVABLES",
  "INGENIERIA EN GESTION EMPRESARIAL",
];

export function getCarreraCode(carrera: string): string {
  const index = LIST_OF_CARRERAS.indexOf(carrera.toUpperCase().trim()) + 1;
  if (index === 0) return "";
  return index === 10 ? "Z" : String(index);
}

export type MateriaKardex = {
  clave: string;
  materia: string;
  creditos: number;
  calificacion: string;
  periodo1: string;
  periodo2: string;
  periodo3: string;
};

export type KardexResult = {
  carrera: string;
  carreraCode: string;
  promedio: string;
  creditosTotales: number;
  materias: MateriaKardex[];
};

// Misma estructura que KardexRepositoryImpl.kt: carrera en
// #MainContent_lblCarrera, promedio (ya calculado por el portal) en
// #MainContent_Label1, datos en la segunda tabla (índice 1).
export function parseKardex(html: string): KardexResult {
  const $ = cheerio.load(html);

  const carreraRaw = cleanText($("#MainContent_lblCarrera").text());
  const carrera = capitalizeWords(carreraRaw).replace(/ En /g, " en ");
  const carreraCode = getCarreraCode(carreraRaw);
  const promedio = cleanText($("#MainContent_Label1").text());

  const tables = $("table");
  if (tables.length < 2) {
    return { carrera, carreraCode, promedio, creditosTotales: 0, materias: [] };
  }

  const materias: MateriaKardex[] = [];
  tables.eq(1).find("tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length === 0) return;
    const cell = (i: number) => cleanText($(cols[i]).text());
    materias.push({
      clave: cell(0),
      materia: cell(1),
      creditos: Number.parseInt(cell(2), 10) || 0,
      calificacion: cell(3),
      periodo1: cell(4),
      periodo2: cell(5),
      periodo3: cell(6),
    });
  });

  const creditosTotales = materias.reduce((sum, m) => sum + m.creditos, 0);

  return { carrera, carreraCode, promedio, creditosTotales, materias };
}

export async function fetchKardex(sessionId: string): Promise<KardexResult> {
  const res = await fetch(`${ITL_STATUS_BASE}/alumnos/frmKardex.aspx`, {
    headers: { Cookie: itlCookieHeader(sessionId) },
  });
  const html = await res.text();
  return parseKardex(html);
}
