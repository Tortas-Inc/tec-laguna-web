"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

export function CountUp({
  value,
  decimals = 0,
}: {
  value: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    if (prefersReducedMotion) {
      node.textContent = value.toFixed(decimals);
      return;
    }

    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        node.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefersReducedMotion]);

  return <span ref={ref}>0</span>;
}
