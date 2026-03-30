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
          "Ograniczam ryzyko dostaw: QA, automatyzacja i jaśniejsze decyzje w procesie dostaw"
        }
        description={
          "Jestem niezależnym inżynierem QA i automatyzacji (B2B, ponad 10 lat): testy i automatyzacja wpasowane w Wasz sposób wydawania oprogramowania, z krótkim, czytelnym kontekstem dla QA przy każdej zmianie - zakres i ryzyko, zanim przeprowadzicie pełną regresję. Oprócz automatyzacji wykonania współpracuję z zespołami przy częstych, przewidywalnych wdrożeniach."
        }
        contactButtonText="Kontakt"
        contactMailSubject="Wiadomość ze strony marcinstanek.pl"
        blogUrl="/blog/pl/"
      />
      <LastBlogPosts
        header={"Ostatnie wpisy na blogu"}
        posts={posts}
        postCtaLabel={"Czytaj wpis"}
        siteUrl={data.site.siteMetadata?.siteUrl || ``}
      />
      <Featurette
        id={"featurette-want-to-know"}
        header={"Co testować, zanim odpalisz testy"}
        leadText={
          "Większość narzędzi optymalizuje wykonanie, trudniejsze jest wskazanie, co naprawdę wymaga uwagi. Pomagam zawęzić lukę między zmianami w kodzie a decyzjami QA - uporządkowane briefingi z PR i kontekstu, jaśniejsze ryzyko i obszary wpływu, mniej niespodzianek na produkcji. Chodzi o realne ograniczenie ryzyka operacyjnego, a nie modę na kolejne gadżety."
        }
        leadTextDesktop={
          "Większość narzędzi optymalizuje wykonanie, trudniejsze jest wskazanie, co naprawdę wymaga uwagi. Pomagam zawęzić lukę między zmianami w kodzie a decyzjami QA - uporządkowane briefingi z PR i kontekstu, jaśniejsze ryzyko i obszary wpływu, mniej niespodzianek na produkcji. Chodzi o realne ograniczenie ryzyka operacyjnego, a nie modę na kolejne gadżety. Doprecyzowujemy, co wchodzi w minimalny zestaw weryfikacji przy danej zmianie, a co można odłożyć lub pokryć warunkowo - żeby skracać pełną regresję tam, gdzie jest zbędna, i utrzymywać ją tam, gdzie historia zmian naprawdę tego wymaga."
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
        leadTextDesktop={
          "Utrzymywalne frameworki pod API i usługi, spięte z CI/CD, żeby feedback był ciągły. To solidna baza sama w sobie - i fundament pod kolejne warstwy: sensowniejszą interpretację wyników, flaky testy czy doprecyzowanie zakresu w tym samym pipeline’ie. Projektuję to tak, żeby nowi członkowie zespołu mogli szybko dodać scenariusz bez rozwalania całej struktury, a raporty i artefakty były czytelne dla osób, które nie piszą testów na co dzień. Ten sam pipeline może później karmić metryki stabilności i decyzje o priorytetach - bez osobnego „równoległego świata” automatyzacji."
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
        leadTextDesktop={
          "Od wymagań i projektu testów po wykonanie i release. Praktyki jakości spinam z Twoim toolchainem - briefingi, checki i automatyzacja tam, gdzie i tak pracują deweloperzy, a nie w osobnym silosie. Chodzi też o spójność: te same źródła prawdy (ticket, PR, kontrakt API) prowadzą przez projekt pokrycia, wykonanie i decyzję o wydaniu. Dzięki temu nie duplikujemy pracy między narzędziami i łatwiej audytować, co zostało sprawdzone przy danej wersji."
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
        leadTextDesktop={
          "Przewidywalny rytm pracy na kontrakcie: jasne kamienie milowe, proaktywna komunikacja i zakres dopasowany do Twojego pociągu wydań. Mniej gaśnic pod koniec sprintu, więcej przestrzeni na decyzje, które realnie obniżają ryzyko. W praktyce oznacza to wczesne sygnały o blokadach i o tym, gdy zakres trzeba przyciąć albo przesunąć, zamiast komunikatu w ostatniej chwili. Stawiam na jawność: co jest w trakcie, co czeka na decyzję produktu, a co jest gotowe do wydania."
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
        leadTextDesktop={
          "Przejrzystość na każdym etapie: status, ryzyko i wyniki pracy widoczne tam, gdzie zespół już je śledzi - w tym przy zmianach w repozytorium i pipeline’ie. Bez niespodzianek, z kanałami, które utrzymują wspólny obraz postępu. Stosuję krótkie podsumowania po istotnych merge’ach, rozróżnienie regresji blokującej i informacyjnej oraz spójny język statusu w narzędziach, których i tak używacie - żeby PM i dev nie tłumaczyli sobie nawzajem, co oznacza „zielone” w CI."
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
        siteUrl
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
          ogImage
        }
        listOgImageFile {
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              width: 400
              aspectRatio: 1.7777777777777777
              formats: [AUTO, WEBP, AVIF]
              placeholder: DOMINANT_COLOR
            )
          }
        }
      }
    }
  }
`
