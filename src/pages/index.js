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

const HomePl = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
    .filter(post => post.frontmatter.language === "pl")
    .slice(0, 5)

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Strona główna" />
      <Jumbotron
        header={"Inicjuję i naprawiam procesy kontroli jakości oprogramowania"}
        description={
          "Jestem Inżynierem QA z ponad 7-letnim doświadczeniem. Specjalizuję się w zakresie automatyzacji testów, poza tym mam również doświadczenie z czołowymi zespołami QA. Pomogę Ci w różnych sprawach związanych z jakością w Twojej firmie lub projekcie."
        }
        wantToKnowMoreButtonText={"Chcę wiedzieć więcej"}
        blogUrl="/blog/pl/"
      />
      <LastBlogPosts header={"Ostatnie wpisy na blogu"} posts={posts} />
      <Featurette
        id={"featurette-want-to-know"}
        header={"Quality Assurance"}
        leadText={
          "Poszukujesz kontrolera jakości? Potrzebujesz zautomatyzować procesy testowe w Twojej firmie? Masz problem z jakością kodu w Twojej organizacji? Trafiłeś w dobre miejsce, aby rozwiązać te problemy!"
        }
        image={"qa"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-automation"}
        header={"Automatyzacja"}
        leadText={
          "Pasjonuję się tworzeniem frameworków testowych, które usprawniają pracę zespołów deweloperskich, są efektywne i łatwe w utrzymaniu."
        }
        image={"automation"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-complete-solutions"}
        header={"Tworzę kompletne rozwiązania"}
        leadText={
          "Twój biznes jest unikatowy. Sposób jego dostarczania również powinien taki być. Tworzę kompleksowe rozwiązania zapewniania jakości aby za każdym razem wydawać oprogramowanie najwyższej jakości."
        }
        image={"complete_solutions"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-on-time"}
        header={"Dostarczam na czas"}
        leadText={
          "Zapewniam dostarczanie serwisów na czas, bez kompromisów w dziedzinie jakośći."
        }
        image={"on_time"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-inform"}
        header={"Informuję na bieżąco"}
        leadText={
          "Moi klienci są informowani na każdym etapie procesu produkcji oprogramowania. Bez niespodzianek. Prosty punkt widzenia."
        }
        image={"inform"}
        alignToLeft={true}
      />
      {/*      <ContactForm header={"Kontakt"} labelMessage={"Wiadomość"}
                   messageCheckboxText={"Dodam Cię do listy mailowej, z której możesz wypisać się w dowolnym momencie (jeden klik)"}
                   privacyPolicyText={"Polityka Prywatności"} buttonText={"Wyślij"}
                   privacyPolicyLink={"/regulamin.html"}/>*/}
    </Layout>
  )
}

export default HomePl

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
