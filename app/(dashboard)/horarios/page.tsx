import { PageHeader } from "@/components/PageHeader";

export default function HorariosPorCarreraPage() {
  return (
    <>
      <PageHeader
        title="Horarios por carrera"
        subtitle="Consulta los horarios disponibles por especialidad"
      />
      <p className="text-sm text-brand-gray">
        Próximamente: buscador y tarjetas por materia (issue #25, sección 8).
      </p>
    </>
  );
}
