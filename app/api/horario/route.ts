import { ITL_SESSION_COOKIE } from "@/lib/scraping/constants";
import { fetchHorario } from "@/lib/scraping/horario";
import { SessionExpiredError } from "@/lib/scraping/session-expired-error";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionId = (await cookies()).get(ITL_SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const data = await fetchHorario(sessionId);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof SessionExpiredError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "No pudimos conectar con el portal escolar" },
      { status: 502 },
    );
  }
}
