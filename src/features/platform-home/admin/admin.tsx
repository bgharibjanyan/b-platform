"use client";

import { useActionState, useState } from "react";
import { AdminIcon, Workspace } from "@/features/cms/admin/workspace/workspace";
import type { HomepageCompanyProfile } from "@/features/cms/database/repository";
import type { Locale } from "@/features/cms/types";
import { HOME_LANGUAGES, HOME_LOCALES, HOME_SECTIONS, HOME_SECTION_LABELS, MAX_FEATURED, homeFields, type HomeCopy, type HomeSettings } from "../content";
import { publishHomepageCopy, publishHomepageSettings, type HomeSaveResult } from "./actions";
import "./admin.css";

type Translation = { version: number; copy: HomeCopy };
type Settings = { version: number; settings: HomeSettings };
type FormState = { version: number; result: HomeSaveResult | null };

function Feedback({ result }: { result: HomeSaveResult | null }) {
  if (!result) return null;
  return <p className="cms-message" data-error={!result.ok} role={result.ok ? "status" : "alert"}>{result.message}</p>;
}

function TranslationForm({ locale, saved, hidden }: { locale: Locale; saved: Translation; hidden: boolean }) {
  const [copy, setCopy] = useState(saved.copy);
  const [{ result }, save, pending] = useActionState<FormState, FormData>(async ({ version }, form) => {
    const result = await publishHomepageCopy(locale, version, form);
    return { result, version: result.ok ? result.version : version };
  }, { result: null, version: saved.version });

  return <form action={save} noValidate className="hp-admin-form" hidden={hidden} aria-busy={pending}>
    <div className="hp-admin-form-title">
      <div><h2>Homepage in <span lang={locale}>{HOME_LANGUAGES[locale].name}</span></h2><p>Publish to update this language on the public homepage.</p></div>
      <a href={HOME_LANGUAGES[locale].path} target="_blank" rel="noreferrer">View live page <AdminIcon name="external" /></a>
    </div>
    {HOME_SECTIONS.map(section => {
      const values: Record<string, string> = copy[section];
      return <details className="hp-admin-section" key={section} open={section === "hero"}>
        <summary>{HOME_SECTION_LABELS[section]} <AdminIcon name="down" /></summary>
        <div className="hp-admin-fields">
          {homeFields(section).map(({ field, label, maxLength, multiline }) => {
            const attributes = {
              name: section + "." + field, value: values[field], required: true, maxLength,
              lang: locale, readOnly: pending,
              onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const value = event.target.value;
                setCopy(current => ({ ...current, [section]: { ...current[section], [field]: value } }));
              },
            };
            return <label key={field} data-wide={multiline}>{label}
              {multiline ? <textarea rows={3} {...attributes} /> : <input type="text" {...attributes} />}
            </label>;
          })}
        </div>
      </details>;
    })}
    <div className="hp-admin-save"><Feedback result={result} /><button className="cms-primary" type="submit" disabled={pending}>{pending ? "Publishing…" : "Publish translation"}</button></div>
  </form>;
}

function FeaturedSettings({ saved, companies, hidden }: { saved: Settings; companies: HomepageCompanyProfile[]; hidden: boolean }) {
  const [email, setEmail] = useState(saved.settings.contactEmail);
  const [picked, setPicked] = useState(saved.settings.featuredIds);
  const [choice, setChoice] = useState("");
  const [{ result }, save, pending] = useActionState<FormState, FormData>(async ({ version }, form) => {
    const result = await publishHomepageSettings(version, form);
    return { result, version: result.ok ? result.version : version };
  }, { result: null, version: saved.version });

  const names = new Map(companies.map(company => [company.id, company.name]));
  const available = companies.filter(company => !picked.includes(company.id));

  function move(index: number, offset: number) {
    const destination = index + offset;
    const next = [...picked];
    [next[index], next[destination]] = [next[destination], next[index]];
    setPicked(next);
  }

  return <form action={save} noValidate className="hp-admin-form" hidden={hidden} aria-busy={pending}>
    <div className="hp-admin-form-title"><div><h2>Shared homepage settings</h2><p>These settings apply to all three languages.</p></div></div>
    <div className="hp-admin-settings">
      <label>Subscription email
        <input name="contactEmail" type="email" required maxLength={254} value={email} readOnly={pending} onChange={event => setEmail(event.target.value)} />
      </label>
      <p>Plan and subscription buttons open a message to this address.</p>
    </div>
    <div className="hp-admin-settings">
      <h3>Featured companies</h3>
      <p>Choose up to {MAX_FEATURED} published companies and arrange them in the order they should appear.</p>
      {picked.length > 0 && <ol className="hp-featured-list">
        {picked.map((id, index) => {
          const name = names.get(id) ?? "Company " + id + " · no longer public";
          return <li key={id}>
            <input name="featuredId" type="hidden" value={id} />
            <strong>{name}</strong>
            <div className="hp-featured-actions">
              <button type="button" aria-label={"Move " + name + " up"} disabled={pending || index === 0} onClick={() => move(index, -1)}><AdminIcon name="up" /></button>
              <button type="button" aria-label={"Move " + name + " down"} disabled={pending || index === picked.length - 1} onClick={() => move(index, 1)}><AdminIcon name="down" /></button>
              <button type="button" aria-label={"Remove " + name} disabled={pending} onClick={() => setPicked(current => current.filter(item => item !== id))}><AdminIcon name="close" /></button>
            </div>
          </li>;
        })}
      </ol>}
      <div className="hp-admin-add">
        <label><span className="admin-sr-only">Choose a published company</span>
          <select value={choice} disabled={pending || picked.length >= MAX_FEATURED || available.length === 0} onChange={event => setChoice(event.target.value)}>
            <option value="">{available.length ? "Choose a published company" : "No more published companies"}</option>
            {available.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}
          </select>
        </label>
        <button type="button" disabled={pending || !choice || picked.length >= MAX_FEATURED} onClick={() => { setPicked(current => [...current, choice]); setChoice(""); }}>Add to showcase</button>
      </div>
    </div>
    <div className="hp-admin-save"><Feedback result={result} /><button className="cms-primary" type="submit" disabled={pending}>{pending ? "Publishing…" : "Publish settings"}</button></div>
  </form>;
}

export function HomepageAdmin({ translations, shared, companies }: {
  translations: Record<Locale, Translation>;
  shared: Settings;
  companies: HomepageCompanyProfile[];
}) {
  const [active, setActive] = useState<Locale | "settings">("hy");

  return <Workspace scope="Platform admin" title="Homepage & translations" description="Edit the homepage in Armenian, English, or Russian and curate the companies it features."
    items={[
      { label: "Companies", icon: "companies", href: "/admin/" },
      { label: "Homepage & translations", icon: "content", href: "/admin/homepage/", current: true },
      { label: "View B Platform", icon: "external", href: "/", external: true },
    ]}>
    <div className="hp-admin-switcher" role="group" aria-label="Homepage editor">
      {HOME_LOCALES.map(locale => <button key={locale} type="button" lang={locale} aria-pressed={active === locale} onClick={() => setActive(locale)}>{HOME_LANGUAGES[locale].name}</button>)}
      <button type="button" aria-pressed={active === "settings"} onClick={() => setActive("settings")}>Shared settings</button>
    </div>
    {HOME_LOCALES.map(locale => <TranslationForm key={locale} locale={locale} saved={translations[locale]} hidden={active !== locale} />)}
    <FeaturedSettings saved={shared} companies={companies} hidden={active !== "settings"} />
  </Workspace>;
}
