import type { Metadata } from "next";
import "./globals.css";
import { InstallCta } from "@/components/InstallCta";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TEC Laguna",
  description:
    "Aplicación no oficial para alumnos del Instituto Tecnológico de La Laguna.",
};

const THEME_INIT_SCRIPT = `
  (function () {
    try {
      var stored = localStorage.getItem("teclaguna:theme");
      var dark =
        stored === "dark" ||
        (stored !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <InstallCta />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
