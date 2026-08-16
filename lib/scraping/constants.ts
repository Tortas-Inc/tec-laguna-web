// En local, MOCK_ITL=true apunta estas bases al mock server
// (scripts/mock-itl-server.mjs) en vez del portal real — el código de
// scraping (login.ts, horario.ts, etc.) no sabe ni le importa la
// diferencia, solo hace fetch() contra estas constantes.
const useMockServer = process.env.MOCK_ITL === "true";
const MOCK_SERVER_BASE = `http://localhost:${process.env.MOCK_ITL_PORT ?? "4310"}`;

export const ITL_STATUS_BASE = useMockServer
  ? `${MOCK_SERVER_BASE}/StatusAlumno`
  : "http://apps2.itlalaguna.edu.mx/StatusAlumno";

export const ITL_HORARIOS_BASE = useMockServer
  ? `${MOCK_SERVER_BASE}/servicios/academicos/horario_materias_2020`
  : "http://apps.itlalaguna.edu.mx/servicios/academicos/horario_materias_2020";

// Cookie httpOnly propia del navegador — reenvía el ASP.NET_SessionId real
// del ITL en cada request, sin guardarlo server-side (issue #25, sección 1).
export const ITL_SESSION_COOKIE = "itl_session";
