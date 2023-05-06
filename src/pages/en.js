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
        header={"I initiate and improve software Quality Assurance processes"}
        description={
          "I am a QA Engineer with more than 7 years of experience. I specialise in the terms of test automation expertise, over it I am also have an experience with leading QA teams. I can help you with various things arround quality in your company or project."
        }
        wantToKnowMoreButtonText={"I want to know more"}
        blogUrl="/blog/en/"
      />
      <LastBlogPosts header={"Recent blog posts"} posts={posts} />
      <Featurette
        id={"featurette-want-to-know"}
        header={"Quality Assurance"}
        leadText={
          "Enhancing Your software's reliability, stability and performance through expert quality assurance services. Trust us to optimize your testing processes and ensure seamless deployment, so you can deliver exceptional software products to your users."
        }
        image={"qa"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-automation"}
        header={"Automation"}
        leadText={
          "Streamlining development processes with effective and easy to maintain test frameworks. Harness the power of automation to accelerate your software delivery, reduce manual effort, and achieve consistent, reliable results throughout your development lifecycle."
        }
        image={"automation"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-complete-solutions"}
        header={"Complete solutions"}
        leadText={
          "Tailored quality assurance solutions for Your unique business needs. Ensuring the Highest Quality Software Every Time. From requirements analysis to test execution and beyond, trust our expertise to seamlessly integrate quality throughout your software development lifecycle."
        }
        image={"complete_solutions"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-on-time"}
        header={"On time"}
        leadText={"On-Time delivery of quality services. Ensuring timely solutions without compromising on quality. Trust in our efficient project management and proactive communication to meet your deadlines, leaving you confident in the timely completion of your projects."}
        image={"on_time"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-inform"}
        header={"Keep you updated"}
        leadText={
          "Stay informed at every stage of the software production process. No surprises, just clear and transparent communication. With regular updates and open channels of communication, I ensure that your vision is aligned with the progress, fostering collaboration and delivering results that exceed your expectations."
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
