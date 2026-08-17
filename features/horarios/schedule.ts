// Helpers puros de la clave real del portal (rediseño 2026, verificado
// en vivo contra Ing. Sistemas Computacionales e Ing. Eléctrica):
// LETRA + dígito de carrera + dígito de semestre, ej. "A11" = eje A,
// carrera 1, semestre 1..8 (el mismo eje —A, B, C...— se repite en el
// mismo orden en distintas carreras). Tres categorías no encajan en esa
// escalera y se identifican aparte: Residencia (el último dígito es
// "9", no un semestre real), Tutoría (mismo patrón de clave pero se
// imparte en cualquier semestre) y Electivas (materias nuevas con clave
// numérica o con sufijo "D", ej. "51D", "131", que no siguen el patrón).
export const RESIDENCIA = "Residencia";
export const TUTORIA = "Tutoría";
export const ELECTIVAS = "Electivas";
const SEMESTRE_CLAVE_PATTERN = /^[A-Z]\d(\d)$/;

export function getSemestre(subject: { grupo: string; materia: string }): string {
  if (/^TUTORIA\b/i.test(subject.materia.trim())) return TUTORIA;

  const match = materiaId(subject.grupo).match(SEMESTRE_CLAVE_PATTERN);
  if (!match) return ELECTIVAS;

  const semestre = match[1];
  return semestre === "9" ? RESIDENCIA : semestre;
}

export function materiaId(grupo: string): string {
  return grupo.slice(0, 3);
}

export function startHour(m: { lunes: string; viernes: string }): string {
  const day = m.lunes || m.viernes;
  const idx = day.indexOf("-");
  return idx === -1 ? "" : day.slice(0, idx);
}

const SPECIAL_ORDER = [ELECTIVAS, RESIDENCIA, TUTORIA];

export function sortSemesters(semesters: string[]): string[] {
  return [...semesters].sort((a, b) => {
    const aSpecial = SPECIAL_ORDER.indexOf(a);
    const bSpecial = SPECIAL_ORDER.indexOf(b);
    if (aSpecial !== -1 && bSpecial !== -1) return aSpecial - bSpecial;
    if (aSpecial !== -1) return 1;
    if (bSpecial !== -1) return -1;
    return Number(a) - Number(b);
  });
}
