"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Locale } from "@/features/cms/types";
import type { HomepageCompanyProfile } from "@/features/cms/database/repository";
import type { HomeCopy } from "./content";
import { HomeIcon } from "./visuals";

type Chapter = { id: string; label: string };

export function ChapterNavigation({ label, chapters }: { label: string; chapters: Chapter[] }) {
  const navRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(chapters[0]?.id);

  useEffect(() => {
    const home = navRef.current?.closest<HTMLElement>(".bp-home");
    const main = home?.querySelector("main");
    const header = home?.querySelector(".bp-header");
    if (!home || !main || !header) return;

    const sections = Array.from(main.querySelectorAll<HTMLElement>(".bp-chapter"));
    const pins = sections.map(section => section.querySelector<HTMLElement>(".bp-chapter-pin"));
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let active = sections[0];
    let focusedControl: HTMLElement | undefined;
    let lastPagingWheel = -Infinity;
    let wheelPaging = false;
    let queuedWheel: { direction: number; distance: number } | undefined;
    let scrollIdleTimer = 0;
    let frame = 0;

    const updateChapters = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const focused = focusedControl;
      focusedControl = undefined;

      if (motion.matches && focused === document.activeElement && focused?.matches(":focus-visible")) {
        const bounds = focused.getBoundingClientRect();
        const chapter = focused.closest(".bp-chapter");
        const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
        const coveringChapter = hit?.closest(".bp-chapter");

        // If the next card covers a newly focused control, expose the end of its chapter.
        if (coveringChapter && chapter?.nextElementSibling === coveringChapter) {
          window.scrollBy({ top: coveringChapter.getBoundingClientRect().top - viewportHeight, behavior: "instant" });
        }
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const availableHeight = Math.max(1, viewportHeight - headerBottom);
      const readingLine = headerBottom + availableHeight * .45;
      const chapterTops = sections.map(section => section.getBoundingClientRect().top);
      const pinHeights = motion.matches ? pins.map(pin => pin?.offsetHeight ?? 0) : [];
      const next = sections[chapterTops.findLastIndex(top => top <= readingLine)] ?? sections[0];
      if (next && active !== next) {
        active = next;
        setCurrent(next.id);
      }

      if (!motion.matches) return;

      pins.forEach((pin, index) => {
        if (!pin) return;

        // Let tall sections scroll to their end before they hold behind the next card.
        if (index < pins.length - 1) {
          const pinTop = `${Math.min(headerBottom, viewportHeight - pinHeights[index])}px`;
          if (pin.style.getPropertyValue("--bp-pin-top") !== pinTop) {
            pin.style.setProperty("--bp-pin-top", pinTop);
          }
        }

        const chapterTop = chapterTops[index];
        const previousDepth = pin.style.getPropertyValue("--bp-card-depth");
        if (index === 0 || chapterTop >= viewportHeight - 1 || chapterTop <= headerBottom + 1) {
          if (previousDepth) pin.style.removeProperty("--bp-card-depth");
          return;
        }

        // Hold the smaller card through the first part of the overlap, then ease to full size at the header.
        const arrival = (viewportHeight - chapterTop) / availableHeight;
        const expansionStart = .4;
        const expansion = Math.max(0, (arrival - expansionStart) / (1 - expansionStart));
        const depth = (1 - expansion * expansion * (3 - 2 * expansion)).toFixed(4);
        if (depth !== previousDepth) pin.style.setProperty("--bp-card-depth", depth);
      });
    };

    function queueUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateChapters);
    }

    function queueFocusCheck(event: FocusEvent) {
      if (event.target instanceof HTMLElement) focusedControl = event.target;
      queueUpdate();
    }

    const chapterOffset = (direction: number, distance: number) => {
      const viewportHeight = window.innerHeight;
      const headerBottom = header.getBoundingClientRect().bottom;
      const tops = sections.map(section => section.getBoundingClientRect().top);
      const index = tops.findLastIndex(top => top <= headerBottom + 1);
      const down = direction === 1;
      const neighbor = tops[index + direction];
      if (index < 0 || neighbor === undefined) return;

      const readingSpace = down ? neighbor - viewportHeight : headerBottom - tops[index];
      if (readingSpace > distance) return;

      const overflow = (pins[index]?.offsetHeight ?? 0) - (viewportHeight - headerBottom);
      const hasMoreToRead = overflow > 96 && readingSpace > 2;
      const pageOffset = down ? neighbor - headerBottom : Math.max(neighbor - headerBottom, tops[index] - viewportHeight);
      return hasMoreToRead ? direction * (readingSpace - 1) : pageOffset;
    };

    const finishScroll = () => {
      scrollIdleTimer = 0;
      wheelPaging = false;
      const nextWheel = queuedWheel;
      queuedWheel = undefined;

      if (nextWheel && motion.matches) {
        const { direction, distance } = nextWheel;
        startWheelPage(chapterOffset(direction, distance) ?? direction * distance);
        return;
      }

      header.removeAttribute("data-scrolling");
    };

    const keepHeaderCompact = () => {
      if (!header.hasAttribute("data-scrolling")) header.setAttribute("data-scrolling", "");
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(finishScroll, 140);
    };

    function startWheelPage(offset: number) {
      wheelPaging = true;
      keepHeaderCompact();
      window.scrollBy({ top: offset, behavior: "smooth" });
    }

    function trackScroll() {
      if (motion.matches) keepHeaderCompact();
      queueUpdate();
    }

    function clearQueuedWheel() {
      queuedWheel = undefined;
    }

    const pageOnWheel = (event: WheelEvent) => {
      if (!motion.matches || !event.cancelable || event.defaultPrevented || event.ctrlKey || event.shiftKey ||
          Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
      const direction = event.deltaY > 0 ? 1 : -1;
      const distance = Math.abs(event.deltaY) * unit;
      const sameGesture = event.timeStamp - lastPagingWheel < 180;

      // Let the current card land before processing a separate wheel gesture.
      if (wheelPaging || sameGesture) {
        if (wheelPaging && !sameGesture) queuedWheel = { direction, distance };
        lastPagingWheel = event.timeStamp;
        event.preventDefault();
        return;
      }

      const offset = chapterOffset(direction, distance);
      if (offset === undefined) return;
      lastPagingWheel = event.timeStamp;
      event.preventDefault();
      startWheelPage(offset);
    };

    const resetScroll = () => {
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = 0;
      wheelPaging = false;
      lastPagingWheel = -Infinity;
      clearQueuedWheel();
      header.removeAttribute("data-scrolling");
    };

    const syncMotion = () => {
      main.toggleAttribute("data-chapter-motion", motion.matches);
      if (!motion.matches) resetScroll();
      queueUpdate();
    };

    const resizeObserver = new ResizeObserver(queueUpdate);
    resizeObserver.observe(main);
    resizeObserver.observe(header);
    for (const pin of pins) if (pin) resizeObserver.observe(pin);
    motion.addEventListener("change", syncMotion);
    main.addEventListener("focusin", queueFocusCheck);
    home.addEventListener("pointerdown", clearQueuedWheel);
    home.addEventListener("wheel", pageOnWheel, { passive: false });
    window.addEventListener("scroll", trackScroll, { passive: true });
    window.addEventListener("resize", queueUpdate);
    syncMotion();

    return () => {
      window.cancelAnimationFrame(frame);
      resetScroll();
      motion.removeEventListener("change", syncMotion);
      main.removeEventListener("focusin", queueFocusCheck);
      home.removeEventListener("pointerdown", clearQueuedWheel);
      home.removeEventListener("wheel", pageOnWheel);
      window.removeEventListener("scroll", trackScroll);
      window.removeEventListener("resize", queueUpdate);
      resizeObserver.disconnect();
      main.removeAttribute("data-chapter-motion");
      for (const pin of pins) {
        pin?.style.removeProperty("--bp-pin-top");
        pin?.style.removeProperty("--bp-card-depth");
      }
    };
  }, []);

  return <nav ref={navRef} className="bp-chapter-nav" aria-label={label}>
    <ol>
      {chapters.map(chapter => <li key={chapter.id}>
        <a href={`#${chapter.id}`} aria-label={chapter.label} aria-current={current === chapter.id ? "location" : undefined}>
          <span aria-hidden="true">{chapter.label}</span>
        </a>
      </li>)}
    </ol>
  </nav>;
}

