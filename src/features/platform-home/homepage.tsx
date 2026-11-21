import type { ReactNode } from "react";
import { PLANS } from "@/features/cms/plans";
import type { Locale } from "@/features/cms/types";
import type { HomepageCompanyProfile } from "@/features/cms/database/repository";
import { HOME_LANGUAGES, HOME_LOCALES, subscriptionHref, type HomeCopy, type HomeSettings } from "./content";
import { ChapterNavigation, Companies, HeaderDisclosure, UsageGuide } from "./interactions";
import { HomeIcon, ProductPreview } from "./visuals";

const chapterNavigationLabels: Record<Locale, string> = {
  en: "Homepage sections",
  hy: "Գլխավոր էջի բաժիններ",
  ru: "Разделы главной страницы",
};

function Wordmark({ path }: { path: string }) {
  return <a className="bp-wordmark" href={path}><span className="bp-mark" aria-hidden="true"><i /><i /><i /></span><span>B<span>Platform</span></span></a>;
}

function JumpLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "outline" }) {
  return <a className={"bp-button bp-button--" + variant} href={href}>{children}<HomeIcon name={variant === "ghost" ? "down" : "arrow"} /></a>;
}

function SectionTitle({ title, eyebrow, description, id }: { title: string; eyebrow: string; description?: string; id: string }) {
  return <div className="bp-section-heading">
    <p className="bp-eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
    {description && <p className="bp-intro">{description}</p>}
  </div>;
}

function HomeChapter({ id, titleId, className, children }: { id: string; titleId: string; className?: string; children: ReactNode }) {
  return <section id={id} className={className ? `bp-chapter ${className}` : "bp-chapter"} aria-labelledby={titleId}>
    <div className="bp-chapter-snap" aria-hidden="true" />
    <div className="bp-chapter-pin">
      <div className="bp-chapter-surface">{children}</div>
    </div>
  </section>;
}

