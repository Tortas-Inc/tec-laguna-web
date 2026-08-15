import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-brand-gray-lighter px-6 py-14 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gray-lighter text-brand-gray-light">
        <Icon className="h-6 w-6" strokeWidth={1.7} />
      </div>
      <div className="text-base font-bold text-brand-black">{title}</div>
      {description ? (
        <p className="max-w-[320px] text-sm text-brand-gray">{description}</p>
      ) : null}
    </div>
  );
}
