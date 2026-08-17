"use client";

import Lottie from "lottie-react";
import astronautAnimation from "@/public/lottie/astronaut.json";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-brand-gray-lighter px-6 py-10 text-center">
      <Lottie
        animationData={astronautAnimation}
        loop
        autoplay
        className="h-56 w-56"
      />
      <div className="text-base font-bold text-brand-black">{title}</div>
      {description ? (
        <p className="max-w-[320px] text-sm text-brand-gray">{description}</p>
      ) : null}
    </div>
  );
}
