import { fetchCalificaciones } from "@/lib/scraping/calificaciones";
import { ITL_SESSION_COOKIE } from "@/lib/scraping/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionId = (await cookies()).get(ITL_SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const data = await fetchCalificaciones(sessionId);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "No pudimos conectar con el portal escolar" },
      { status: 502 },
    );
  }
}
