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
          "Zwiększenie niezawodności, stabilności i wydajności Twojego oprogramowania dzięki specjalistycznym usługom zapewniania jakości. Zaufaj nam, jeśli chodzi o optymalizację procesów testowania i zapewnienie bezproblemowego wdrożenia, dzięki czemu możesz dostarczać swoim użytkownikom wyjątkowe oprogramowanie."
        }
        image={"qa"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-automation"}
        header={"Automatyzacja"}
        leadText={
          "Usprawnianie procesów programistycznych dzięki efektywnym i łatwym w utrzymaniu frameworkom testowym. Wykorzystaj moc automatyzacji, aby przyspieszyć dostarczanie oprogramowania, zmniejszyć nakład pracy ręcznej i osiągnąć spójne, niezawodne wyniki w całym cyklu rozwoju."
        }
        image={"automation"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-complete-solutions"}
        header={"Tworzę kompletne rozwiązania"}
        leadText={
          "Dostosowane rozwiązania zapewniania jakości dla Twoich unikalnych potrzeb biznesowych. Zapewnienie najwyższej jakości oprogramowania za każdym razem. Od analizy wymagań po wykonanie testów i nie tylko, zaufaj naszej wiedzy fachowej, aby bezproblemowo zintegrować jakość w całym cyklu tworzenia oprogramowania."
        }
        image={"complete_solutions"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-on-time"}
        header={"Dostarczam na czas"}
        leadText={
          "Terminowe dostarczanie wysokiej jakości usług. Zapewnienie terminowych rozwiązań bez uszczerbku dla jakości. Zaufaj naszemu efektywnemu zarządzaniu projektami i proaktywnej komunikacji, aby dotrzymać terminów, co daje pewność terminowej realizacji projektów."
        }
        image={"on_time"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-inform"}
        header={"Informuję na bieżąco"}
        leadText={
          "Bądź na bieżąco na każdym etapie procesu produkcji oprogramowania. Żadnych niespodzianek, tylko jasna i przejrzysta komunikacja. Dzięki regularnym aktualizacjom i otwartym kanałom komunikacji zapewniam, że Twoja wizja jest zgodna z postępem, wspierając współpracę i dostarczając wyniki, które przekraczają Twoje oczekiwania."
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
