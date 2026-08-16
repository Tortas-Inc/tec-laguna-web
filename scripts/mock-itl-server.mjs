#!/usr/bin/env node
// Mock server del portal ITL para desarrollo local, sin depender de
// apps2.itlalaguna.edu.mx / apps.itlalaguna.edu.mx.
//
// Simula las mismas rutas y forma de respuesta (status, headers, HTML)
// que el portal real, sirviendo los fixtures de fixtures/html/. El código
// de scraping (lib/scraping/*.ts) no cambia nada: solo apunta a este
// servidor en vez del real cuando MOCK_ITL=true (ver lib/scraping/constants.ts).
//
// Uso: MOCK_ITL=true npm run mock:itl   (o simplemente: npm run mock:itl)

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const PORT = Number(process.env.MOCK_ITL_PORT ?? 4310);
const FIXTURES_DIR = join(process.cwd(), "fixtures", "html");
const MOCK_SESSION_ID = "mock-session-id";

async function readFixture(name) {
  try {
    return await readFile(join(FIXTURES_DIR, name), "utf-8");
  } catch {
    throw new Error(
      `Falta fixtures/html/${name}. Esa carpeta es solo para mocks locales ` +
        "(no se sube al repo) — consíguela con quien la generó.",
    );
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function sendHtml(res, status, html, headers = {}) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8", ...headers });
  res.end(html);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const { pathname } = url;

  console.log(`[mock-itl] ${req.method} ${pathname}`);

  try {
    if (pathname === "/StatusAlumno/login.aspx" && req.method === "GET") {
      return sendHtml(res, 200, await readFixture("login-form.html"));
    }

    if (pathname === "/StatusAlumno/login.aspx" && req.method === "POST") {
      const body = await readBody(req);
      const params = new URLSearchParams(body);
      const password = params.get("tbPassword") ?? "";

      // Sentinel para probar el flujo de error localmente: cualquier
      // contraseña "wrong" simula credenciales incorrectas.
      if (password === "wrong") {
        return sendHtml(res, 200, await readFixture("login-error.html"));
      }

      res.writeHead(302, {
        Location: "/StatusAlumno/alumnos/frmCargaAcademica.aspx",
        "Set-Cookie": `ASP.NET_SessionId=${MOCK_SESSION_ID}; path=/; HttpOnly`,
      });
      return res.end();
    }

    if (
      pathname === "/StatusAlumno/alumnos/frmCargaAcademica.aspx" &&
      req.method === "POST"
    ) {
      return sendHtml(res, 200, await readFixture("horario.html"));
    }

    if (
      pathname === "/StatusAlumno/alumnos/frmCargaAcademicaCal.aspx" &&
      req.method === "GET"
    ) {
      return sendHtml(res, 200, await readFixture("calificaciones.html"));
    }

    if (
      pathname === "/StatusAlumno/alumnos/frmKardex.aspx" &&
      req.method === "GET"
    ) {
      return sendHtml(res, 200, await readFixture("kardex.html"));
    }

    if (
      pathname === "/servicios/academicos/horario_materias_2020/horarios.asp" &&
      req.method === "POST"
    ) {
      return sendHtml(res, 200, await readFixture("horarios-carrera.html"));
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end(`mock-itl: sin ruta para ${req.method} ${pathname}`);
  } catch (error) {
    console.error(`[mock-itl] ${error.message}`);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(String(error.message));
  }
});

server.listen(PORT, () => {
  console.log(`[mock-itl] escuchando en http://localhost:${PORT}`);
  console.log(`[mock-itl] sirviendo fixtures desde ${FIXTURES_DIR}`);
});
