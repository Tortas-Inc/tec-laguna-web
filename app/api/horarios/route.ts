import { ITL_SESSION_COOKIE } from "@/lib/scraping/constants";
import {
  fetchHorariosCarreraHtml,
  parseHorariosCarrera,
} from "@/lib/scraping/horarios-carrera";
import { fetchKardex } from "@/lib/scraping/kardex";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const especialidad = request.nextUrl.searchParams.get("especialidad");
  if (!especialidad) {
    return NextResponse.json(
      { error: "Falta el parámetro especialidad" },
      { status: 400 },
    );
  }

  try {
    const html = await fetchHorariosCarreraHtml(especialidad);

    // Endpoint público del ITL, no requiere sesión — pero si el alumno
    // está logueado, aprovechamos para marcar isFinished cruzando con su
    // kardex (sin persistir nada, se resuelve en la misma request).
    let clavesCursadas: string[] = [];
    const sessionId = (await cookies()).get(ITL_SESSION_COOKIE)?.value;
    if (sessionId) {
      try {
        const kardex = await fetchKardex(sessionId);
        clavesCursadas = kardex.materias.map((m) => m.clave);
      } catch {
        // Sesión inválida/expirada: seguimos sin marcar materias cursadas.
      }
    }

    const materias = parseHorariosCarrera(html, clavesCursadas);
    return NextResponse.json({ materias });
  } catch {
    return NextResponse.json(
      { error: "No pudimos conectar con el portal escolar" },
      { status: 502 },
    );
  }
}
