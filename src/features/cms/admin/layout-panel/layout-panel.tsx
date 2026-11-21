import { listField, linkField, textField, textareaField, toggleField } from "../../definitions/fields";
import { isEntitled } from "../../plans";
import { LOCALE_LABEL, type Issue, type LayoutSettings, type Locale, type Plan } from "../../types";
import { Fields } from "../fields/fields";

const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const maxLogoBytes = 400_000;

const contactFields = [
  toggleField("showContact", "Show contact details in footer"),
  textField("contactEmail", "Footer email"),
  textField("contactPhone", "Footer phone"),
  textareaField("contactAddress", "Footer address"),
];

const headerFields = [
  textField("displayName", "Display name", { required: true }),
  textField("ctaLabel", "Header action label"),
  linkField("ctaHref", "Header action destination"),
  listField("nav", "Header navigation", "link", [
    textField("label", "Label"),
    textField("anchor", "Section anchor (without #)"),
  ]),
];

const footerFields = [
  textField("copyright", "Copyright line"),
  listField("footerLinks", "Footer links", "link", [
    textField("label", "Label"),
    linkField("url", "URL"),
  ]),
];

interface LayoutPanelProps {
  layout: LayoutSettings;
  locale: Locale;
  plan: Plan;
  issues: Issue[];
  onChange: (update: (layout: LayoutSettings) => LayoutSettings) => void;
  onError: (message: string) => void;
}

export function LayoutPanel({ layout, locale, plan, issues, onChange, onError }: LayoutPanelProps) {
  const translatedBase = "text." + locale;
  const visibleIssues = issues.filter(issue => !issue.path.startsWith("text.") || issue.path.startsWith(translatedBase + "."));

  function changeSetting<Key extends keyof LayoutSettings>(key: Key, value: LayoutSettings[Key]) {
    onChange(current => ({ ...current, [key]: value }));
  }

  function changeTranslation(key: string, value: unknown) {
    onChange(current => ({
      ...current,
      text: { ...current.text, [locale]: { ...current.text[locale], [key]: value } },
    }));
  }

  function uploadLogo(file?: File) {
    if (!file) return;
    if (!imageTypes.includes(file.type) || file.size > maxLogoBytes) {
      onError("Choose a PNG, JPEG, WebP or GIF under 400 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => changeSetting("logoUrl", String(reader.result));
    reader.onerror = () => onError("Could not read that image.");
    reader.readAsDataURL(file);
  }

  return (
    <>
      <h2>Header &amp; footer</h2>
      {visibleIssues.length > 0 && <ul className="cms-error">{visibleIssues.map(issue =>
        <li key={issue.path + issue.message}>{issue.message}</li>)}</ul>}
      <fieldset className="cms-layout-group">
        <legend>Brand appearance</legend>
        <p>Applies to every language.</p>
        <div className="cms-fields">
          <div className="cms-colors">
            <label>Accent color<input type="color" value={layout.accent} onChange={event => changeSetting("accent", event.target.value)} /></label>
            <label>Background color<input type="color" value={layout.background} onChange={event => changeSetting("background", event.target.value)} /></label>
          </div>
          <label>Logo URL<input type="text" value={layout.logoUrl} onChange={event => changeSetting("logoUrl", event.target.value)} /></label>
          <label>Or upload a logo<input type="file" accept={imageTypes.join(",")} onChange={event => uploadLogo(event.target.files?.[0])} /><small>PNG, JPEG, WebP or GIF up to 400 KB.</small></label>
          <label>Logo alt text<input value={layout.logoAlt} onChange={event => changeSetting("logoAlt", event.target.value)} /></label>
          {isEntitled(plan, "10") && (
            <label>Theme
              <select value={layout.theme} onChange={event => changeSetting("theme", event.target.value === "slate" ? "slate" : "editorial")}>
                <option value="editorial">Editorial</option>
                <option value="slate">Slate</option>
              </select>
            </label>
          )}
        </div>
      </fieldset>
      <fieldset className="cms-layout-group">
        <legend>Header</legend>
        <p>{LOCALE_LABEL[locale]} content</p>
        <Fields fields={headerFields} values={{ ...layout.text[locale] }} base={translatedBase} issues={visibleIssues} onChange={changeTranslation} />
      </fieldset>
      <fieldset className="cms-layout-group">
        <legend>Footer</legend>
        <p>{LOCALE_LABEL[locale]} content</p>
        <Fields fields={footerFields} values={{ ...layout.text[locale] }} base={translatedBase} issues={visibleIssues} onChange={changeTranslation} />
      </fieldset>
      <fieldset className="cms-layout-group">
        <legend>Footer contact details</legend>
        <p>Shared across languages.</p>
        <Fields fields={contactFields} values={{ ...layout }} issues={visibleIssues} onChange={(key, value) =>
          onChange(current => ({ ...current, [key]: value }))} />
      </fieldset>
    </>
  );
}
