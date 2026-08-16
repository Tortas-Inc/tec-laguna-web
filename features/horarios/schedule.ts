// Helpers puros que replican Materia.kt (tec-laguna-android):
// grupo "C16B" -> 3er carácter es el semestre; "21WA" -> 3er carácter
// letra indica materia de especialidad.

export function getSemestre(grupo: string): string {
  if (grupo.length < 4) return "";
  const third = grupo[2];
  return /[a-zA-Z]/.test(third) ? "Especialidad" : third;
}

export function materiaId(grupo: string): string {
  return grupo.slice(0, 3);
}

export function startHour(m: { lunes: string; viernes: string }): string {
  const day = m.lunes || m.viernes;
  const idx = day.indexOf("-");
  return idx === -1 ? "" : day.slice(0, idx);
}

export function sortSemesters(semesters: string[]): string[] {
  return [...semesters].sort((a, b) => {
    if (a === "Especialidad") return 1;
    if (b === "Especialidad") return -1;
    return Number(a) - Number(b);
  });
}
