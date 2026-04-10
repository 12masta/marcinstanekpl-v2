/**
 * Copy for /en/qa-pr-briefs/ and /qa-briefingi-pr/ (QA decision layer offering).
 * Framed as risk reduction; avoid leading with "AI" in headlines.
 */

export const qaPrBriefsLandingCopy = {
  en: {
    documentTitle: "QA PR briefs in CI/CD",
    metaDescription:
      "Structured QA briefs on pull requests: scope, risk, and suggested checks before you run the full suite - including when changes touch data, contracts, and integrations. For teams that want clearer decisions in the pipeline, not more noise.",
    h1: "QA briefs on every pull request",
    heroLead:
      "Most tools optimize test execution. The harder problem is deciding what deserves attention on each change. This is about closing the gap between the pull request and a clear verification plan: summary, impacted areas, risk, suggested scenarios, and coverage gaps, delivered where reviewers already work.",
    heroSecondary:
      "The goal is operational risk reduction: less time reading tickets and diffs under pressure, fewer surprises after merge, and a shared picture of scope before anyone says \"run full regression.\"",
    ctaLabel: "Discuss fit for your pipeline",
    ctaMailSubject: "QA PR briefs - marcinstanek.pl",
    images: {
      workflowAlt:
        "Illustration: work item, code change, and context flowing into a structured brief shape.",
      roadmapAlt:
        "Illustration: three stages from PR briefs to test-signal clarity to support for data-impacting changes.",
    },
    problemTitle: "What is broken today",
    problemIntro:
      "Someone still has to connect the ticket, the diff, and the product risk before a meaningful test plan exists. That work is easy to underestimate:",
    problemBullets: [
      "It is manual, inconsistent across people and teams, and rarely visible in dashboards.",
      "It costs real minutes per pull request, and it scales poorly when many PRs land in parallel.",
      "When it is rushed, edge cases slip through and \"QA missed it\" is often a story about unclear scope, not bad intent.",
    ],
    offerTitle: "What you get",
    offerIntro:
      "A repeatable pipeline turn: when a pull request is ready for review, you get a structured brief that supports the decision \"what should we verify for this change?\" Typical sections include:",
    offerBullets: [
      "Plain-language summary of the change",
      "Impacted areas and risk hotspots",
      "Suggested test scenarios and questions for the author",
      "Notes on missing or weak coverage, where it shows up in the change",
    ],
    offerNote:
      "Implementations can tie into your tracker and CI (for example Jira plus Azure DevOps or GitHub) so the brief lands on the PR and the right people see it without a new silo.",
    fitTitle: "Who this is for",
    fitGoodTitle: "Good fit",
    fitGoodBullets: [
      "Backend- or services-heavy products with real CI/CD and frequent pull requests.",
      "Teams where QA or release owners still spend noticeable time per PR on scope and risk before execution.",
      "Products where pull requests often touch databases, events, reporting contracts, or analytics dependencies.",
      "Organizations that want pipeline automation framed as risk reduction, not novelty.",
    ],
    fitPoorTitle: "Usually a weaker fit",
    fitPoorBullets: [
      "Very small teams with almost no formal QA or release discipline.",
      "Groups that are not ready to treat pull-request context as a first-class input to quality.",
    ],
    roadmapTitle: "How this can grow",
    roadmapIntro:
      "The same event-driven pipeline idea extends beyond the first brief:",
    roadmapItems: [
      {
        title: "PR QA brief (entry point)",
        body: "Structured output on each pull request from ticket plus code context.",
      },
      {
        title: "Test result intelligence",
        body: "Clearer grouping and interpretation when failures and flakiness drown the signal.",
      },
      {
        title: "Data change clarity",
        body:
          "Clearer view of impact on contracts, migrations, pipelines, and downstream consumers when the change touches stores, APIs, or analytics paths.",
      },
    ],
    relatedTitle: "Related writing",
    relatedIntro: "Background on the cost of manual scope work and noisy CI:",
    relatedPosts: [
      {
        href: "/en/pr-scope-hidden-tax/",
        label: "The hidden tax on every pull request",
      },
      {
        href: "/en/noisy-ci-signal/",
        label: "Noisy CI: when the pipeline adds doubt instead of signal",
      },
    ],
    closingLine:
      "If this matches how your team works, a short conversation is enough to see whether a pilot on one service or pipeline makes sense.",
  },
  pl: {
    documentTitle: "Briefing QA w pull requestach",
    metaDescription:
      "Ustrukturyzowany briefing QA przy pull requeście: zakres, ryzyko i proponowane scenariusze weryfikacji przed uruchomieniem pełnej regresji - także przy zmianach w danych, kontraktach i integracjach. Dla zespołów oczekujących czytelniejszych decyzji w potoku CI/CD, a nie kolejnego źródła szumu informacyjnego.",
    h1: "Briefing QA przy każdym pull requeście",
    heroLead:
      "Większość narzędzi koncentruje się na wykonaniu testów. Trudniejszym problemem jest precyzyjne wskazanie obszarów danej zmiany wymagających uwagi. Chodzi o zawężenie luki między pull requestem a spójnym planem weryfikacji: streszczenie, analiza obszarów wpływu, ocena ryzyka, propozycje scenariuszy oraz wskazanie luk w pokryciu - udostępniane w miejscu, w którym zespół już prowadzi przegląd kodu.",
    heroSecondary:
      "Celem jest realna redukcja ryzyka operacyjnego: krótszy czas na analizę zgłoszeń i różnic w kodzie pod presją terminów, mniej zdarzeń niezgodnych z oczekiwaniami po scaleniu oraz wspólny obraz zakresu, zanim zespół zdecyduje o pełnej regresji.",
    ctaLabel: "Umówmy rozmowę o integracji z Waszym CI/CD",
    ctaMailSubject: "Briefing QA przy pull requestach - marcinstanek.pl",
    images: {
      workflowAlt:
        "Ilustracja: zgłoszenie w trackerze, zmiana w kodzie i kontekst przechodzą w ustrukturyzowany briefing.",
      roadmapAlt:
        "Ilustracja: trzy etapy - od briefingu przy PR, przez czytelniejszy sygnał z testów, po wsparcie przy zmianach o charakterze danych.",
    },
    problemTitle: "Typowe ograniczenia",
    problemIntro:
      "Zanim powstanie wykonalny plan testów, konieczne jest powiązanie zgłoszenia w trackerze, różnic w kodzie oraz oceny ryzyka biznesowego. Praca ta bywa niedoszacowywana:",
    problemBullets: [
      "Jest realizowana ręcznie, niespójnie między osobami i zespołami oraz rzadko uwidaczniana w standardowych metrykach.",
      "Generuje wymierny koszt czasu na każdy pull request i słabo skaluje przy wysokiej równoległości zmian.",
      "W trybie pośpiechu rośnie ryzyko pominięcia przypadków brzegowych; stwierdzenie, że \"przeoczył to QA\", częściej wynika z nieprecyzyjnego zakresu niż z intencjonalnego zaniedbania.",
    ],
    offerTitle: "Zakres treści briefingu",
    offerIntro:
      "W ramach powtarzalnego kroku w potoku CI/CD, gdy pull request jest gotowy do przeglądu, powstaje ustrukturyzowany briefing wspierający odpowiedź na pytanie, co należy zweryfikować w kontekście danej zmiany. Typowa struktura obejmuje m.in.:",
    offerBullets: [
      "Zwięzłe streszczenie zmiany",
      "Obszary wpływu oraz strefy podwyższonego ryzyka",
      "Propozycje scenariuszy testowych i pytań do autora zmiany",
      "Wskazanie luk lub niskiego pokrycia, jeśli wynika to z analizy zmiany",
    ],
    offerNote:
      "Możliwa jest integracja z systemem śledzenia prac oraz CI/CD (na przykład Jira, Azure DevOps lub GitHub), tak aby treść briefingu była widoczna przy pull requeście dla właściwych osób, bez tworzenia kolejnego, odseparowanego kanału komunikacji.",
    fitTitle: "Dopasowanie do profilu organizacji",
    fitGoodTitle: "Wysokie dopasowanie",
    fitGoodBullets: [
      "Produkty o silnym udziale backendu lub usług, z ugruntowanym CI/CD i regularnym przepływem pull requestów.",
      "Zespoły, w których QA lub właściciele wydania poświęcają wymierny czas na analizę zakresu i ryzyka przy każdym pull requeście, jeszcze przed wykonaniem testów.",
      "Środowiska, w których zmiany często obejmują bazy danych, zdarzenia, kontrakty raportowe lub zależności analityczne.",
      "Organizacje poszukujące automatyzacji w potoku CI/CD przede wszystkim jako instrumentu redukcji ryzyka, a nie efektu marketingowego.",
    ],
    fitPoorTitle: "Ograniczone dopasowanie",
    fitPoorBullets: [
      "Bardzo niewielkie zespoły bez formalnego QA lub bez ustalonej dyscypliny wydań.",
      "Zespoły niewykorzystujące kontekstu pull requesta jako równorzędnego wejścia do procesu zapewnienia jakości.",
    ],
    roadmapTitle: "Możliwy zakres rozwoju",
    roadmapIntro:
      "Ten sam model potoku opartego na zdarzeniach można rozszerzyć poza pierwszy briefing:",
    roadmapItems: [
      {
        title: "Briefing QA przy pull requeście (punkt wyjścia)",
        body: "Ustrukturyzowany rezultat na potrzeby każdego pull requesta, z uwzględnieniem zgłoszenia i kontekstu kodu.",
      },
      {
        title: "Analiza i interpretacja wyników testów",
        body: "Czytelniejsze grupowanie oraz interpretacja, gdy niestabilne testy i szum informacyjny zacierają sygnał z CI/CD.",
      },
      {
        title: "Zmiany o charakterze danych",
        body:
          "Jaśniejsza ocena skutków dla kontraktów danych, migracji, potoków przetwarzania oraz konsumentów danych, gdy zmiana obejmuje repozytoria danych, interfejsy API lub ścieżki analityczne.",
      },
    ],
    relatedTitle: "Materiały powiązane",
    relatedIntro: "Kontekst kosztu ręcznej analizy zakresu oraz ograniczonej przydatności sygnału z CI/CD:",
    relatedPosts: [
      {
        href: "/pr-scope-hidden-tax/",
        label:
          "Rzeczywisty koszt ręcznego przygotowania zakresu dla jednego PR (Jira, diff, plan testów)",
      },
      {
        href: "/noisy-ci-signal/",
        label: "Potok CI/CD, który wzmacnia wątpliwości zamiast jednoznacznego sygnału",
      },
    ],
    closingLine:
      "Jeśli powyższy profil odpowiada sposobowi pracy Waszego zespołu, krótka rozmowa pozwoli wstępnie ocenić, czy pilotaż na wybranym serwisie lub fragmencie potoku ma uzasadnienie biznesowe.",
  },
}
