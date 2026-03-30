import * as React from "react"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { AboutCareerSections } from "../../components/about/about-career-sections"
import { useSiteTitle } from "../../hooks/use-site-title"

const LINKEDIN_HREF = `https://www.linkedin.com/in/marcin-stanek-qa`

const AboutEn = ({ location }) => {
  const siteTitle = useSiteTitle()

  return (
    <Layout
      location={location}
      title={siteTitle}
      alternateLanguageHref="/o-mnie/"
      alternateLanguageLabel="Polski"
    >
      <div className="about-page py-4">
        <h1 className="display-5 fw-bold mb-4">About</h1>

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
              I&apos;m an independent QA and test automation engineer (B2B, 10+
              years). I help teams reduce delivery risk: tests and automation
              aligned with how you ship software, with concise QA context for
              each change - scope and risk before you run full regression.
            </p>
            <p>
              Most tooling optimizes test <em>execution</em>; the hard part is
              knowing what deserves attention. I focus on tightening the gap
              between code changes and QA decisions - structured briefs from
              the pull request and its context (ticket, API contract), clearer
              risk and impacted areas, and fewer surprises in production. The
              goal is operational risk reduction, not novelty for its own sake.
            </p>
            <p>
              Beyond execution automation, I design and maintain frameworks for
              APIs and services, wired into CI/CD so feedback is continuous -
              useful on its own and a foundation when you want intelligence on
              failures, flakiness, and scope in the same pipelines. I also work
              end-to-end in the lifecycle: from requirements and test design
              through execution and release, integrated with the toolchain your
              developers already use.
            </p>
            <p className="mb-0">
              Longer term I&apos;m building toward a QA decision layer in CI/CD:
              from structured PR briefs, through test-result intelligence, to
              security triage - always framed as risk reduction, not an
              AI gimmick.
            </p>
          </div>
        </div>

        <AboutCareerSections locale="en" />

        <p className="mt-4 mb-0">
          <a
            href={LINKEDIN_HREF}
            rel="noopener noreferrer"
            target="_blank"
          >
            LinkedIn profile
          </a>
        </p>
      </div>
    </Layout>
  )
}

export default AboutEn

export const Head = () => (
  <Seo
    title="About"
    lang="en"
    description="Marcin Stanek - independent QA and test automation engineer (B2B, 10+ years). I focus on reducing delivery risk: clear decisions on what to test, automation in CI/CD, and useful context for every change."
  />
)
