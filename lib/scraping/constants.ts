// En local, MOCK_ITL=true apunta estas bases al mock server
// (scripts/mock-itl-server.mjs) en vez del portal real — el código de
// scraping (login.ts, horario.ts, etc.) no sabe ni le importa la
// diferencia, solo hace fetch() contra estas constantes.
//
// El `&& NODE_ENV !== "production"` es a propósito: Next.js fuerza
// NODE_ENV=production en `next build`/`next start` sin importar qué
// variables de entorno propias tengas seteadas, así que aunque alguien
// deje MOCK_ITL=true en las env vars de producción por error, esta
// bandera nunca se activa ahí — evita que el sitio en vivo intente
// pegarle a un localhost que no existe.
const useMockServer =
  process.env.MOCK_ITL === "true" && process.env.NODE_ENV !== "production";
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
