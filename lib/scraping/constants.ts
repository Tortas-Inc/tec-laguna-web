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

// El portal rehizo esta sección por completo (antes vivía en
// apps.itlalaguna.edu.mx/servicios/..., una página ASP clásica sin
// styling); ahora es apps2.itlalaguna.edu.mx/horarios, pública (no pide
// sesión) y con un formulario WebForms normal (viewstate + postback).
//
// A propósito NO usa el mock server aunque MOCK_ITL=true — /horarios
// (el simulador) siempre pega directo al portal real; el resto de
// pantallas (login, Tu horario, Calificaciones, Kardex, vía
// ITL_STATUS_BASE) sigue pudiendo mockearse normal.
export const ITL_HORARIOS_BASE = "https://apps2.itlalaguna.edu.mx/horarios";

// Cookie httpOnly propia del navegador — reenvía el ASP.NET_SessionId real
// del ITL en cada request, sin guardarlo server-side (issue #25, sección 1).
export const ITL_SESSION_COOKIE = "itl_session";
