"use client";

import { useEffect, useState, useTransition } from "react";
import { ContentPanel } from "../content-panel/content-panel";
import { saveCompanyDraft } from "./actions";
import { useLegacyDraft } from "./draft-storage";
import { LayoutPanel } from "../layout-panel/layout-panel";
import { PagePreview } from "../page-preview/page-preview";
import { SubscriptionPanel } from "../subscription-panel/subscription-panel";
import { Toolbar } from "../toolbar/toolbar";
import { Workspace } from "../workspace/workspace";
import type { StoredCompany } from "../../database/models";
import { LOCALES, type Locale, type Snapshot } from "../../types";
import { validateLayout, validatePage } from "../../validation";

const panels = [
  { id: "content", label: "Page content", icon: "content" },
  { id: "layout", label: "Header & footer", icon: "layout" },
  { id: "plan", label: "Subscription plan", icon: "plan" },
] as const;

type Panel = (typeof panels)[number]["id"];
type View = "edit" | "preview";

function draftStatus(dirty: boolean, saved: StoredCompany) {
  if (dirty) return { label: "Unsaved changes", tone: "dirty" };
  if (saved.status === "submitted") return { label: "Submitted for review", tone: "review" };
  if (saved.savedAt) return { label: "Draft saved" };
  return saved.isPublished ? { label: "Published content", tone: "live" } : { label: "New draft" };
}

export function CompanyAdmin({ seed }: { seed: StoredCompany }) {
  const [saved, setSaved] = useState(seed);
  const [saving, startSaving] = useTransition();
  const legacyDraft = useLegacyDraft(seed.id);
  const [pending, setPending] = useState<Snapshot | null>(null);
  const [panel, setPanel] = useState<Panel>("content");
  const [locale, setLocale] = useState<Locale>(seed.sample ? "en" : "hy");
  const [selection, setSelection] = useState<Partial<Record<Locale, string>>>({});
  const [view, setView] = useState<View>("edit");
  const [mobile, setMobile] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean }>();
  const [showIssues, setShowIssues] = useState(false);
  const draft = pending ?? saved.draft;
  const { id, name, plan } = saved;
  const blocks = draft.pages[locale];
  const dirty = Boolean(pending);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function changeDraft(update: (snapshot: Snapshot) => Snapshot) {
    setPending(current => update(current ?? saved.draft));
    setMessage(undefined);
  }

  function openPanel(next: Panel) {
    if (next === panel) return;
    setPanel(next);
    setView("edit");
    window.scrollTo({ top: 0 });
  }

  function validateSubmission() {
    for (const language of LOCALES) {
      const issues = validatePage(draft.pages[language], plan);
      const [firstInvalidBlock] = Object.keys(issues);
      if (!firstInvalidBlock) continue;

      setLocale(language);
      setSelection(current => ({ ...current, [language]: firstInvalidBlock }));
      setPanel("content");
      return false;
    }

    const layoutIssues = validateLayout(draft.layout, plan);
    if (layoutIssues.length > 0) {
      const invalidLocale = LOCALES.find(language => layoutIssues.some(issue => issue.path.startsWith("text." + language + ".")));
      if (invalidLocale) setLocale(invalidLocale);
      setPanel("layout");
      return false;
    }

    return true;
  }

  function persist(submit: boolean) {
    if (saving) return;
    if (submit && !validateSubmission()) {
      setView("edit");
      setShowIssues(true);
      setMessage({ text: "Review the highlighted fields before submitting.", error: true });
      requestAnimationFrame(() => document.getElementById("cms-save-feedback")?.scrollIntoView({ block: "nearest" }));
      return;
    }

    setMessage(undefined);
    startSaving(async () => {
      try {
        const result = await saveCompanyDraft(id, saved.version, draft, submit ? "submitted" : "draft");
        if (!result.ok) {
          setMessage({ text: result.message, error: true });
          return;
        }
        setSaved(current => ({ ...current, ...result.draft, draft }));
        setPending(current => current === pending ? null : current);
        setShowIssues(false);
        setMessage({ text: submit ? "Submitted for review." : "Draft saved." });
      } catch {
        setMessage({ text: "The server could not save the draft. Your edits are still open.", error: true });
      }
    });
  }

  return (
    <Workspace scope="Company admin" title={name} description="Edit your storefront, preview changes, and submit your draft for review."
      items={[
        ...panels.map(item => ({ label: item.label, icon: item.icon, current: item.id === panel, onSelect: () => openPanel(item.id) })),
        { label: "All companies", icon: "companies", href: "/admin/", allowNavigation: () =>
          !dirty || window.confirm("Leave this workspace? Your unsaved changes will be lost.") },
        ...(saved.isPublished ? [{ label: "View public page", icon: "external" as const, href: "/" + id + "/", external: true }] : []),
      ]}>
      {panel === "plan" ? <SubscriptionPanel currentPlan={plan} /> : (
        <>
          <Toolbar
            locale={locale}
            changeLocale={setLocale}
            status={saving ? { label: "Saving…" } : draftStatus(dirty, saved)}
            saving={saving}
            saveDraft={() => persist(false)}
            submitForReview={() => persist(true)}
          />
          {!saved.savedAt && legacyDraft && !pending && (
            <div className="cms-message">
              <span>A previous draft is available in this browser.</span>
              <button type="button" onClick={() => {
                setPending(legacyDraft);
                setMessage({ text: "Browser draft loaded. Select Save draft to keep it." });
              }}>Load previous draft</button>
            </div>
          )}
          {message && <div id="cms-save-feedback" className="cms-message" data-error={message.error}
            role={message.error ? "alert" : "status"}>{message.text}</div>}
          <div className="cms-view-switch" role="group" aria-label="Editor view">
            <button type="button" aria-pressed={view === "edit"} onClick={() => setView("edit")}>Edit</button>
            <button type="button" aria-pressed={view === "preview"} onClick={() => setView("preview")}>Preview</button>
          </div>
          <div className="cms-workspace" data-view={view}>
            <section className="cms-editor" aria-label={panel === "content" ? "Page content" : "Header and footer"}>
              {panel === "content" ? (
                <ContentPanel
                  key={locale}
                  blocks={blocks}
                  plan={plan}
                  selectedId={selection[locale] ?? ""}
                  issues={showIssues ? validatePage(blocks, plan) : {}}
                  onSelect={selectedId => setSelection(current => ({ ...current, [locale]: selectedId }))}
                  onChange={next => changeDraft(current => ({ ...current, pages: { ...current.pages, [locale]: next } }))}
                />
              ) : (
                <LayoutPanel
                  layout={draft.layout}
                  locale={locale}
                  plan={plan}
                  issues={showIssues ? validateLayout(draft.layout, plan) : []}
                  onChange={update => changeDraft(current => ({ ...current, layout: update(current.layout) }))}
                  onError={text => setMessage({ text, error: true })}
                />
              )}
            </section>
            <PagePreview companyId={id} draft={draft} plan={plan} locale={locale} changeLocale={setLocale} mobile={mobile} setMobile={setMobile} />
          </div>
        </>
      )}
    </Workspace>
  );
}
