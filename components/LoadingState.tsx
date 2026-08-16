import { Loader2 } from "lucide-react";

export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-tint text-brand-primary-dark">
        <Loader2
          className="h-6 w-6 motion-safe:animate-spin"
          strokeWidth={2}
        />
      </div>
      <div className="text-sm font-semibold text-brand-gray">{label}</div>
    </div>
  );
}