export function Homepage({ locale, copy, settings, profiles }: {
  locale: Locale;
  copy: HomeCopy;
  settings: HomeSettings;
  profiles: HomepageCompanyProfile[];
}) {
  const path = HOME_LANGUAGES[locale].path;
  const nav = [
    ["#services", copy.nav.services], ["#guide", copy.nav.guide],
    ["#companies", copy.nav.companies], ["#plans", copy.nav.plans],
  ];
  const { hero, services, guide, companies, plans, faq, contact } = copy;
  const chapters = [
    { id: "intro", label: "BPlatform" },
    { id: "services", label: copy.nav.services },
    { id: "guide", label: copy.nav.guide },
    { id: "companies", label: copy.nav.companies },
    { id: "plans", label: copy.nav.plans },
    { id: "faq", label: faq.eyebrow },
    { id: "start", label: copy.nav.start },
  ];
  const plansInfo = [
    { name: plans.standard, text: plans.standardText, features: [plans.standardOne, plans.standardTwo, plans.standardThree] },
    { name: plans.enhanced, text: plans.enhancedText, features: [plans.enhancedOne, plans.enhancedTwo, plans.enhancedThree] },
    { name: plans.custom, text: plans.customText, features: [plans.customOne, plans.customTwo, plans.customThree] },
  ];
  const questions = [
    [faq.firstQuestion, faq.firstAnswer], [faq.secondQuestion, faq.secondAnswer],
    [faq.thirdQuestion, faq.thirdAnswer], [faq.fourthQuestion, faq.fourthAnswer],
  ];
  const subscription = subscriptionHref(settings.contactEmail, contact.subject);

  return <div className="bp-home" data-locale={locale}>
    <a className="bp-skip" href="#main-content">{copy.nav.skip}</a>
    <header className="bp-header">
      <div className="bp-header-surface">
        <div className="bp-wrap bp-header-inner">
          <Wordmark path={path} />
          <nav className="bp-navigation" aria-label={copy.nav.menu}>
            {nav.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
          </nav>
          <div className="bp-header-actions">
            <HeaderDisclosure label={copy.nav.language} className="bp-language" icon="globe" short={HOME_LANGUAGES[locale].short}>
              <ul aria-label={copy.nav.language}>
                {HOME_LOCALES.map(language => <li key={language}>
                  <a href={HOME_LANGUAGES[language].path} hrefLang={language} lang={language} aria-current={language === locale ? "page" : undefined}>
                    {HOME_LANGUAGES[language].name}
                  </a>
                </li>)}
              </ul>
            </HeaderDisclosure>
            <a className="bp-header-cta" href="#start">{copy.nav.start}<HomeIcon name="arrow" /></a>
            <HeaderDisclosure label={copy.nav.menu} className="bp-mobile-menu" icon="menu">
              <ul>{[...nav, ["#start", copy.nav.start]].map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
            </HeaderDisclosure>
          </div>
        </div>
      </div>
    </header>
    <ChapterNavigation label={chapterNavigationLabels[locale]} chapters={chapters} />
    <main id="main-content" tabIndex={-1}>
      <HomeChapter id="intro" className="bp-hero" titleId="bp-hero-title">
        <div className="bp-wrap bp-hero-inner">
          <div className="bp-hero-copy">
            <p className="bp-eyebrow"><span aria-hidden="true" />{hero.eyebrow}</p>
            <h1 id="bp-hero-title">{hero.title} <span>{hero.highlight}</span></h1>
            <p className="bp-hero-description">{hero.description}</p>
            <div className="bp-actions">
              <JumpLink href="#companies">{hero.browse}</JumpLink>
              <JumpLink href="#guide" variant="ghost">{hero.guide}</JumpLink>
            </div>
          </div>
          <div className="bp-hero-art" aria-hidden="true">
            <div className="bp-hero-grid" />
            <div className="bp-orbit"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="bp-hero-spark bp-hero-spark--one">✦</div>
            <div className="bp-hero-spark bp-hero-spark--two">+</div>
            <div className="bp-hero-preview"><ProductPreview title={services.sampleBrand} subtitle={services.sampleCategory} /></div>
            <span className="bp-preview-chip"><HomeIcon name="globe" /></span>
          </div>
          <p className="bp-hero-caption">{hero.visualCaption}</p>
        </div>
      </HomeChapter>
      <HomeChapter id="services" titleId="bp-services-title">
        <div className="bp-wrap bp-section">
          <SectionTitle {...services} id="bp-services-title" />
          <div className="bp-service-grid">
            <article className="bp-service bp-service--page">
              <div className="bp-service-copy"><span className="bp-service-icon"><HomeIcon name="window" /></span><h3>{services.pageTitle}</h3><p>{services.pageText}</p></div>
              <div className="bp-service-preview" aria-hidden="true"><ProductPreview title={services.sampleBrand} subtitle={services.sampleCategory} /></div>
            </article>
            <article className="bp-service bp-service--directory">
              <div className="bp-service-copy"><span className="bp-service-icon"><HomeIcon name="search" /></span><h3>{services.discoveryTitle}</h3><p>{services.discoveryText}</p></div>
              <div className="bp-service-pattern" aria-hidden="true"><i /><i /><i /></div>
            </article>
            <article className="bp-service bp-service--contact">
              <div className="bp-service-copy"><span className="bp-service-icon"><HomeIcon name="message" /></span><h3>{services.contactTitle}</h3><p>{services.contactText}</p></div>
              <div className="bp-contact-pattern" aria-hidden="true"><HomeIcon name="message" /></div>
            </article>
          </div>
        </div>
      </HomeChapter>
      <HomeChapter id="guide" className="bp-guide" titleId="bp-guide-title">
        <div className="bp-wrap bp-section bp-guide-inner">
          <div>
            <SectionTitle {...guide} id="bp-guide-title" />
            <JumpLink href="#plans" variant="outline">{guide.cta}</JumpLink>
          </div>
          <UsageGuide steps={[
            { title: guide.firstTitle, text: guide.firstText },
            { title: guide.secondTitle, text: guide.secondText },
            { title: guide.thirdTitle, text: guide.thirdText },
          ]} />
        </div>
      </HomeChapter>
      <HomeChapter id="companies" titleId="bp-companies-title">
        <div className="bp-wrap bp-section">
          <SectionTitle {...companies} id="bp-companies-title" />
          <Companies profiles={profiles} featuredIds={settings.featuredIds} copy={companies} locale={locale} />
        </div>
      </HomeChapter>
      <HomeChapter id="plans" titleId="bp-plans-title">
        <div className="bp-wrap bp-section">
          <SectionTitle {...plans} id="bp-plans-title" />
          <div className="bp-plan-grid">
            {PLANS.map((amount, index) => {
              const plan = plansInfo[index];
              return <article className="bp-plan" key={amount} data-plan={amount}>
                <h3>{plan.name}</h3>
                <p className="bp-price"><strong>${amount}</strong><span>USD</span></p>
                <p className="bp-plan-description">{plan.text}</p>
                <ul>{plan.features.map((feature, position) => <li key={position}><HomeIcon name="check" />{feature}</li>)}</ul>
                <a className="bp-button bp-button--outline" href={subscriptionHref(settings.contactEmail, contact.subject + " — " + plan.name)}>{plans.cta}<HomeIcon name="arrow" /></a>
              </article>;
            })}
          </div>
        </div>
      </HomeChapter>
      <HomeChapter id="faq" titleId="bp-faq-title">
        <div className="bp-wrap bp-section bp-faq">
          <SectionTitle {...faq} id="bp-faq-title" />
          <div className="bp-faq-list">
            {questions.map(([question, answer], index) => <details key={index} name="homepage-questions"><summary>{question}<HomeIcon name="plus" /></summary><p>{answer}</p></details>)}
          </div>
        </div>
      </HomeChapter>
      <HomeChapter id="start" className="bp-outro" titleId="bp-contact-title">
        <div className="bp-wrap bp-section">
          <div className="bp-outro-inner">
            <SectionTitle {...contact} id="bp-contact-title" />
            <JumpLink href={subscription}>{contact.cta}</JumpLink>
            <a className="bp-contact-email" href={subscription}>{settings.contactEmail}</a>
          </div>
        </div>
      </HomeChapter>
    </main>
    <footer className="bp-wrap bp-footer">
      <div><Wordmark path={path} /><p>{contact.footer}</p></div>
      <a href="https://bfo.am/">{contact.powered}<HomeIcon name="external" /></a>
    </footer>
  </div>;
}