type Step = { title: string; text: string };
const stepIcons = ["message", "window", "globe"] as const;

export function UsageGuide({ steps }: { steps: [Step, Step, Step] }) {
  return <div className="bp-guide-steps">
    {steps.map((step, index) => <details key={index} name="business-guide" open={index === 0}>
      <summary>
        <span className="bp-step-icon"><HomeIcon name={stepIcons[index]} /></span>
        <span><small>{String(index + 1).padStart(2, "0")}</small><strong>{step.title}</strong></span>
        <HomeIcon name="plus" />
      </summary>
      <p>{step.text}</p>
    </details>)}
  </div>;
}

function normalizeName(value: string, locale: Locale) {
  return value.normalize("NFKC").toLocaleLowerCase(locale).replace(/ё/g, "е");
}

function companyHref(id: string, locale: Locale) {
  return "/" + encodeURIComponent(id) + "/?lang=" + locale;
}

export function Companies({ profiles, featuredIds, copy, locale }: {
  profiles: HomepageCompanyProfile[];
  featuredIds: string[];
  copy: HomeCopy["companies"];
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState(0);
  const carouselId = useId();
  const profileById = new Map(profiles.map(profile => [profile.id, profile]));
  const featured = featuredIds.flatMap(id => {
    const profile = profileById.get(id);
    return profile ? [profile] : [];
  });
  const current = featured[Math.min(position, featured.length - 1)];
  const normalized = normalizeName(query.trim(), locale);
  const visible = profiles.filter(profile => [profile.name, profile.alternateName, profile.id]
    .some(value => normalizeName(value, locale).includes(normalized)));

  function move(offset: number) {
    setPosition(index => (index + offset + featured.length) % featured.length);
  }

  function onCarouselKey(event: KeyboardEvent<HTMLDivElement>) {
    if (featured.length < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  }

  return <div className="bp-company-content">
    {current && <div className="bp-featured" role="group" aria-label={copy.featured} onKeyDown={onCarouselKey}>
      <div className="bp-featured-art" aria-hidden="true"><span>{Array.from(current.name)[0]}</span><i /><i /><i /></div>
      <div className="bp-featured-copy" id={carouselId} aria-live="polite" aria-atomic="true">
        <p className="bp-eyebrow">{copy.featured}</p>
        <h3 key={current.id}>{current.name}</h3>
        <a className="bp-button bp-button--ghost" href={companyHref(current.id, locale)}>{copy.view}<HomeIcon name="external" /></a>
      </div>
      {featured.length > 1 && <div className="bp-carousel-controls">
        <button type="button" aria-label={copy.previous} aria-controls={carouselId} onClick={() => move(-1)}><HomeIcon name="left" /></button>
        <span>{position + 1} / {featured.length}</span>
        <button type="button" aria-label={copy.next} aria-controls={carouselId} onClick={() => move(1)}><HomeIcon name="arrow" /></button>
      </div>}
    </div>}
    <div className="bp-directory">
      <div className="bp-directory-header">
        <h3>{copy.directory}</h3>
        {profiles.length > 0 && <label className="bp-search"><HomeIcon name="search" />
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label={copy.search} placeholder={copy.placeholder} />
        </label>}
      </div>
      {visible.length > 0 ? <ul className="bp-company-list">
        {visible.map(company => <li key={company.id}><a href={companyHref(company.id, locale)}>
          <span className="bp-company-initial" aria-hidden="true">{Array.from(company.name)[0]}</span>
          <strong>{company.name}</strong><HomeIcon name="external" />
        </a></li>)}
      </ul> : <p className="bp-directory-empty" role="status">{profiles.length ? copy.noMatches : copy.none}</p>}
    </div>
  </div>;
}

export function HeaderDisclosure({ label, className, icon, short, children }: {
  label: string;
  className: string;
  icon: "globe" | "menu";
  short?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (ref.current?.open && event.target instanceof Node && !ref.current.contains(event.target)) {
        ref.current.open = false;
      }
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return <details ref={ref} className={"bp-disclosure " + className}
    onKeyDown={event => {
      if (event.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        summary.current?.focus();
      }
    }}
    onBlur={event => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) {
        event.currentTarget.open = false;
      }
    }}
    onClick={event => {
      if (event.target instanceof Element && event.target.closest("a") && ref.current) ref.current.open = false;
    }}>
    <summary ref={summary} aria-label={label}><HomeIcon name={icon} />{short && <><span>{short}</span><HomeIcon name="chevron" /></>}</summary>
    {children}
  </details>;
}
