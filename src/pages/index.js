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
        header={
          "Ograniczam ryzyko dostaw: QA, automatyzacja i jaśniejsze decyzje w CI/CD"
        }
        description={
          "Jestem niezależnym inżynierem QA i automatyzacji (B2B, ponad 10 lat): API i .NET, CI/CD oraz pipeline’y, w których z PR powstaje krótki kontekst dla QA - zakres i ryzyko, zanim odpalicie pełną regresję. Obok klasycznej automatyzacji wykonania; współpraca z backendem przy częstych, przewidywalnych wdrożeniach."
        }
        wantToKnowMoreButtonText={"Chcę wiedzieć więcej"}
        blogUrl="/blog/pl/"
      />
      <LastBlogPosts header={"Ostatnie wpisy na blogu"} posts={posts} />
      <Featurette
        id={"featurette-want-to-know"}
        header={"Co testować, zanim odpalisz testy"}
        leadText={
          "Większość narzędzi optymalizuje wykonanie; trudniejsze jest wskazanie, co naprawdę wymaga uwagi. Pomagam zawęzić lukę między zmianami w kodzie a decyzjami QA - uporządkowane briefingi z PR i kontekstu, jaśniejsze ryzyko i obszary wpływu, mniej niespodzianek na produkcji. Chodzi o realne ograniczenie ryzyka operacyjnego, a nie modę na kolejne gadżety."
        }
        image={"qa"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-automation"}
        header={"Automatyzacja wpasowana w pipeline"}
        leadText={
          "Utrzymywalne frameworki pod API i usługi, spięte z CI/CD, żeby feedback był ciągły. To solidna baza sama w sobie - i fundament pod kolejne warstwy: sensowniejszą interpretację wyników, flaky testy czy doprecyzowanie zakresu w tym samym pipeline’ie."
        }
        image={"automation"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-complete-solutions"}
        header={"Jakość end-to-end w cyklu życia"}
        leadText={
          "Od wymagań i projektu testów po wykonanie i release. Praktyki jakości spinam z Twoim toolchainem - briefingi, checki i automatyzacja tam, gdzie i tak pracują deweloperzy, a nie w osobnym silosie."
        }
        image={"complete_solutions"}
        alignToLeft={true}
      />
      <Featurette
        id={"featurette-on-time"}
        header={"Dostarczam na czas"}
        leadText={
          "Przewidywalny rytm pracy na kontrakcie: jasne kamienie milowe, proaktywna komunikacja i zakres dopasowany do Twojego pociągu wydań. Mniej gaśnic pod koniec sprintu, więcej przestrzeni na decyzje, które realnie obniżają ryzyko."
        }
        image={"on_time"}
        alignToLeft={false}
      />
      <Featurette
        id={"featurette-inform"}
        header={"Informuję na bieżąco"}
        leadText={
          "Przejrzystość na każdym etapie: status, ryzyko i wyniki pracy widoczne tam, gdzie zespół już je śledzi - w tym przy zmianach w repozytorium i pipeline’ie. Bez niespodzianek, z kanałami, które utrzymują wspólny obraz postępu."
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
