import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Jumbotron } from "../components/home/jumbotron"
import { LastBlogPosts } from "../components/home/lastblogbosts"
import { Featurette } from "../components/home/featurette"
/*
import { ContactForm } from "../components/home/contactform"
*/

const HomeEn = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
    .filter(post => post.frontmatter.language === "en")
    .slice(0, 5)

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Home page" />
      <Jumbotron
        header={
          "I reduce delivery risk through QA, automation, and clearer decisions in how you ship"
        }
        description={
          "I'm an independent QA and test automation engineer (B2B, 10+ years): tests and automation aligned with your delivery process, with concise QA context for each change - scope and risk before you run full regression. Beyond execution automation, I work with teams on frequent, predictable releases."
        }
        contactButtonText="Contact"
        contactMailSubject="Message from marcinstanek.pl"
        blogUrl="/blog/en/"
      />
      <LastBlogPosts header={"Recent blog posts"} posts={posts} />
      <Featurette
        id={"featurette-want-to-know"}
        header={"What to test, before you run tests"}
        leadText={
          "Most tooling optimizes execution, the hard part is knowing what deserves attention. I help you tighten the gap between code changes and QA decisions - structured briefs from the pull request and its context, clearer risk and impacted areas, and fewer surprises in production. The goal is operational risk reduction, not novelty for its own sake."
        }
        leadTextDesktop={
          "Most tooling optimizes execution, the hard part is knowing what deserves attention. I help you tighten the gap between code changes and QA decisions - structured briefs from the pull request and its context, clearer risk and impacted areas, and fewer surprises in production. The goal is operational risk reduction, not novelty for its own sake. Together we pin down what belongs in the smallest credible verification set for a given change, what can wait, and what can be covered conditionally - shortening full regression where it is overhead and keeping it where the change history actually warrants it."
        }
        image={"qa"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-automation"}
        header={"Automation that fits the pipeline"}
        leadText={
          "Maintainable frameworks for APIs and services, wired into CI/CD so feedback is continuous. Useful on its own - and the foundation when you want intelligence on failures, flakiness, and scope layered on top of the same pipelines."
        }
        leadTextDesktop={
          "Maintainable frameworks for APIs and services, wired into CI/CD so feedback is continuous. Useful on its own - and the foundation when you want intelligence on failures, flakiness, and scope layered on top of the same pipelines. I structure it so new contributors can add scenarios without breaking the whole stack, and reports and artifacts stay readable for people who do not live in the test code. The same pipeline can later feed stability metrics and prioritization calls - without a parallel automation bubble off to the side."
        }
        image={"automation"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-complete-solutions"}
        header={"End-to-end quality in the lifecycle"}
        leadText={
          "From requirements and test design to execution and release. I integrate quality practices with your toolchain - so briefs, checks, and automation live where developers already work, not in a separate silo."
        }
        leadTextDesktop={
          "From requirements and test design to execution and release. I integrate quality practices with your toolchain - so briefs, checks, and automation live where developers already work, not in a separate silo. The same sources of truth - ticket, pull request, API contract - carry through coverage design, execution, and the release decision. That cuts duplicate work across tools and makes it easier to audit what was actually verified for a given version."
        }
        image={"complete_solutions"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-on-time"}
        header={"On time"}
        leadText={
          "Predictable cadence on contract work: clear milestones, proactive communication, and scope that matches your release train. You get fewer last-minute QA firefights and more time for the decisions that actually reduce risk."
        }
        leadTextDesktop={
          "Predictable cadence on contract work: clear milestones, proactive communication, and scope that matches your release train. You get fewer last-minute QA firefights and more time for the decisions that actually reduce risk. In practice that means early signals on blockers and on when scope needs trimming or shifting, instead of a single late surprise. I bias toward visibility: what is in flight, what is waiting on a product call, and what is actually ready to ship."
        }
        image={"on_time"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-inform"}
        header={"Keep you updated"}
        leadText={
          "Clarity at every stage: status, risk, and outcomes visible where the team already works - including alongside repository changes and pipeline output. No surprises, communication that keeps everyone aligned on progress."
        }
        leadTextDesktop={
          "Clarity at every stage: status, risk, and outcomes visible where the team already works - including alongside repository changes and pipeline output. No surprises, communication that keeps everyone aligned on progress. That includes short summaries after meaningful merges, a clear line between blocking and informational regression, and a shared vocabulary for status in the tools you already use - so PM and engineering are not re-negotiating what green in CI is supposed to mean."
        }
        image={"inform"}
        alignToLeft={true}
      />
      {/*<ContactForm header={"Contact"} labelMessage={"Message"}
                   messageCheckboxText={"I will add you to the mailing list from which you can unsubscribe at any time (one click)"}
                   privacyPolicyText={"Privacy policy"} buttonText={"Send"}
                   privacyPolicyLink={"/regulamin_en.html"}/>*/}
    </Layout>
  )
}

export default HomeEn

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          language
        }
      }
    }
  }
`
