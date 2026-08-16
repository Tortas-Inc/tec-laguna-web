import { loginToItl } from "@/lib/scraping/login";
import { ITL_SESSION_COOKIE } from "@/lib/scraping/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const controlNumber = body?.controlNumber;
  const password = body?.password;

  if (typeof controlNumber !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Número de control y contraseña son requeridos" },
      { status: 400 },
    );
  }

  let result;
  try {
    result = await loginToItl(controlNumber, password);
  } catch {
    return NextResponse.json(
      { error: "No se pudo contactar con el portal escolar" },
      { status: 502 },
    );
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ITL_SESSION_COOKIE, result.sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res;
}
