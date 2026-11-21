import { useEffect, useState } from "react";
import { fieldRecords, fieldText } from "../../field-values";
import type { FieldValues } from "../../types";
import { BlockGrid, BlockHeading } from "../shared/shared";
import type { BlockProps } from "../types";

function Metric({ item, animate, duration }: { item: FieldValues; animate: boolean; duration: number }) {
  const finalValue = Number(item.value) || 0;
  const [animation, setAnimation] = useState<{ target: number; value: number } | null>(null);

  useEffect(() => {
    if (!animate || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      setAnimation({ target: finalValue, value: Math.round(finalValue * progress) });
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [animate, duration, finalValue]);

  const value = animate && animation?.target === finalValue ? animation.value : finalValue;
  const prefix = fieldText(item.prefix) ?? "";
  const suffix = fieldText(item.suffix) ?? "";

  return (
    <article className="co-card">
      <strong className="co-metric" aria-label={`${prefix}${finalValue}${suffix}`}>{prefix}{value}{suffix}</strong>
      <p>{fieldText(item.label)}</p>
    </article>
  );
}

export function MetricsBlock({ content, options }: BlockProps) {
  const duration = Math.max(0.5, Number(options.duration) || 1.5) * 1000;

  return (
    <>
      <BlockHeading value={content.heading} />
      <BlockGrid columns={options.columns}>
        {fieldRecords(content.items).map((item, index) => (
          <Metric key={index} item={item} animate={Boolean(options.countUp)} duration={duration} />
        ))}
      </BlockGrid>
    </>
  );
}
