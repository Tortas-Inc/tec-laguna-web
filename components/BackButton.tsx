"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-sm font-semibold text-brand-gray transition-colors duration-150 hover:text-brand-primary-dark"
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={1.7} />
      Volver
    </button>
  );
}
