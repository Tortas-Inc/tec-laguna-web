import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InstallCta } from "@/components/InstallCta";
import { Providers } from "./providers";

const SITE_URL = "https://tec-laguna-app.com";
const SITE_DESCRIPTION =
  "Aplicación no oficial para alumnos del Instituto Tecnológico de La Laguna: consulta tu horario, calificaciones y kardex, y simula tu horario del próximo semestre.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TEC Laguna",
    template: "%s · TEC Laguna",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "TEC Laguna",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "TEC Laguna",
    locale: "es_MX",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "TEC Laguna",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#c38451",
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
        {/* iOS Safari solo reconoce el prefijo "apple-" (el estándar
            "mobile-web-app-capable" que genera metadata.appleWebApp llegó
            hasta Safari 16.4) — se agrega a mano para cubrir versiones
            previas de iOS. */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <InstallCta />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
