import type { Metadata } from "next";
import "./globals.css";
import { InstallCta } from "@/components/InstallCta";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TEC Laguna",
  description:
    "App no oficial para alumnos del Instituto Tecnológico de La Laguna.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <InstallCta />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
