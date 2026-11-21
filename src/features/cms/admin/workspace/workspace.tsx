"use client";

import Link from "next/link";
import { useEffect, useId, useRef, type ReactNode } from "react";

const icons = {
  companies: "M3 21h18M5 21V9l7-4 7 4v12M9 21v-5h6v5M9 11h.01M15 11h.01",
  content: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5",
  layout: "M4 5h16v14H4zM4 9h16M4 15h16",
  plan: "M3 6h18v12H3zM3 10h18M7 14h3",
  external: "M13 5h6v6m0-6-8 8m6 0v6H5V7h6",
  menu: "M4 6h16v12H4zM14 6v12M7 10h4m-4 4h4",
  close: "m6 6 12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  search: "m16 16 4 4M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  up: "m6 14 6-6 6 6",
  down: "m6 10 6 6 6-6",
  arrow: "M5 12h14m-5-5 5 5-5 5",
} as const;

type IconName = keyof typeof icons;

export function AdminIcon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[name]} /></svg>;
}

type NavigationItem = {
  label: string;
  icon: IconName;
  current?: boolean;
} & (
  | { href: string; external?: boolean; allowNavigation?: () => boolean }
  | { onSelect: () => void }
);

function Navigation({ scope, items, close }: { scope: string; items: NavigationItem[]; close?: () => void }) {
  return (
    <nav className="admin-rail" aria-label={scope + " navigation"}>
      <div className="admin-rail-brand">
        <span className="admin-mark" aria-hidden="true">B</span>
        <div><strong>B Platform</strong><small>{scope}</small></div>
      </div>
      <ul>
        {items.map(item => {
          const label = <><AdminIcon name={item.icon} /><span>{item.label}</span></>;
          return (
            <li key={item.label}>
              {"href" in item ? (
                <Link href={item.href} aria-current={item.current ? "page" : undefined}
                  target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={item.external ? close : undefined}
                  onNavigate={event => {
                    if (item.allowNavigation && !item.allowNavigation()) event.preventDefault();
                    else close?.();
                  }}>
                  {label}{item.external && <span className="admin-sr-only"> (opens in a new tab)</span>}
                </Link>
              ) : (
                <button type="button" aria-current={item.current ? "true" : undefined} onClick={() => { close?.(); item.onSelect(); }}>{label}</button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Workspace({ scope, title, description, items, action, children }: {
  scope: string;
  title: string;
  description: string;
  items: NavigationItem[];
  action?: ReactNode;
  children: ReactNode;
}) {
  const drawer = useRef<HTMLDialogElement>(null);
  const drawerId = useId();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1061px)");
    const closeOnDesktop = () => { if (desktop.matches) drawer.current?.close(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div className="cms-shell admin-shell">
      <div className="admin-workspace">
        <header className="admin-header">
          <div className="admin-header-copy">
            <span className="admin-scope">{scope}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <button type="button" className="admin-menu-button" aria-label="Admin menu" aria-haspopup="dialog" aria-controls={drawerId} onClick={() => drawer.current?.showModal()}>
            <AdminIcon name="menu" /><span>Menu</span>
          </button>
          {action && <div className="admin-header-action">{action}</div>}
        </header>
        <aside className="admin-sidebar"><Navigation scope={scope} items={items} /></aside>
        <main className="admin-main">{children}</main>
      </div>
      <dialog id={drawerId} ref={drawer} className="admin-drawer" aria-label={scope + " menu"} onClick={event => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
        <div className="admin-drawer-inner">
          <button type="button" className="admin-drawer-close" aria-label="Close menu" onClick={() => drawer.current?.close()}><AdminIcon name="close" /></button>
          <Navigation scope={scope} items={items} close={() => drawer.current?.close()} />
        </div>
      </dialog>
    </div>
  );
}
