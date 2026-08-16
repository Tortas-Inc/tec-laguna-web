import { ITL_SESSION_COOKIE } from "@/lib/scraping/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const sessionId = (await cookies()).get(ITL_SESSION_COOKIE)?.value;
  redirect(sessionId ? "/horario" : "/login");
}
