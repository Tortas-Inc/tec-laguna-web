// Los datos del portal escolar no cambian seguido (horarios, kardex,
// calificaciones se fijan por semestre) — se cachean 24h tanto en memoria
// (staleTime, evita refetch automático) como en localStorage (ver
// app/providers.tsx), para no tener que volver a pedirlos cada vez que se
// recarga la página.
export const DAY_MS = 24 * 60 * 60 * 1000;
