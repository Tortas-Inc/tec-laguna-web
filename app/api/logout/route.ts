import { ITL_SESSION_COOKIE } from "@/lib/scraping/constants";
import { NextResponse } from "next/server";

// El botón "Cerrar sesión" solo navegaba a /login sin borrar la cookie
// httpOnly itl_session — el navegador no puede borrarla por JS (por eso
// es httpOnly), así que hace falta este endpoint server-side.
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ITL_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
