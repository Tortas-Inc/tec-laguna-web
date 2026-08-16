export function PageHeader({
  title,
  subtitle,
  children,
  stickyOnMobile = true,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  // Cuando el header trae contenido pesado (filtros, botones) en
  // `children`, fijarlo también en mobile deja muy poco espacio para lo
  // que hay debajo en pantallas chicas — en esos casos conviene que en
  // mobile todo el bloque scrollee normal y solo quede fijo desde `sm:`.
  stickyOnMobile?: boolean;
}) {
  return (
    <div
      className={`${stickyOnMobile ? "sticky" : "static sm:sticky"} top-0 z-10 -mx-4 bg-background px-4 pb-5.5 pt-5 sm:-mx-9 sm:px-9 sm:pt-7.5`}
    >
      <h1 className="text-[28px] font-bold text-brand-black">{title}</h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-brand-gray">{subtitle}</p>
      ) : null}
      {children ? <div className="mt-4.5">{children}</div> : null}
    </div>
  );
}
