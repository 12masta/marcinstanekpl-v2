import * as React from "react"
import Accordion from "react-bootstrap/Accordion"

import { aboutCareer } from "../../data/about-career"

export function AboutCareerSections({ locale }) {
  const c = aboutCareer[locale]

  return (
    <>
      <h2 className="h3 fw-bold mt-5 pt-4 border-top">
        {c.experienceHeading}
      </h2>
      <p className="text-body-secondary small mb-3">{c.experienceAccordionHint}</p>

      <Accordion
        defaultActiveKey="0"
        flush
        className="about-career-accordion shadow-sm border rounded overflow-hidden"
      >
        {c.experiences.map((exp, i) => (
          <Accordion.Item
            eventKey={String(i)}
            key={`${exp.company}-${exp.role}-${i}`}
          >
            <Accordion.Header className="about-career-accordion__header">
              <span className="about-career-accordion__title">
                <span className="d-block fw-bold text-body">
                  {exp.company}
                </span>
                <span className="d-block small text-body-secondary">
                  {exp.role}
                </span>
                <span className="d-block small text-muted mt-1">
                  {exp.arrangement}
                </span>
              </span>
            </Accordion.Header>
            <Accordion.Body className="pt-2">
              {exp.tech.length > 0 ? (
                <>
                  <p className="small fw-semibold mb-2 text-body-secondary">
                    {c.techLabel}
                  </p>
                  <ul className="list-unstyled d-flex flex-wrap gap-1 mb-4">
                    {exp.tech.map(tech => (
                      <li key={tech}>
                        <span className="badge rounded-pill bg-light text-dark border fw-normal">
                          {tech}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <ul className="mb-0 ps-3">
                {exp.highlights.map((item, j) => (
                  <li key={j} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      <h2 className="h3 fw-bold mt-5 pt-4 border-top">
        {c.educationHeading}
      </h2>
      <p className="text-muted small mb-1">{c.education.period}</p>
      <p className="mb-2">{c.education.school}</p>
      <p className="text-body-secondary small mb-0">{c.education.thesis}</p>

      <h2 className="h3 fw-bold mt-5 pt-4 border-top">
        {c.credentialsHeading}
      </h2>
      <ul className="ps-3 mb-0">
        <li className="mb-2">{c.credentials.languages}</li>
        <li className="mb-2">{c.credentials.certificates}</li>
        <li>{c.credentials.skillsSummary}</li>
      </ul>
    </>
  )
}
