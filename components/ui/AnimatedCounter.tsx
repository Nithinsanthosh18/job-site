"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  target,
  suffix = "",
  active,
}: {
  target: number;
  suffix?: string;
  active: boolean;
}) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);

  return (
    <span className="font-display text-4xl md:text-5xl text-gradient-gold">
      {value}
      {suffix}
    </span>
  );
}
