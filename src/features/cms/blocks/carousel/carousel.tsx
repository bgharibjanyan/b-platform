import { useEffect, useState, type KeyboardEvent } from "react";
import { fieldRecords, fieldText } from "../../field-values";
import { BlockHeading, BlockImage, BlockLink } from "../shared/shared";
import type { BlockProps } from "../types";

function moveSlide(index: number, count: number, loop: boolean): number {
  return loop ? (index + count) % count : Math.min(Math.max(index, 0), count - 1);
}

export function CarouselBlock({ content, options }: BlockProps) {
  const slides = fieldRecords(content.slides);
  const [selected, select] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const count = slides.length;
  const current = Math.min(selected, Math.max(0, count - 1));
  const autoplay = Boolean(options.autoplay);
  const loop = Boolean(options.loop);
  const delay = Math.min(20, Math.max(2, Number(options.delay) || 5)) * 1000;

  useEffect(() => {
    if (!autoplay || paused || hovered || focused || count < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => select(index => moveSlide(index + 1, count, loop)), delay);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, hovered, focused, count, loop, delay]);

  const slide = slides[current];
  if (!slide) return <BlockHeading value={content.heading} />;

  function move(direction: -1 | 1) {
    select(moveSlide(current + direction, count, loop));
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (count < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;

    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  }

  return (
    <>
      <BlockHeading value={content.heading} />
      <div className="co-carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)} onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }} onKeyDown={handleKey}>
        <BlockImage source={slide.image} alt={slide.alt} style={{ aspectRatio: "16/8" }} />
        <p>{fieldText(slide.caption)}</p>
        <BlockLink to={slide.actionHref}>{fieldText(slide.actionLabel)}</BlockLink>
        {count > 1 && (
          <div className="co-controls">
            {Boolean(options.arrows) && (
              <>
                <button type="button" onClick={() => move(-1)} disabled={!loop && current === 0}>Previous</button>
                <button type="button" onClick={() => move(1)} disabled={!loop && current === count - 1}>Next</button>
              </>
            )}
            {Boolean(options.dots) && slides.map((_, index) => (
              <button type="button" key={index} aria-pressed={index === current} aria-label={`Slide ${index + 1}`} onClick={() => select(index)}>
                {index + 1}
              </button>
            ))}
            {autoplay && <button type="button" onClick={() => setPaused(!paused)}>{paused ? "Play" : "Pause"}</button>}
          </div>
        )}
      </div>
    </>
  );
}
