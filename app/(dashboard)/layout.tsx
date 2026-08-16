import { DashboardShell } from "@/components/DashboardShell";
import { ITL_SESSION_COOKIE } from "@/lib/scraping/constants";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = Boolean((await cookies()).get(ITL_SESSION_COOKIE)?.value);

  return <DashboardShell isLoggedIn={isLoggedIn}>{children}</DashboardShell>;
}
