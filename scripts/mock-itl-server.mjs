#!/usr/bin/env node
// Mock server del portal ITL para desarrollo local, sin depender de
// apps2.itlalaguna.edu.mx / apps.itlalaguna.edu.mx.
//
// Simula las mismas rutas y forma de respuesta (status, headers, HTML)
// que el portal real, sirviendo el HTML de mocks/html/. El código
// de scraping (lib/scraping/*.ts) no cambia nada: solo apunta a este
// servidor en vez del real cuando MOCK_ITL=true (ver lib/scraping/constants.ts).
//
// Uso: MOCK_ITL=true npm run mock:itl   (o simplemente: npm run mock:itl)

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const PORT = Number(process.env.MOCK_ITL_PORT ?? 4310);
const MOCKS_DIR = join(process.cwd(), "mocks", "html");
const MOCK_SESSION_ID = "mock-session-id";

async function readMock(name) {
  try {
    return await readFile(join(MOCKS_DIR, name), "utf-8");
  } catch {
    throw new Error(
      `Falta mocks/html/${name}. Corre este script desde la raíz del repo.`,
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
      return sendHtml(res, 200, await readMock("login-form.html"));
    }

    if (pathname === "/StatusAlumno/login.aspx" && req.method === "POST") {
      const body = await readBody(req);
      const params = new URLSearchParams(body);
      const password = params.get("tbPassword") ?? "";

      // Sentinel para probar el flujo de error localmente: cualquier
      // contraseña "wrong" simula credenciales incorrectas.
      if (password === "wrong") {
        return sendHtml(res, 200, await readMock("login-error.html"));
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
      return sendHtml(res, 200, await readMock("horario.html"));
    }

    if (
      pathname === "/StatusAlumno/alumnos/frmCargaAcademicaCal.aspx" &&
      req.method === "GET"
    ) {
      return sendHtml(res, 200, await readMock("calificaciones.html"));
    }

    if (
      pathname === "/StatusAlumno/alumnos/frmKardex.aspx" &&
      req.method === "GET"
    ) {
      return sendHtml(res, 200, await readMock("kardex.html"));
    }

    if (pathname === "/horarios/login.aspx" && req.method === "GET") {
      return sendHtml(res, 200, await readMock("horarios-consulta-vacia.html"));
    }

    if (pathname === "/horarios/login.aspx" && req.method === "POST") {
      const body = await readBody(req);
      const plan = new URLSearchParams(body).get("ddlPlan") || "1";
      let html = await readMock("horarios-carrera.html");

      // El mock solo tiene un catálogo fijo (el de Sistemas Computacionales,
      // "1", cruzado con mocks/html/kardex.html para probar isFinished) —
      // para cualquier otra carrera se marca cada materia con el plan
      // pedido, así se nota en el navegador que sí varía según la carrera
      // elegida (antes siempre devolvía lo mismo sin importar el ddlPlan).
      if (plan !== "1") {
        html = html.replace(
          /(<td>)([A-ZÁÉÍÓÚÑ0-9 ]+)(<\/td><td><span class="hh">)/g,
          (_match, open, materia, close) =>
            `${open}${materia} · Plan ${plan}${close}`,
        );
      }

      return sendHtml(res, 200, html);
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
  console.log(`[mock-itl] sirviendo mocks desde ${MOCKS_DIR}`);
});
