import { LOCALES, LOCALE_LABEL, type Locale } from "../../types";

interface ToolbarProps {
  locale: Locale;
  status: { label: string; tone?: string };
  saving: boolean;
  changeLocale: (locale: Locale) => void;
  saveDraft: () => void;
  submitForReview: () => void;
}

export function Toolbar({ locale, status, saving, changeLocale, saveDraft, submitForReview }: ToolbarProps) {
  return (
    <div className="cms-toolbar" role="region" aria-label="Draft controls">
      <label>Content language
        <select value={locale} onChange={event => {
          const selected = LOCALES.find(option => option === event.target.value);
          if (selected) changeLocale(selected);
        }}>
          {LOCALES.map(language => <option value={language} key={language}>{LOCALE_LABEL[language]}</option>)}
        </select>
      </label>
      <div className="cms-actions">
        <span className="cms-state" data-state={status.tone} role="status">{status.label}</span>
        <button type="button" disabled={saving} onClick={saveDraft}>Save draft</button>
        <button type="button" className="cms-primary" disabled={saving} onClick={submitForReview}>Submit for review</button>
      </div>
    </div>
  );
}
