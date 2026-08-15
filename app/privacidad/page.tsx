import { BackButton } from "@/components/BackButton";

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-2xl px-9 py-10">
      <div className="mb-5">
        <BackButton />
      </div>

      <h1 className="text-[28px] font-bold text-brand-black">
        Aviso de privacidad
      </h1>
      <p className="mt-1 text-sm text-brand-gray">
        Borrador — pendiente de revisión legal
      </p>

      <div className="mt-6 rounded-xl border border-brand-primary/[0.22] bg-brand-primary-tint px-5 py-4 text-[15px] leading-relaxed text-brand-primary-dark">
        <b>Esta aplicación web es un proyecto independiente</b> creado por y
        para estudiantes del ITL. No es un producto oficial, no está
        afiliada, respaldada ni desarrollada por el ITL ni el TecNM.
      </div>

      <div className="mt-6">
        <h4 className="mb-1.5 text-base font-bold text-brand-black">
          ¿Dónde se guardan tus datos?
        </h4>
        <p className="text-sm leading-relaxed text-brand-gray">
          En ningún servidor ni base de datos propia. Tu número de control y
          contraseña se envían directamente al portal del ITL para
          autenticarte; nuestro servidor solo actúa como intermediario
          técnico y no los almacena. Tu horario, calificaciones y kardex
          tampoco se guardan — se piden al portal cada vez que los consultas.
        </p>
      </div>

      <div className="mt-5">
        <h4 className="mb-1.5 text-base font-bold text-brand-black">
          ¿Comparten mi información?
        </h4>
        <p className="text-sm leading-relaxed text-brand-gray">
          No. Usamos analítica anónima para entender el uso general de la
          app, nunca vinculada a tu número de control.
        </p>
      </div>
    </main>
  );
}
