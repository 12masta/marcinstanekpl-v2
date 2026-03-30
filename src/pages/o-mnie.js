import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { AboutCareerSections } from "../components/about/about-career-sections"
import { useSiteTitle } from "../hooks/use-site-title"

const LINKEDIN_HREF = `https://www.linkedin.com/in/marcin-stanek-qa`

const AboutPl = ({ location }) => {
  const siteTitle = useSiteTitle()

  return (
    <Layout
      location={location}
      title={siteTitle}
      alternateLanguageHref="/en/about/"
      alternateLanguageLabel="English"
    >
      <Seo
        title="O mnie"
        lang="pl"
        description="Marcin Stanek - niezależny inżynier QA i automatyzacji (B2B, ponad 10 lat). Skupiam się na ograniczaniu ryzyka dostaw: jasne decyzje co testować, automatyzacja w CI/CD i sensowny kontekst przy każdej zmianie."
      />
      <div className="about-page py-4">
        <h1 className="display-5 fw-bold mb-4">O mnie</h1>

        <div className="row g-4 align-items-start">
          <div className="col-md-4 col-lg-3">
            <img
              className="img-fluid rounded shadow-sm"
              src={`${__PATH_PREFIX__}/images/myself.jpg`}
              alt="Marcin Stanek"
              width={400}
              height={500}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="col-md-8 col-lg-9">
            <p className="lead">
              Jestem niezależnym inżynierem QA i automatyzacji (B2B, ponad 10
              lat). Pomagam zespołom ograniczać ryzyko dostaw: testy i
              automatyzacja wpasowane w Wasz sposób wydawania oprogramowania,
              z krótkim, czytelnym kontekstem dla QA przy każdej zmianie -
              zakres i ryzyko, zanim przeprowadzicie pełną regresję.
            </p>
            <p>
              Większość narzędzi optymalizuje <em>wykonanie</em> testów;
              trudniejsze jest wskazanie, co naprawdę wymaga uwagi. Skupiam się
              na zawężeniu luki między zmianami w kodzie a decyzjami QA -
              uporządkowane briefingi z PR i kontekstu (ticket, kontrakt API),
              jaśniejsze ryzyko i obszary wpływu, mniej niespodzianek na
              produkcji. Chodzi o realne ograniczenie ryzyka operacyjnego, a nie
              o modę na kolejne gadżety.
            </p>
            <p>
              Oprócz automatyzacji wykonania projektuję i utrzymuję frameworki
              pod API i usługi, spięte z CI/CD, tak żeby feedback był ciągły -
              jako solidna baza i fundament pod kolejne warstwy: interpretację
              wyników, flaky testy czy doprecyzowanie zakresu w tym samym
              pipeline&apos;ie. Pracuję też end-to-end w cyklu życia: od
              wymagań i projektu testów po wykonanie i release, w toolchainie, w
              którym i tak pracują deweloperzy.
            </p>
            <p className="mb-0">
              Długoterminowo rozwijam kierunek, który można opisać jako warstwę
              decyzji QA w CI/CD: od strukturyzowanych briefingów przy PR,
              przez inteligencję na wynikach testów, po triage znalezisk
              bezpieczeństwa - zawsze z naciskiem na to, co realnie obniża
              ryzyko, a nie na „fajne demo z AI”.
            </p>
          </div>
        </div>

        <AboutCareerSections locale="pl" />

        <p className="mt-4 mb-0">
          <a
            href={LINKEDIN_HREF}
            rel="noopener noreferrer"
            target="_blank"
          >
            Profil na LinkedIn
          </a>
        </p>
      </div>
    </Layout>
  )
}

export default AboutPl
