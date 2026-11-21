import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { BlockImage, BlockLink } from "../../blocks/shared/shared";
import { companyLabels } from "../../locale-labels";
import { safeHref } from "../../safe";
import { LOCALES, LOCALE_LABEL, type LayoutSettings, type LayoutText, type Locale } from "../../types";

interface CompanyHeaderProps {
  layout: LayoutSettings;
  navigation: LayoutText["nav"];
  locale: Locale;
  changeLocale: (locale: Locale) => void;
  scrollContainer?: RefObject<HTMLDivElement | null>;
}

export function CompanyHeader({ layout, navigation, locale, changeLocale, scrollContainer }: CompanyHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const settings = layout.text[locale];
  const menuLabel = companyLabels[locale].menu;
  const hasMenu = navigation.length > 0 || Boolean(settings.ctaLabel && safeHref(settings.ctaHref));

  useEffect(() => {
    const scrollbox = scrollContainer?.current;
    const source = scrollbox ?? window;
    const position = () => Math.max(0, scrollbox?.scrollTop ?? window.scrollY);
    let previous = position();
    let turn = previous;
    let direction = 0;
    let frame = 0;

    function update() {
      frame = 0;
      const current = position();
      const nextDirection = Math.sign(current - previous);
      if (nextDirection !== 0 && nextDirection !== direction) {
        direction = nextDirection;
        turn = previous;
      }
      previous = current;

      if (menuOpen || current <= 24 || (direction < 0 && turn - current >= 14)) {
        setHidden(false);
      } else if (direction > 0 && current > (header.current?.offsetHeight ?? 84) && current - turn >= 32) {
        setHidden(true);
      }
    }

    function scroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    source.addEventListener("scroll", scroll, { passive: true });
    return () => {
      source.removeEventListener("scroll", scroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [menuOpen, scrollContainer]);

  useEffect(() => {
    if (!menuOpen) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setMenuOpen(false);
    }
    const observer = new ResizeObserver(() => {
      if (!toggle.current || getComputedStyle(toggle.current).display === "none") setMenuOpen(false);
    });
    if (header.current?.parentElement) observer.observe(header.current.parentElement);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      observer.disconnect();
    };
  }, [menuOpen]);

  function closeMenu() {
    if (menuOpen) toggle.current?.focus({ preventScroll: true });
    setMenuOpen(false);
    setHidden(false);
  }

  return (
    <header ref={header} className="co-header" data-hidden={hidden} data-menu-open={menuOpen} onKeyDown={event => {
      if (event.key === "Escape" && menuOpen) {
        event.preventDefault();
        closeMenu();
      }
    }}>
      <div className="co-header-inner">
        <a className="co-brand" href="#company-top" onClick={() => { setMenuOpen(false); setHidden(false); }}>
          <BlockImage source={layout.logoUrl} alt={layout.logoAlt} />
          <span>{settings.displayName}</span>
        </a>
        {hasMenu && <button ref={toggle} className="co-menu-toggle" aria-label={menuLabel} aria-expanded={menuOpen} aria-controls={menuId} type="button" onClick={() => {
          setHidden(false);
          setMenuOpen(open => !open);
        }}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>}
        <div className="co-header-nav" id={menuId}>
          <nav aria-label={menuLabel} onClick={event => {
            if (event.target instanceof Element && event.target.closest("a")) closeMenu();
          }}>
            {navigation.map(item => <a key={item.anchor} href={"#" + item.anchor}>{item.label}</a>)}
            <div className="co-mobile-cta"><BlockLink to={settings.ctaHref} button>{settings.ctaLabel}</BlockLink></div>
          </nav>
        </div>
        <div className="co-header-actions">
          <div className="co-languages">
            {LOCALES.map(language => (
              <button key={language} type="button" lang={language} aria-pressed={locale === language} onClick={() => { setMenuOpen(false); setHidden(false); changeLocale(language); }}>
                {LOCALE_LABEL[language]}
              </button>
            ))}
          </div>
          <BlockLink to={settings.ctaHref} button>{settings.ctaLabel}</BlockLink>
        </div>
      </div>
    </header>
  );
}
