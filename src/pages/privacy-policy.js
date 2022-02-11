import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const PrivacyPolicy = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Polityka prywatności" />
      <div className="container">
        <h1>POLITYKA PRYWATNOŚCI I PLIKÓW COOKIES</h1>
        <h2>Dzień dobry!</h2>
        Jeżeli tutaj trafiłeś, to niezawodny znak, że cenisz swoją prywatność.
        Doskonale to rozumiemy, dlatego przygotowaliśmy dla Ciebie ten dokument,
        w którym znajdziesz zasady przetwarzania danych osobowych oraz
        wykorzystywania plików cookies w związku z korzystaniem ze strony
        internetowej https://marcinstanek.pl <br />
        Informacja formalna na początek – administratorem strony jest Marcin
        Stanek prowadzący działalność gospodarczą pod firmą Marcin Stanek z
        siedzibą w Zborowie, ul. Solecka 83, 28-131 Solec-Zdrój, wpisanego do
        Centralnej Ewidencji i Informacji o Działalności Gospodarczej, NIP
        6551975700, REGON 369052790. <br />
        W razie jakichkolwiek wątpliwości związanych z polityką prywatności, w
        każdej chwili możesz skontaktować się z nami, wysyłając wiadomość na
        adres kontakt@marcinstanek.pl <br />
        <br />
        <h2>Skrócona wersja – najważniejsze informacje</h2>
        <br />
        Dbamy o Twoją prywatność, ale również o Twój czas. Dlatego
        przygotowaliśmy dla Ciebie skróconą wersję najważniejszych zasad
        związanych z ochroną prywatności. <br />
        - Zakładając konto użytkownika za pośrednictwem strony, składając
        zamówienie, zapisując się do newslettera, składając reklamację,
        odstępując od umowy czy po prostu kontaktując się z nami, przekazujesz
        nam swoje dane osobowe, a my gwarantujemy Ci, że Twoje dane pozostaną
        poufne, bezpieczne i nie zostaną udostępnione jakimkolwiek podmiotom
        trzecim bez Twojej wyraźnej zgody. <br />
        - Powierzamy przetwarzanie danych osobowych tylko sprawdzonym i zaufanym
        podmiotom świadczącym usługi związane z przetwarzaniem danych osobowych.
        <br />
        - Korzystamy z narzędzi analitycznych Google Analytics, które zbierają
        informacje na temat Twoich odwiedzin strony, takie jak podstrony, które
        wyświetliłeś, czas, jaki spędziłeś na stronie czy przejścia pomiędzy
        poszczególnymi podstronami. W tym celu wykorzystywane są pliki cookies
        firmy Google LLC dotyczące usługi Google Analytics. W ramach mechanizmu
        do zarządzania ustawieniami plików cookies masz możliwość zadecydowania,
        czy w ramach usługi Google Analytics będziemy mogli korzystać również z
        funkcji marketingowych, czy nie. <br />
        - Korzystamy z narzędzi marketingowych, takich jak Facebook Pixel, by
        kierować do Ciebie reklamy. Wiążę się to z wykorzystywaniem plików
        cookies firmy Facebook. W ramach ustawień plików cookies możesz
        zadecydować, czy wyrażasz zgodę na korzystanie przez nas w Twoim
        przypadku z Pixela Facebooka, czy nie. <br />
        - Osadzamy na stronie nagrania wideo z serwisu YouTube. Gdy odtwarzasz
        takie nagrania, wykorzystywane są pliki cookies firmy Google LLC
        dotyczące usługi YouTube. <br />
        - Zapewniamy możliwość korzystania z funkcji społecznościowych, takich
        jak udostępnianie treści w serwisach społecznościowych oraz subskrypcja
        profilu społecznościowego. Korzystanie z tych funkcji wiąże się z
        wykorzystywaniem plików cookies administratorów serwisów
        społecznościowych takich jak Facebook, Instagram, YouTube, Twitter,
        Google+, LinkedIN.
        <br />
        - Korzystamy na stronie z systemu komentarzy Disqus. Wiąże się to z
        wykorzystywaniem plików cookies firmy Disqus. Jeżeli powyższe informacje
        nie są dla Ciebie wystarczające, poniżej znajdziesz dalej idące
        szczegóły.
        <br />
        <br />
        <h2>Dane osobowe</h2>
        <br />
        Administratorem Twoich danych osobowych w rozumieniu przepisów o
        ochronie danych osobowych jest Marcin Stanek prowadzący działalność
        gospodarczą pod firmą Marcin Stanek z siedzibą w Zborowie, ul. Solecka
        83, 28-131 Solec-Zdrój, wpisanego do Centralnej Ewidencji i Informacji o
        Działalności Gospodarczej, NIP 6551975700, REGON 369052790. <br />
        Cele, podstawy prawne oraz okres przetwarzania danych osobowych wskazane
        są odrębnie w stosunku do każdego celu przetwarzania danych (patrz: opis
        poszczególnych celów przetwarzania danych osobowych poniżej). <br />
        Uprawnienia. RODO przyznaje Ci następujące potencjalne uprawnienia
        związane z przetwarzaniem Twoich danych osobowych: <br />
        prawo dostępu do danych osobowych, <br />
        - prawo do sprostowania danych osobowych,
        <br />
        - prawo do usunięcia danych osobowych,
        <br />
        - prawo do ograniczenia przetwarzania danych osobowych,
        <br />
        - prawo do wniesienia sprzeciwu co do przetwarzania danych osobowych,
        <br />
        - prawo do przenoszenia danych,
        <br />
        - prawo do wniesienia skargi do organu nadzorczego,
        <br />
        - prawo do odwołania zgody na przetwarzanie danych osobowych, jeżeli
        takową zgodę wyraziłeś.
        <br />
        <br />
        <br />
        Zasady związane z realizacją wskazanych uprawnień zostały opisane
        szczegółowo w art. 16 – 21 RODO. Zachęcamy do zapoznania się z tymi
        przepisami. Ze swojej strony uważamy za potrzebne wyjaśnić Ci, że
        wskazane powyżej uprawnienia nie są bezwzględne i nie będą przysługiwać
        Ci w stosunku do wszystkich czynności przetwarzania Twoich danych
        osobowych. Dla Twojej wygody dołożyliśmy starań, by w ramach opisu
        poszczególnych operacji przetwarzania danych osobowych wskazać na
        przysługujące Ci w ramach tych operacji uprawnienia. <br />
        <br />
        Podkreślamy, że jedno z uprawnień wskazanych powyżej przysługuje Ci
        zawsze – jeżeli uznasz, że przy przetwarzaniu Twoich danych osobowych
        dopuściliśmy się naruszenia przepisów o ochronie danych osobowych, masz
        możliwość wniesienia skargi do organu nadzorczego (Prezesa Urzędu
        Ochrony Danych Osobowych). <br />
        <br />
        Zawsze możesz również zwrócić się do nas z żądaniem udostępnienia Ci
        informacji o tym, jakie dane na Twój temat posiadamy oraz w jakich
        celach je przetwarzamy. Wystarczy, że wyślesz wiadomość na adres
        kontakt@marcinstanek.pl. Dołożyliśmy jednak wszelkich starań, by
        interesujące Cię informacje zostały wyczerpująco przedstawione w
        niniejszej polityce prywatności. Podany powyżej adres e-mail możesz
        wykorzystać również w razie jakichkolwiek pytań związanych z
        przetwarzaniem Twoich danych osobowych. <br />
        <br />
        Bezpieczeństwo. Gwarantujemy Ci poufność wszelkich przekazanych nam
        danych osobowych. Zapewniamy podjęcie wszelkich środków bezpieczeństwa i
        ochrony danych osobowych wymaganych przez przepisy o ochronie danych
        osobowych. Dane osobowe są gromadzone z należytą starannością i
        odpowiednio chronione przed dostępem do nich przez osoby do tego
        nieupoważnione. <br />
        <br />
        <h2>
          Wykaz powierzeń. Powierzamy przetwarzanie danych osobowych
          następującym podmiotom:
        </h2>
        <br />
        <br />
        ActiveCampaign LLC, 1 North Dearborn Street, Suite 500, Chicago, IL
        60602, USA – w celu korzystania z systemu mailingowego, w którym
        przetwarzane są Twoje dane, jeżeli zapisałeś się do newslettera, IFIRMA
        SA, Grabiszyńska 241 B, 53-234, Wrocław, Dolnośląskie, NIP: 8981647572 –
        w celu korzystania z systemu do fakturowania, w którym przetwarzane są
        Twoje dane, jeżeli wystawiamy dla Ciebie fakturę, Wszystkie podmioty,
        którym powierzamy przetwarzanie danych osobowych gwarantują stosowanie
        odpowiednich środków ochrony i bezpieczeństwa danych osobowych
        wymaganych przez przepisy prawa.
        <br />
        <br />
        <h2>Cele i czynności przetwarzania</h2>
        <br />
        <br />
        Konto użytkownika. Zakładając konto użytkownika, musisz podać swój adres
        e-mail oraz zdefiniować hasło do konta. Podanie danych jest dobrowolne,
        ale niezbędne do założenia konta. W ramach edycji profilu użytkownika
        możesz podać dalej idące dane na swój temat, tj. imię i nazwisko, adres
        rozliczeniowy oraz adres do wysyłki. Podanie tych danych jest całkowicie
        dobrowolne. Możesz posiadać konto, nie podając tych dalej idących
        danych. W takiej sytuacji, składając zamówienie będziesz musiał te dane
        wprowadzić ręcznie. <br />
        <br />
        Dane wprowadzone przez Ciebie w ramach konta użytkownika przetwarzane są
        wyłącznie w celu utrzymywania konta i zapewnienia Ci możliwości
        korzystania z niego. Podanie danych w koncie użytkownika ma za zadanie
        ułatwić Ci składanie zamówień w sklepie poprzez automatyczne
        podstawianie danych do formularza zamówienia. <br />
        <br />
        Podstawą prawną przetwarzania Twoich danych osobowych w ramach konta
        użytkownika jest realizacja umowy o prowadzenie konta, którą zawierasz
        na podstawie regulaminu sklepu – art. 6 ust. 1 lit. b RODO.
        <br />
        <br />
        Twoje dane będą przetwarzane w ramach konta tak długo, jak długo
        będziesz posiadać konto użytkownika. Po usunięciu konta, twoje dane
        zostaną usunięte z bazy, za wyjątkiem danych o złożonych zamówieniach.
        <br />
        <br />
        W każdej chwili możesz uzyskać dostęp do swoich danych osobowych
        przetwarzanych w ramach konta, logując się do swojego konta użytkownika.
        Po zalogowaniu się do konta możesz w każdej chwili zmodyfikować swoje
        dane, jak również je usunąć, za wyjątkiem danych o złożonych
        zamówieniach. W każdej chwili możesz podjąć również decyzję o usunięciu
        konta.
        <br />
        <br />
        W stosunku do danych zgromadzonych w koncie użytkownika przysługuje Ci
        również prawo do przenoszenia danych, o którym mowa w art. 20 RODO.
        <br />
        <br />
        Zamówienia. Składając zamówienie, musisz podać dane niezbędne do
        realizacji zamówienia, tj. imię i nazwisko, adres rozliczeniowy, adres
        e-mail. Podanie danych jest dobrowolne, ale niezbędne do złożenia
        zamówienia. <br />
        <br />
        Dane przekazane nam w związku z zamówieniem, przetwarzane są w celu
        realizacji zamówienia (art. 6 ust. 1 lit. b RODO), wystawienia faktury
        (art. 6 ust. 1 lit. c RODO), uwzględnienia faktury w naszej dokumentacji
        księgowej (art. 6 ust. 1 lit. c RODO) oraz w celach archiwalnych i
        statystycznych (art. 6 ust. 1 lit. f RODO). <br />
        <br />
        Dane zawarte w zamówieniu złożonym za pośrednictwem sklepu przetwarzane
        są w ramach systemu WordPress i przechowywane na serwerze zapewnianym
        przez zenbox sp. z o.o. <br />
        <br />
        Jeżeli posiadasz konto użytkownika, to Twoje zamówienie będzie widoczne
        w ramach historii zamówień danego konta. <br />
        <br />
        Każde zamówienie dokumentowane jest fakturą. Faktury wystawiane są z
        wykorzystaniem systemu IFIRMA SA Faktura przekazywane są do biura
        rachunkowego Biuro Rachunkowe PERFEKTUS Barbara Pawlik. <br />
        <br />
        Zamówienia są również rejestrowane w naszej wewnętrznej bazie w celach
        archiwalnych i statystycznych. <br />
        <br />
        Dane o zamówieniach będą przetwarzane przez czas niezbędny do realizacji
        zamówienia, a następnie do czasu upływu terminu przedawnienia roszczeń z
        tytułu zawartej umowy. Ponadto, po upływie tego terminu, dane nadal mogą
        być przez nas przetwarzane w celach statystycznych. Pamiętaj również, że
        mamy obowiązek przechowywać faktury z Twoimi danymi osobowymi przez
        okres 5 lat od końca roku podatkowego, w którym powstał obowiązek
        podatkowy.
        <br />
        <br />
        W przypadku danych o zamówieniach nie masz możliwości sprostowania tych
        danych po realizacji zamówienia. Nie możesz również sprzeciwić się
        przetwarzaniu danych oraz domagać się usunięcia danych do czasu upływu
        terminu przedawnienia roszczeń z tytułu zawartej umowy. Podobnie, nie
        możesz sprzeciwić się przetwarzaniu danych oraz domagać się usunięcia
        danych zawartych w fakturach. Po upływie terminu przedawnienia roszczeń
        z tytułu zawartej umowy możesz jednać sprzeciwić się przetwarzaniu przez
        nas Twoich danych w celach statystycznych, jak również domagać się
        usunięcia Twoich danych z naszej bazy. <br />
        <br />
        W stosunku do danych o zamówieniach przysługuje Ci również prawo do
        przenoszenia danych, o którym mowa w art. 20 RODO. <br />
        <br />
        <h2>Newsletter.</h2>
        <br />
        <br />
        Jeżeli chcesz zapisać się do newslettera, musisz przekazać nam swój
        adres e-mail za pośrednictwem formularza zapisu do newslettera. <br />
        <br />
        Dane przekazane nam podczas zapisu do newslettera wykorzystywane są w
        celu przesyłania Ci newslettera, a podstawą prawną ich przetwarzania
        jest Twoja zgoda (art. 6 ust. 1 lit. a RODO) wyrażona podczas
        zapisywania się do newslettera. <br />
        <br />
        Dane przetwarzane są w ramach systemu mailingowego Active Campaign i
        przechowywane na serwerze zapewnianym przez ActiveCampaign LLC.
        <br />
        <br />
        Dane będą przetwarzane przez czas funkcjonowania newslettera, chyba że
        wcześniej zrezygnujesz z jego otrzymywania, co spowoduje usunięcie
        Twoich danych z bazy. <br />
        <br />
        W każdej chwili możesz sprostować swoje dane zapisane w bazie
        newsletterowej, jak również zażądać ich usunięcia, rezygnując z
        otrzymywania newslettera. Przysługuje Ci również prawo do przenoszenia
        danych, o którym mowa w art. 20 RODO. <br />
        <br />
        Reklamacje i odstąpienie od umowy. Jeżeli składasz reklamację lub
        odstępujesz od umowy, to przekazujesz nam dane osobowe zawarte w treści
        reklamacji lub oświadczeniu o odstąpieniu od umowy, które obejmuję imię
        i nazwisko, adres zamieszkania, numer telefonu, adres e-mail, numer
        rachunku bankowego. <br />
        <br />
        Dane przekazane nam w związku ze złożeniem reklamacji lub odstąpieniem
        od umowy wykorzystywane są w celu realizacji procedury reklamacyjnej lub
        procedury odstąpienia od umowy (art. 6 ust. 1 lit. c RODO). <br />
        <br />
        Dane będą przetwarzane przez czas niezbędny do realizacji procedury
        reklamacyjnej lub procedury odstąpienia. Reklamacje oraz oświadczenia o
        odstąpieniu od umowy mogą być ponadto archiwizowane w celach
        statystycznych. <br />
        <br />
        W przypadku danych zawartych w reklamacjach oraz oświadczeniach o
        odstąpieniu od umowy nie masz możliwości sprostowania tych danych. Nie
        możesz również sprzeciwić się przetwarzaniu danych oraz domagać się
        usunięcia danych do czasu upływu terminu przedawnienia roszczeń z tytułu
        zawartej umowy. Po upływie terminu przedawnienia roszczeń z tytułu
        zawartej umowy możesz jednak sprzeciwić się przetwarzaniu przez nas
        Twoich danych w celach statystycznych, jak również domagać się usunięcia
        Twoich danych z naszej bazy. <br />
        <br />
        Kontakt e-mailowy. Kontaktując się z nami za pośrednictwem poczty
        elektronicznej, w tym również przesyłając zapytanie poprzez formularz
        kontaktowy, w sposób naturalny przekazujesz nam swój adres e-mail jako
        adres nadawcy wiadomości. Ponadto, w treści wiadomości możesz zawrzeć
        również inne dane osobowe. <br />
        <br />
        Twoje dane są w tym przypadku przetwarzane w celu kontaktu z Tobą, a
        podstawą przetwarzania jest art. 6 ust. 1 lit. a RODO, czyli Twoja zgoda
        wynikające z zainicjowania z nami kontaktu. Podstawą prawną
        przetwarzania po zakończeniu kontaktu jest usprawiedliwiony cel w
        postaci archiwizacji korespondencji na potrzeby wewnętrzne (art. 6 ust.
        1 lit. c RODO).
        <br />
        <br />
        Treść korespondencji może podlegać archiwizacji i nie jesteśmy w stanie
        jednoznacznie określić, kiedy zostanie usunięta. Masz prawo do domagania
        się przedstawienia historii korespondencji, jaką z nami prowadziłeś
        (jeżeli podlegała archiwizacji), jak również domagać się jej usunięcia,
        chyba że jej archiwizacja jest uzasadniona z uwagi na nasze nadrzędne
        interesy, np. obrona przed potencjalnymi roszczeniami z Twojej strony.
        <br />
        <br />
        <h2>Pliki cookies i inne technologie śledzące</h2>
        <br />
        <br />
        Nasza strona, podobnie jak niemal wszystkie inne strony internetowe,
        wykorzystuje pliki cookies, by zapewnić Ci najlepsze doświadczenia
        związane z korzystaniem z niej. <br />
        <br />
        Cookies to niewielkie informacje tekstowe, przechowywane na Twoim
        urządzeniu końcowym (np. komputerze, tablecie, smartfonie), które mogą
        być odczytywane przez nasz system teleinformatyczny. <br />
        <br />
        Więcej szczegółów znajdziesz poniżej. <br />
        <br />
        Zgoda na cookies. Podczas pierwszej wizyty na stronie wyświetlana jest
        Ci informacja na temat stosowania plików cookies wraz z pytaniem o zgodę
        na wykorzystywanie plików cookies. Dzięki specjalnemu narzędziu masz
        możliwość zarządzania plikami cookies z poziomu strony. Ponadto, zawsze
        możesz zmienić ustawienia cookies z poziomu swojej przeglądarki albo w
        ogóle usunąć pliki cookies. Pamiętaj jednak, że wyłączenie plików
        cookies może powodować trudności w korzystaniu ze strony, jak również z
        wielu innych stron internetowych, które stosują cookies. <br />
        <br />
        Cookies podmiotów trzecich. Nasza strona, podobnie jak większość
        współczesnych stron internetowych, wykorzystuje funkcje zapewniane przez
        podmioty trzecie, co wiąże się z wykorzystywaniem plików cookies
        pochodzących od podmiotów trzecich. Wykorzystanie tego rodzaju plików
        cookies zostało opisane poniżej. <br />
        <br />
        Analiza i statystyka. Wykorzystujemy cookies do śledzenia statystyk
        strony, takich jak liczba osób odwiedzających, rodzaj systemu
        operacyjnego i przeglądarki internetowej wykorzystywanej do przeglądania
        strony, czas spędzony na stronie, odwiedzone podstrony etc. Korzystamy w
        tym zakresie z Google Analytics, co wiąże się z wykorzystaniem plików
        cookies firmy Google LLC. W ramach mechanizmu do zarządzania
        ustawieniami plików cookies masz możliwość zadecydowania, czy w ramach
        usługi Google Analytics będziemy mogli korzystać również z funkcji
        marketingowych, czy nie.
        <br />
        <br />
        Marketing. Korzystamy z narzędzi marketingowych, takich jak Facebook
        Pixel, by kierować do Ciebie reklamy. Wiążę się to z wykorzystywaniem
        plików cookies firmy Facebook. W ramach ustawień plików cookies możesz
        zadecydować, czy wyrażasz zgodę na korzystanie przez nas w Twoim
        przypadku z Pixela Facebooka, czy nie. <br />
        <br />
        Narzędzia społecznościowe. Zapewniamy możliwość korzystania z funkcji
        społecznościowych, takich jak udostępnianie treści w serwisach
        społecznościowych oraz subskrypcja profilu społecznościowego.
        Korzystanie z tych funkcji wiąże się z wykorzystywaniem plików cookies
        administratorów serwisów społecznościowych takich jak Facebook,
        Instagram, YouTube, Twitter, Google+, LinkedIN. <br />
        <br />
        Osadzamy na stronie nagrania wideo z serwisu YouTube. Gdy odtwarzasz
        takie nagrania, wykorzystywane są pliki cookies firmy Google LLC
        dotyczące usługi YouTube. <br />
        <br />
        Korzystamy na stronie z systemu komentarzy Disqus. Wiąże się to z
        wykorzystywaniem plików cookies firmy Disqus. <br />
        <br />
        Logi serwera <br />
        <br />
        Korzystanie ze strony wiąże się z przesyłaniem zapytań do serwera, na
        którym przechowywana jest strona. Każde zapytanie skierowane do serwera
        zapisywane jest w logach serwera. <br />
        <br />
        Logi obejmują m.in. Twój adres IP, datę i czas serwera, informacje o
        przeglądarce internetowej i systemie operacyjnym z jakiego korzystasz.
        Logi zapisywane i przechowywane są na serwerze. <br />
        <br />
        Dane zapisane w logach serwera nie są kojarzone z konkretnymi osobami
        korzystającymi ze strony i nie są wykorzystywane przez nas w celu Twojej
        identyfikacji. <br />
        <br />
        Logi serwera stanowią wyłącznie materiał pomocniczy służący do
        administrowania stroną, a ich zawartość nie jest ujawniana nikomu poza
        osobami upoważnionymi do administrowania serwerem.
      </div>
    </Layout>
  )
}

export default PrivacyPolicy

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
