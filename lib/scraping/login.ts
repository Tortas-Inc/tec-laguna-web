import * as cheerio from "cheerio";
import { ITL_STATUS_BASE } from "./constants";

export type LoginResult =
  | { ok: true; sessionId: string }
  | { ok: false; error: string };

const CREDENTIALS_ERROR = "Usuario o contraseña incorrectos";

// El backend obtiene __VIEWSTATE/__EVENTVALIDATION frescos justo antes de
// cada intento de login, en vez de hardcodearlos como hace la app Android
// (issue #25, sección 2.1) — evita que el login se rompa si el portal
// rota esos tokens.
async function getLoginTokens(): Promise<{
  viewState: string;
  eventValidation: string;
}> {
  const res = await fetch(`${ITL_STATUS_BASE}/login.aspx`, {
    headers: { Cookie: "ASP.NET_SessionId=hola;" },
  });
  const html = await res.text();
  const $ = cheerio.load(html);

  return {
    viewState: $("#__VIEWSTATE").attr("value") ?? "",
    eventValidation: $("#__EVENTVALIDATION").attr("value") ?? "",
  };
}

export function isLoginError(html: string): boolean {
  return html.includes("lblError");
}

function extractSessionId(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(/ASP\.NET_SessionId=([^;]+)/);
  return match ? match[1] : null;
}

export async function loginToItl(
  controlNumber: string,
  password: string,
): Promise<LoginResult> {
  const { viewState, eventValidation } = await getLoginTokens();

  const form = new URLSearchParams();
  form.set("tbLogin", controlNumber);
  form.set("tbPassword", password);
  form.set("Button2", "Ingresar");
  form.set("__EVENTVALIDATION", eventValidation);
  form.set("__VIEWSTATE", viewState);

  const res = await fetch(`${ITL_STATUS_BASE}/login.aspx`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: "ASP.NET_SessionId=hola;",
    },
    body: form.toString(),
    // 'manual' para poder leer el Set-Cookie de la respuesta de redirect
    // antes de que se siga (issue #25, sección 2.1).
    redirect: "manual",
  });

  const html = await res.text();
  if (isLoginError(html)) {
    return { ok: false, error: CREDENTIALS_ERROR };
  }

  const sessionId = extractSessionId(res.headers.get("set-cookie"));
  if (!sessionId) {
    return { ok: false, error: CREDENTIALS_ERROR };
  }

  return { ok: true, sessionId };
}
