export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5.5">
      <h1 className="text-[22px] font-bold text-brand-black">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-[12.5px] text-brand-gray">{subtitle}</p>
      ) : null}
    </div>
  );
}
