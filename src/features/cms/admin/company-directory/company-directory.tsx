"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import type { CompanyDirectoryEntry } from "../../database/models";
import { PLANS, PLAN_INFO } from "../../plans";
import { AdminIcon, Workspace } from "../workspace/workspace";
import { manageCompany, type CompanyActionState } from "./company-actions";
import "./company-directory.css";

type Operation =
  | { kind: "create" }
  | { kind: "update" | "delete"; company: CompanyDirectoryEntry };

const dialogCopy = {
  create: { title: "Add company", action: "Add company", pending: "Adding…" },
  update: { title: "Company settings", action: "Save changes", pending: "Saving…" },
  delete: { title: "Delete company?", action: "Delete company", pending: "Deleting…" },
};

function CompanyDialog({ operation, onClose, onSuccess }: {
  operation: Operation;
  onClose: () => void;
  onSuccess: (result: NonNullable<CompanyActionState>) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const company = operation.kind === "create" ? undefined : operation.company;
  const [name, setName] = useState(company?.name ?? "");
  const [plan, setPlan] = useState(company?.plan ?? "4");
  const [state, submit, pending] = useActionState(async (previous: CompanyActionState, form: FormData) => {
    try {
      const result = await manageCompany(operation.kind, company?.id ?? null, previous, form);
      if (result && !result.error) {
        onSuccess(result);
        dialog.current?.close();
      }
      return result;
    } catch {
      return { error: true, message: "The server could not save this change. Try again." };
    }
  }, null);
  const copy = dialogCopy[operation.kind];
  const deleting = operation.kind === "delete";

  useEffect(() => {
    const current = dialog.current;
    current?.showModal();
    current?.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    return () => current?.close();
  }, []);

  return (
    <dialog className="admin-dialog" ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId}
      onClose={event => { if (!event.currentTarget.open) onClose(); }}
      onCancel={event => { if (pending) event.preventDefault(); }}>
      <form className="company-directory-form" action={submit} aria-busy={pending}>
        <div className="admin-dialog-header">
          <div>
            <h2 id={titleId}>{copy.title}</h2>
            <p id={descriptionId}>{deleting
              ? <>This removes <strong>{company?.name}</strong> from the directory and hides its public page. Its revision history is kept.</>
              : company ? "Update the directory name and subscription plan. To rename the storefront, edit Display name under Header & footer." : "Set the company name and plan. You can build its public page in the CMS."}</p>
          </div>
          <button type="button" aria-label="Close" disabled={pending} onClick={() => dialog.current?.close()}><AdminIcon name="close" /></button>
        </div>
        {!deleting && (
          <>
            <label>Company name
              <input name="name" value={name} onChange={event => setName(event.target.value)} required maxLength={160} data-initial-focus readOnly={pending} />
            </label>
            <label>Subscription plan
              <select name="plan" value={plan} onChange={event => {
                const selected = PLANS.find(item => item === event.target.value);
                if (selected) setPlan(selected);
              }} disabled={pending}>
                {PLANS.map(item => <option key={item} value={item}>{PLAN_INFO[item].name} · {PLAN_INFO[item].price}</option>)}
              </select>
            </label>
          </>
        )}
        {state?.error && <div className="cms-message" data-error="true" role="alert">{state.message}</div>}
        <div className="admin-dialog-actions">
          <button type="button" data-initial-focus={deleting || undefined} disabled={pending} onClick={() => dialog.current?.close()}>Cancel</button>
          <button type="submit" className={deleting ? "admin-danger" : "cms-primary"} disabled={pending}>
            {pending ? copy.pending : copy.action}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export function CompanyDirectory({ companies }: { companies: CompanyDirectoryEntry[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [operation, setOperation] = useState<Operation>();
  const [feedback, setFeedback] = useState<{ message: string; newCompanyId?: string }>();
  const [shownSettings, setShownSettings] = useState<string>();
  const addButton = useRef<HTMLButtonElement>(null);
  const searchTerm = query.trim().toLocaleLowerCase();
  const live = companies.filter(company => company.isPublished).length;
  const visible = companies.filter(company =>
    (filter === "all" || company.isPublished === (filter === "published"))
    && (company.name.toLocaleLowerCase().includes(searchTerm) || company.id.includes(searchTerm)),
  );

  function openDialog(next: Operation) {
    setFeedback(undefined);
    setOperation(next);
  }

  return (
    <Workspace scope="Platform admin" title="Companies" description="Manage company accounts, subscription plans, and public pages."
      items={[
        { label: "Companies", icon: "companies", href: "/admin/", current: true },
        { label: "Homepage & translations", icon: "content", href: "/admin/homepage/" },
        { label: "View B Platform", icon: "external", href: "/", external: true },
      ]}
      action={<button className="cms-primary" ref={addButton} type="button" onClick={() => openDialog({ kind: "create" })}><AdminIcon name="plus" /> Add company</button>}>
      <dl className="directory-stats">
        <div><dt>Total companies</dt><dd>{companies.length}</dd></div>
        <div><dt>Published</dt><dd>{live}</dd></div>
        <div><dt>Unpublished</dt><dd>{companies.length - live}</dd></div>
      </dl>
      {feedback && <div className="cms-message" role="status">
        {feedback.message}
        {feedback.newCompanyId && <Link href={"/admin/" + feedback.newCompanyId + "/"}>Open new CMS</Link>}
      </div>}
      <section className="company-directory-panel" aria-labelledby="company-list-heading">
        <div className="directory-list-header">
          <div><h2 id="company-list-heading">Company directory</h2><p aria-live="polite">{visible.length} of {companies.length} shown</p></div>
          <div className="directory-filters">
            <label className="directory-search">
              <span className="admin-sr-only">Search companies</span><AdminIcon name="search" />
              <input type="search" placeholder="Search name or ID" value={query} onChange={event => setQuery(event.target.value)} />
            </label>
            <label>
              <span className="admin-sr-only">Publication status</span>
              <select value={filter} onChange={event => setFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </label>
          </div>
        </div>
        {visible.length === 0 ? (
          <div className="cms-empty directory-empty">
            <h3>{companies.length ? "No matching companies" : "No companies yet"}</h3>
            <p>{companies.length ? "Try another name, ID, or publication status." : "Add a company to create its CMS workspace."}</p>
            {companies.length > 0 && <button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>Clear filters</button>}
          </div>
        ) : (
          <ul className="company-directory-list">
            {visible.map(company => (
              <li className="company-directory-row" key={company.id}>
                <div className="directory-identity">
                  <span className="directory-avatar" aria-hidden="true"><AdminIcon name="companies" /></span>
                  <div><h3>{company.name}</h3><small>ID {company.id}</small></div>
                </div>
                <div className="directory-meta">
                  <span>{PLAN_INFO[company.plan].name}</span>
                  <span className="cms-state" data-state={company.isPublished ? "live" : undefined}>{company.isPublished ? "Published" : "Unpublished"}</span>
                </div>
                <div className="directory-row-actions cms-actions">
                  <Link className="directory-open" href={"/admin/" + company.id + "/"} aria-label={"Open CMS for " + company.name}>Open CMS <AdminIcon name="arrow" /></Link>
                  <button type="button" aria-label={"Actions for " + company.name} aria-expanded={shownSettings === company.id}
                    onClick={() => setShownSettings(current => current === company.id ? undefined : company.id)}>Actions <AdminIcon name="down" /></button>
                </div>
                {shownSettings === company.id && <div className="directory-settings cms-actions">
                  <button type="button" onClick={() => openDialog({ kind: "update", company })}>Edit company</button>
                  {company.isPublished && <Link href={"/" + company.id + "/"} target="_blank" rel="noopener noreferrer">View page <AdminIcon name="external" /><span className="admin-sr-only"> (opens in a new tab)</span></Link>}
                  <button className="admin-text-danger" type="button" onClick={() => openDialog({ kind: "delete", company })}>Delete company</button>
                </div>}
              </li>
            ))}
          </ul>
        )}
      </section>
      {operation && <CompanyDialog operation={operation} onClose={() => setOperation(undefined)}
        onSuccess={result => {
          setFeedback({ message: result.message, newCompanyId: operation.kind === "create" ? result.companyId : undefined });
          if (operation.kind === "create") {
            setQuery("");
            setFilter("all");
          }
          if (operation.kind === "delete") {
            setShownSettings(undefined);
            requestAnimationFrame(() => addButton.current?.focus());
          }
        }} />}
    </Workspace>
  );
}
