import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Jumbotron } from "../components/home/jumbotron"
import { LastBlogPosts } from "../components/home/lastblogbosts"
import { Featurette } from "../components/home/featurette"
import { ContactForm } from "../components/home/contactform"

const HomeEn = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes.filter(post => post.frontmatter.language === "en")

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Home page"/>
      <Jumbotron header={"I initiate and improve software Quality Assurance processes"}
                 description={"Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins."}
                 wantToKnowMoreButtonText={"I want to know more"} blogUrl="/blog/en/"/>
      <LastBlogPosts header={"Recent blog posts"} posts={posts}/>
      <Featurette header={"Quality Assurance"}
                  leadText={"Are you looking for a Quality Assurance Engineer? Do you need to automate test processes in your company? You have a problem with the quality of the code in your organization? You've come to the right place to solve these problems!"}
                  image={"qa"} alignToLeft={true}/>
      <Featurette header={"Automation"}
                  leadText={"I am passionate about creating test frameworks that improve the work of development teams, they are effective and easy to maintain."}
                  image={"automation"} alignToLeft={false}/>
      <Featurette header={"Complete solutions"}
                  leadText={"Your business is unique. The delivery method should also be like this. I create comprehensive quality assurance solutions to publish the highest quality software every time."}
                  image={"complete_solutions"} alignToLeft={true}/>
      <Featurette header={"On time"}
                  leadText={"I provide on-time services without compromising on quality."}
                  image={"on_time"} alignToLeft={false}/>
      <Featurette header={"Keep you updated"}
                  leadText={"My clients are informed at every stage of the software production process. No surprises. A simple point of view."}
                  image={"inform"} alignToLeft={true}/>
      <ContactForm header={"Contact"} labelMessage={"Message"}
                   messageCheckboxText={"I will add you to the mailing list from which you can unsubscribe at any time (one click)"}
                   privacyPolicyText={"Privacy policy"} buttonText={"Send"}
                   privacyPolicyLink={"/regulamin_en.html"}/>
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
