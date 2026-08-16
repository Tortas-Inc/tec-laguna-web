export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-5.5 bg-background px-4 pt-5 sm:-mx-9 sm:px-9 sm:pt-7.5">
      <h1 className="text-[28px] font-bold text-brand-black">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-brand-gray">{subtitle}</p>
      ) : null}
    </div>
  );
}
