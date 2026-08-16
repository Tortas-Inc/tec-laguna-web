import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Inicia sesión con tu número de control del ITL para ver tu horario, calificaciones y kardex — o entra como invitado para simular tu horario del próximo semestre.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
