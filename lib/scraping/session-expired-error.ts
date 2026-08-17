// Cuando el ITL ya mató la sesión de su lado, sus páginas de StatusAlumno
// no responden con un 401/403 — casi siempre redirigen (con 200) a una
// página completamente distinta (login del ITL), que ya no trae la
// estructura esperada (menos tablas de las que debería, sin las
// etiquetas del alumno). Se detecta así, en vez de por status HTTP.
export class SessionExpiredError extends Error {
  constructor() {
    super("Tu sesión con el portal escolar expiró");
    this.name = "SessionExpiredError";
  }
}
