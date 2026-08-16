import * as cheerio from "cheerio";
import { ITL_HORARIOS_BASE } from "./constants";
import { cleanText } from "./text";

export type MateriaHorarioCarrera = {
  materia: string;
  // Clave real + sección (ej. "C16" + "A" = "C16A") — se combinan porque
  // el resto de la app (materiaId/isFinished en schedule.ts) ya asume un
  // solo string con la clave en los primeros 3 caracteres, y en los datos
  // reales la clave siempre son 3 caracteres.
  grupo: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  profesor: string;
  isFinished: boolean;
};

const DAY_COLUMNS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
] as const;
// Índice de columna (0-based) de cada día en la tabla #gvHorarios real:
// Clave, Grupo, Materia, Horario, L, M, I, J, V, Catedrático, %Req, ...
const FIRST_DAY_COLUMN_INDEX = 4;

function extractViewState($: cheerio.CheerioAPI) {
  return {
    viewState: $("#__VIEWSTATE").attr("value") ?? "",
    viewStateGenerator: $("#__VIEWSTATEGENERATOR").attr("value") ?? "",
    eventValidation: $("#__EVENTVALIDATION").attr("value") ?? "",
  };
}

// El nuevo "Consulta de horarios" del ITL (apps2.itlalaguna.edu.mx/horarios)
// es un WebForms clásico de un solo paso: GET para sacar el viewstate
// fresco, POST con el plan de estudios elegido a la misma URL — sin
// sesión, es público. La tabla de resultados (#gvHorarios) ya no reparte
// un horario distinto por día como antes: ahora hay UNA columna "Horario"
// (misma hora todos los días que se imparte) y una columna por día que
// solo dice el aula (o "libre" si ese día no hay clase).
export async function fetchHorariosCarreraHtml(
  especialidad: string,
): Promise<string> {
  const loginUrl = `${ITL_HORARIOS_BASE}/login.aspx`;

  const getRes = await fetch(loginUrl);
  if (!getRes.ok) {
    throw new Error(`El portal ITL respondió ${getRes.status}`);
  }
  const { viewState, viewStateGenerator, eventValidation } = extractViewState(
    cheerio.load(await getRes.text()),
  );

  const form = new URLSearchParams();
  form.set("__VIEWSTATE", viewState);
  form.set("__VIEWSTATEGENERATOR", viewStateGenerator);
  form.set("__EVENTVALIDATION", eventValidation);
  form.set("ddlPlan", especialidad);
  form.set("btnConsultar", "Consultar");

  const postRes = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!postRes.ok) {
    throw new Error(`El portal ITL respondió ${postRes.status}`);
  }
  return postRes.text();
}

// "isFinished" se marca comparando el grupo (clave+sección) contra las
// claves ya cursadas del kardex del alumno (si hay sesión activa) — ver
// app/api/horarios/route.ts.
export function parseHorariosCarrera(
  html: string,
  clavesCursadas: string[] = [],
): MateriaHorarioCarrera[] {
  const $ = cheerio.load(html);
  const materias: MateriaHorarioCarrera[] = [];

  $("#gvHorarios tbody tr").each((_, row) => {
    const cols = $(row).find("td");
    if (cols.length === 0) return;
    const cell = (i: number) => cleanText($(cols[i]).text());

    const clave = cell(0);
    const seccion = cell(1);
    const grupo = `${clave}${seccion}`;
    const horario = cell(3);
    const profesor = cell(9);

    const dias = Object.fromEntries(
      DAY_COLUMNS.map((day, i) => {
        const aula = cleanText(
          $(cols[FIRST_DAY_COLUMN_INDEX + i])
            .find(".aula")
            .text(),
        );
        return [day, aula && horario ? `${horario}/${aula}` : ""];
      }),
    ) as Record<(typeof DAY_COLUMNS)[number], string>;

    materias.push({
      materia: cell(2),
      grupo,
      profesor,
      ...dias,
      isFinished: clavesCursadas.some((c) => grupo.includes(c)),
    });
  });

  return materias;
}
