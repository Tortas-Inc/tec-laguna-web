import { CountUp } from "@/components/CountUp";

export function StatTile({
  label,
  value,
  decimals = 0,
}: {
  label: string;
  value: number;
  decimals?: number;
}) {
  return (
    <div className="min-w-[150px] rounded-xl border border-brand-primary/[0.22] bg-brand-primary-tint px-4.5 py-3.5 transition-[transform,box-shadow] duration-200 ease-out motion-safe:hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(195,132,81,0.35)]">
      <div className="text-xs font-semibold uppercase tracking-[0.04em] text-brand-primary-dark">
        {label}
      </div>
      <div className="mt-1 text-[32px] font-bold tabular-nums text-brand-primary-dark">
        <CountUp value={value} decimals={decimals} />
      </div>
    </div>
  );
}
