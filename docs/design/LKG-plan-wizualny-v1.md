# Lubelski Klub Go — plan odświeżenia wyglądu

Wersja 1.0, 30 września 2026. Kierunek A: **Papier i goban**.

Status: kierunek wizualny Papier i goban zaakceptowany przez właściciela 30.09.2026. Zachować flagi obok widocznych kodów języków w wersji początkowej. Szczegóły fontów i zasobów dopracować w prototypie. Dokument nie jest samodzielnym poleceniem rozpoczęcia wdrożenia ani zgodą na publikację. Makieta to ilustracja kierunku, a nie gotowa aplikacja ani źródło danych klubu.

## 1. Cel i podstawa

Nadać stronie ciepły, rozpoznawalny charakter lokalnego klubu Go: naturalne drewno, papier, grafit, ciemna zieleń i oszczędny czerwony detal. Zachować prostotę, czytelność i łatwość znalezienia informacji o pierwszym spotkaniu. Efekt ma być widoczny na wszystkich publicznych podstronach, nie tylko w hero.

Podstawa: aktualny kod repozytorium `jaroslawjusiak/LublinGoClubWebPage` na `main` przeczytany 30.09.2026, dwa dostarczone zrzuty (Home i O klubie), dotychczasowa rozmowa. Przed implementacją zapisać bieżący SHA i sprawdzić zmiany od tej wersji. Nie zakładać, że obecna produkcja odpowiada lokalnym zrzutom.

Rozpoznane problemy: zbyt ciężkie nagłówki, systemowy krój pisma bez odrębnego charakteru, podobne jasne powierzchnie, duże powtarzalne odstępy, obraz hero z obcym stylistycznie brązowym tłem i owalną obwódką, tekstowe podstrony przypominające dokument, czerwone przyciski dominujące nad identyfikacją klubu.

### Oczekiwany efekt

- Pierwszy ekran tworzy jedną kompozycję tekstu i fotografii.
- Termin i miejsce spotkania są łatwe do znalezienia; dekoracje nie odsuwają ich nadmiernie w dół.
- Każda podstrona ma wspólny język wizualny, lecz układ odpowiada jej treści.
- Strona działa przy 320 px, powiększonym tekście i we wszystkich trzech językach.
- Wszystkie istniejące funkcje, trasy, dane, uprawnienia i stany interfejsu pozostają sprawne.

## 2. Zakres i granice

W zakresie: tokeny stylów, lokalne fonty, prosty znak/wordmark, obrazy, wspólne komponenty, układy publicznych stron, wygląd stanów danych i formularzy administratora, weryfikacja wizualna i regresji, aktualizacja dokumentacji.

Poza zakresem: zmiana frameworka, routingu i modelu danych, migracje Supabase, nowy CMS, nowe funkcje, formularz kontaktowy, interaktywna plansza, dark mode, rozbudowane animacje, wymyślanie historii lub wydarzeń klubu. Nie przebudowywać autoryzacji, repozytorium aktualności ani uploadu obrazów przy okazji stylowania. Wdrożenie na Vercel pozostaje osobnym zadaniem.

Treści z makiety nie zastępują istniejących tłumaczeń. Skrócone etykiety w makiecie są propozycjami redakcyjnymi. Publikować je dopiero po zatwierdzeniu i przetłumaczeniu. Dane spotkań z `src/data/club.ts` oraz dzień tygodnia z obecnych tłumaczeń wymagają normalnej weryfikacji właściciela przed premierą. Nie kopiować danych z obrazu.

## 3. Specyfikacja wizualna

### 3.1 Kolory

| Token semantyczny | Wartość początkowa | Rola                                 |
| ----------------- | ------------------ | ------------------------------------ |
| paper             | #F6F1E7            | Tło strony                           |
| surface           | #FFFCF7            | Jasne powierzchnie kart i formularzy |
| sand              | #E9DDC9            | Pas informacji, panel spotkań        |
| ink               | #252824            | Podstawowy tekst                     |
| muted-text        | #596158            | Tekst pomocniczy                     |
| border            | #CFC7B8            | Separatory dekoracyjne               |
| brand             | #29483F            | Przyciski główne, stopka             |
| brand-hover       | #203A32            | Hover głównego przycisku             |
| accent            | #B34C38            | Mały akcent czerwony                 |
| on-brand          | #FFF9EF            | Tekst na ciemnym tle                 |

Wartości są startowe; przed użyciem sprawdzić kontrast konkretnych par. Minimum 4,5:1 dla zwykłego tekstu, 3:1 dla dużego tekstu oraz wymagających tego elementów interfejsu. Dekoracyjny border nie jest automatycznie wystarczającym obrysem inputu. Error/success/warning mają osobne semantyczne style i etykiety; nie przekolorowywać błędów na zieleń marki.

Obecne `kaya` nie powinno dalej oznaczać jednocześnie marki, focusu i czerwonej dekoracji. Wyszukać każde użycie i przypisać właściwą rolę. Nie wykonywać ślepego globalnego zastąpienia. Zaktualizować również zmienne w `global.css`; jedno źródło wartości, bez równoległych rozbieżnych palet.

### 3.2 Typografia

Propozycja do makiety i prototypu: **Noto Serif** dla publicznych nagłówków oraz **Noto Sans** dla treści, nawigacji i panelu administratora. Przed zatwierdzeniem fontów sprawdzić rzeczywiste pliki, licencję, polskie znaki i ukraińską cyrylicę; nie oceniać wyłącznie łacińskiego nagłówka. Wariant alternatywny: wszystkie teksty w dopracowanym sans, jeśli właściciel uzna serif za zbyt formalny.

| Styl         | Desktop  | Telefon  | Grubość / interlinia |
| ------------ | -------- | -------- | -------------------- |
| Hero         | 56–64 px | 36–42 px | Serif 500–600 / 1,10 |
| H1 podstrony | 44–48 px | 32–36 px | Serif 500–600 / 1,15 |
| H2           | 32–36 px | 26–30 px | Serif 500–600 / 1,20 |
| H3           | 20–24 px | 20–22 px | Sans 600 / 1,30      |
| Lead         | 18–20 px | 18 px    | Sans 400 / 1,55      |
| Body         | 16–18 px | 16 px    | Sans 400 / 1,65      |
| Meta         | 14 px    | 14 px    | Sans 400–500 / 1,45  |

Użyć płynnych rozmiarów tam, gdzie ma to sens; tekstu nie zmniejszać w celu ukrycia błędów układu. Akapity ograniczyć do około 60–70 znaków w wierszu. Nie wymuszać łamania polskiego tytułu znacznikiem `<br>` wspólnym dla wszystkich języków. Wąska kolumna i `text-wrap: balance` mogą zapewnić podobny efekt.

Fonty hostować lokalnie jako WOFF2, `font-display: swap`. Ładować tylko używane odmiany i zakresy znaków; nie preloadować wszystkich fontów. Dodać pliki licencji. Nie wprowadzać biblioteki UI ani frameworka animacji dla tej zmiany.

### 3.3 Geometria i detale

- Jeden Container: szerokość maksymalna 1200 px, wyśrodkowany; padding 20 px na małych ekranach i 32 px na większych. Przy 320 px dopuścić 16 px.
- Sekcje: zwykle 64–80 px pionowo desktop, 40–48 px mobile. Hero około 48–64 px, bez pustego pasa nad tytułem i bez `min-height: 100vh`.
- Rytm odstępów: 4, 8, 12, 16, 24, 32, 48, 64, 80 px. Unikać podwójnego paddingu rodzica i dziecka.
- Border radius: przyciski 8 px, obrazy/panele 12 px. Bez wszechobecnych kapsułek.
- Domyślnie płaskie powierzchnie, cienkie separatory; cienie tylko gdy pomagają rozróżnić warstwy, np. menu.
- Maksymalnie jeden motyw: dyskretna siatka gobanu w wybranym narożniku. Dekoracyjny SVG/CSS, `aria-hidden`, bez przechwytywania kliknięć. Bez tekstury pod treścią, pagód, losowych znaków kanji i sakury.
- Przejścia kolorów 150–200 ms; zachować `prefers-reduced-motion`. Bez parallaxu i animowanych wejść wymaganych do zobaczenia treści.

## 4. Strona główna — kolejność i zachowanie

### A. Header

Cream/paper, znak i nazwa klubu po lewej, nawigacja, widoczne języki oraz główne CTA. Wysokość wynika z treści, orientacyjnie 80–88 px na desktopie. Obecny sticky header może pozostać, z subtelną linią zamiast ciężkiego cienia.

Logo: prosty wektorowy znak fragmentu siatki i dwóch kamieni, obok czytelny napis. Znak w makiecie to kandydat, nie zatwierdzone logo. Jeden komponent `BrandMark` dla nagłówka i stopki, wariant jasny/ciemny; odsyłacz ma dostępną nazwę klubu. Nie wycinać logo z wygenerowanego obrazu.

Zachować wszystkie istniejące odsyłacze, w tym Strona główna, nawet jeśli obraz poglądowy je upraszcza. Aktywna trasa musi być rozpoznawalna także bez koloru. Przełącznik języka: flagi oraz widoczne PL/EN/UK (lub obecna zatwierdzona etykieta), nie tylko flagi i nie wewnątrz hamburgera. Zachować działające zasady dla `/admin`, który nie ma wersji językowych.

Przejście do mobilnej nawigacji uzależnić od rzeczywistego miejsca. Punkt wyjścia: pełna nawigacja dopiero od 1100 px; sprawdzić szczególnie 768–1100 px i wersję ukraińską. Na telefonie pierwszy wiersz: znak/nazwa i menu; drugi: języki. Nie wymuszać wszystkiego w jednym wierszu kosztem czytelności.

### B. Hero

Desktop od około 960 px: grid 45/55, gap 40–48 px, pionowe wyrównanie środkiem. Lewa kolumna: mała etykieta klubu, H1, istniejący podtytuł, CTA główne do `#spotkania`, drugie do lokalizowanej `/zacznij`. Etykietę pominąć, jeżeli powtarzanie nazwy przeciąża kompozycję.

Prawa kolumna: naturalna fotografia gobanu i goke, proporcja około 4:3, bez obwódki, owalu, napisów i brązowego tła. Na desktopie obraz ma współtworzyć górę strony, nie pojawiać się pod przyciskami.

Mobile: tekst, CTA, obraz; pojedyncza kolumna. Przyciski mogą być pełnej szerokości; poniżej 400 px domyślnie jeden pod drugim. Obraz 4:3 lub 3:2 zależnie od zatwierdzonego kadru. Nie przycinać najważniejszych miseczek i kamieni. Żadnej stałej wysokości ukrywającej dłuższe tłumaczenie.

### C. Krótkie informacje dla nowych osób

Piaskowy pas, cztery lekkie elementy z tytułem i krótkim opisem opartym na obecnych `homepage:reassurance_*`. Desktop cztery kolumny, tablet dwie, telefon jedna lub dwie tylko jeśli opisy pozostają wygodne. Zachować informację o sprzęcie, darmowym wstępie, początkujących i dzieciach. Zrezygnować z czterech ciężkich kart z cieniami. Nagłówek może być niewielki; zachować logiczną hierarchię HTML.

### D. Spotkania

Wspólny `MeetingSection`: opis/zaproszenie po lewej, piaskowy panel z terminem i adresem po prawej. Telefon: jedna kolumna. Jeden kanoniczny blok szczegółów, bez niezależnie wpisanych kopii danych.

Zachować dzień tygodnia, godziny, nazwę miejsca, adres, salę, wskazówkę wejścia, informację o bezpłatności oraz oba linki mapy. Nie nazywać regularnego terminu „najbliższym spotkaniem”, jeśli nie ma obsługi wyjątków. Na makiecie dane są przykładowym odwzorowaniem konfiguracji, nie potwierdzonym harmonogramem. Ewentualna adnotacja o niepotwierdzonych danych dotyczy projektu do przeglądu i nie ma automatycznie trafiać do produkcji.

Dodać odpowiedni `scroll-margin-top`, aby sticky header nie zasłaniał celu głównego CTA. Sprawdzić to przy mobilnym nagłówku z dwoma rzędami i powiększonym tekście.

### E. Aktualności

Nagłówek i odsyłacz do wszystkich wiadomości, pod nimi istniejący `NewsFeed limit={3}`. Karty: spójny kadr zdjęć, meta/data, tytuł sans 600 i czytelny tekst. Brak obrazu nie generuje pustej ramki ani fikcyjnego zdjęcia.

Zaprojektować loading, empty, unconfigured, error oraz 1/2/3 wpisy. Makieta pokazuje pusty stan, by nie wymyślać wydarzeń. W implementacji zachować odrębność stanów oraz istniejącą obsługę błędów. Nie zastępować błędu komunikatem, że nie ma wpisów.

### F. Footer

Ciemna zieleń, kremowy tekst, delikatne separatory. Desktop trzy kolumny: marka, nawigacja, kontakt/spotkania. Telefon w jednej kolumnie, tekst do lewej. Zachować obecne kanały i link prywatności; nie dopisywać nieznanego e-maila. Mały czerwony detal opcjonalny. Usunąć bezwarunkowe `mt-24`; odległość od poprzedniej sekcji kontroluje układ strony.

### G. MobileCta

Sprawdzić istniejący komponent przed zmianą. Jeśli pasek jest sticky/fixed: uwzględnić safe-area, dolny padding strony i brak zasłaniania stopki/treści. Nie dodawać drugiego konkurencyjnego paska. Zachować istniejące reguły widoczności; na `/admin` nie powinien przeszkadzać w edycji.

## 5. Podstrony i panel

| Widok / plik                                              | Wymagana zmiana                                                         | Zachowanie do ochrony                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `OKlubiePage.tsx`                                         | Spójny PageIntro; opis i zdjęcie w dwóch kolumnach, lekkie zaproszenie  | Bez wymyślania historii, członków i osiągnięć                                         |
| `ZacznijPage.tsx`                                         | Nowy PageIntro, uporządkowane sekcje zasad, kroki i FAQ                 | Kolejność instrukcji, działanie accordionu i dostępne nazwy                           |
| `RulesSection.tsx`                                        | Spójne ramki i odstępy diagramów; proporcje obrazów zachowane           | Czytelność siatki i poprawność przykładów; nie zastępować ich generowanymi diagramami |
| `AktualnosciPage.tsx`, `NewsFeed.tsx`, `NewsPostCard.tsx` | Wspólne karty i stany, estetyczne wpisy z obrazem i bez                 | Dane, daty, cała istniejąca treść i zachowanie obrazów                                |
| `KontaktPage.tsx`                                         | PageIntro, kanały kontaktu w czytelnym układzie, wspólna sekcja spotkań | Fakty i osoby tylko z konfiguracji, brak nowego formularza                            |
| `PrivacyPage.tsx`                                         | Wąska kolumna tekstu, hierarchia i listy                                | Pełna treść, czytelne linki                                                           |
| `NotFoundPage.tsx`                                        | Mały motyw planszy, czytelna akcja powrotu                              | Prawidłowy lokalizowany link                                                          |
| `AdminPage.tsx` i `components/admin/*`                    | Kolory, typografia sans, inputs, odstępy, focus, statusy, przyciski     | Logowanie, uprawnienia, edycja, publikacja, upload, błędy, potwierdzenia              |

Na O klubie preferowane jest prawdziwe zdjęcie spotkania dostarczone przez właściciela. Bez niego zastosować kadr samego sprzętu lub kompozycję typograficzną; nie przedstawiać wygenerowanych ludzi jako członków klubu. Brak zdjęcia nie może pozostawiać dziury w layoucie.

Panel administratora ma być funkcjonalnie gęstszy: bez serifowych etykiet pól, wielkiego hero i ozdobnych teł formularzy. Sama zmiana wspólnych przycisków też wymaga kontroli panelu.

## 6. Materiały graficzne i wydajność

### Obraz hero — brief

Fotograficzny fragment gobanu z jasnego miodowego drewna, dwie drewniane goke, kilka czarnych i białych kamieni, boczne miękkie światło. Regularna siatka w poprawnej perspektywie; kamienie na przecięciach. Naturalne materiały, spokojna kolorystyka zgodna z paletą. Bez tekstu, ram, owalnego kadru, dłoni i przypadkowych rekwizytów. Kompozycja dopuszcza crop desktop i mobile. To osobny plik produkcyjny; nie wycinać zdjęcia z makiety strony.

Kontrola przez osobę znającą Go: linie, skrzyżowania, geometria kamieni, proporcje misek, brak absurdalnych obiektów. Przy nieudanej generacji użyć dobrej fotografii na odpowiedniej licencji. Nie wymuszać pełnej planszy 19×19, gdy bliski kadr pozwala na lepszą kompozycję.

Przygotować warianty około 640/960/1440 px; AVIF/WebP z fallbackiem zależnie od pipeline. Orientacyjny budżet pobranego hero 150–300 KB; odchylenia uzasadnić jakością. Zachować width/height lub aspect-ratio; hero eager, pozostałe obrazy lazy. Rozważyć wysoki priorytet tylko dla obrazu będącego LCP. Nie osadzać tekstu w obrazach. Dekoracyjny obraz może mieć pusty alt; zdjęcie ilustrujące istotną treść otrzymuje lokalizowany opis.

Docelowe foldery: `public/assets/brand/`, `public/assets/hero/`, opcjonalnie `public/assets/club/`, `public/fonts/`. Dodać manifest źródeł/licencji, użytych kadrów i punktów `object-position`. Nie kasować starego zasobu, dopóki nie zostaną sprawdzone wszystkie odwołania.

## 7. Mapa techniczna

| Obszar        | Pliki / zadanie                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| System stylów | `tailwind.config.js`, `src/styles/global.css`: tokeny, fonty, skala, focus, ograniczenie szerokości                                     |
| Primitives    | `src/components/primitives.tsx`: Container, Section z jawnymi wariantami, Button ze wspólną wysokością/paddingiem, Card/Chip/SmartImage |
| Marka         | Nowy mały `BrandMark.tsx`, opcjonalnie `PageIntro.tsx`; bez nadmiernej abstrakcji                                                       |
| Otoczka       | `Header.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx`, `MobileMenu.tsx`, `MobileCta.tsx`                                                   |
| Główna        | `HomePage.tsx`, `MeetingSection.tsx`, komponenty aktualności                                                                            |
| Podstrony     | Pliki wymienione w sekcji 5                                                                                                             |
| Tłumaczenia   | `src/i18n/locales/{pl,en,uk}/translation.json`: tylko potrzebne nowe klucze, pełny parytet                                              |
| Dokumentacja  | `AGENTS.md`, `docs/ULTIMATE_IMPLEMENTATION_PLAN.md`, status wdrożenia i plan wizualny                                                   |

Obecne Section łączy `py-16` z klasami przekazywanymi przez rodzica. Nie zakładać, że kolejność stringów Tailwinda rozstrzyga konflikt. Wprowadzić jednoznaczne warianty spacingu i usuwać konkurujące utilities w miejscach użycia. Podobnie uporządkować Container, który obecnie bywa zastępowany lokalną szerokością nagłówka i stopki.

Podstawowe warianty Button: primary, secondary, ewentualnie text; destructive tylko jeżeli odpowiada istniejącej akcji panelu. Minimum 44 px wysokości interaktywnych celów jako założenie projektowe. Odrębne hover, focus-visible i disabled. Focus czytelny na jasnym i ciemnym tle; nigdy samo `outline-none` bez zamiennika.

## 8. Etapy dla agenta i kryteria zakończenia

Wykonywać pojedyncze etapy, kończyć je weryfikacją i małym commitem. Nie łączyć kosmetyki z refaktorem danych. Akceptacja kierunku wizualnego następuje przed seryjną zmianą podstron; później nie pytać o każdą rutynową decyzję implementacyjną.

### V0 — Ustalenie punktu odniesienia (1–2 h)

Przeczytać AGENTS i aktualne dokumenty; zapisać SHA i status roboczy, uruchomić projekt zgodnie z README. Zebrać bazowe screenshoty. Zapisać istniejące błędy niezależne od stylów. Po zatwierdzeniu kierunku uaktualnić „locked” zasady designu tak, aby nie pozostawały sprzeczne z nowym planem; architektura aplikacji pozostaje ta sama.

Odbiór: lista ekranów/states, brak domysłów o brakujących danych, jednoznacznie zapisany zatwierdzony kierunek.

### V1 — Makieta i decyzje wizualne (3–6 h)

Ocenić koncepcję desktop/mobile. Ustalić paletę, serif lub sans, charakter fotografii, znak marki, gęstość odstępów. Jeśli trzeba, wykonać jedną skoordynowaną korektę makiety. Następnie prototyp w prawdziwym HTML/CSS służy do potwierdzenia fontów i łamania tekstu; raster nie jest dowodem responsywności.

Odbiór: zapisane decyzje, zaakceptowany pierwszy ekran i kierunek stopki; brak otwartych fundamentalnych zmian stylistycznych.

### V2 — Zasoby i fundament (4–8 h)

Przygotować finalny hero, fonty i SVG znaku. Wprowadzić tokeny, primitives i focus. Usunąć konflikty odstępów w zmienianych miejscach. Sprawdzić podstawowe stany interaktywne oraz polskie/ukraińskie znaki.

Odbiór: brak nowych fontów pobieranych z przypadkowych CDN; pliki licencji; poprawne kontrasty; podstawowe komponenty działają desktop/mobile.

### V3 — Home i wspólna otoczka (6–10 h)

Header/footer, hero, reassurance, MeetingSection, aktualności, mobile CTA. Zachować zawartość i zachowanie nawigacji. Sprawdzić skok do spotkań, menu klawiaturą oraz puste i błędne stany aktualności.

Odbiór: porównanie desktop/mobile z zatwierdzoną makietą; brak starego owalnego baneru; wszystkie przyciski działają; brak ścisku nagłówka przy szerokościach pośrednich.

### V4 — Podstrony i admin (4–8 h)

Zastosować sekcję 5, zachowując semantykę i istniejące funkcje. Nie tworzyć dodatkowych pustych sekcji, żeby „wypełnić stronę”. Dla brakujących zdjęć użyć zaprojektowanego wariantu bez zdjęcia.

Odbiór: żadna strona nie zachowuje przypadkowo starego systemu wizualnego; panel pozostaje czytelny i sprawny.

### V5 — Odbiór techniczny i wizualny (4–8 h)

Wykonać macierz kontroli z sekcji 9, poprawić konkretne problemy, uruchomić `npm run check` wymagane przez repo. Zebrać screenshoty po zmianie i raport. Nie publikować w ramach tego etapu.

Odbiór: zaliczone kontrole lub jawnie opisane blokady, komplet screenshotów, lista zmienionych plików, instrukcja wycofania zmian.

Łącznie orientacyjnie **22–42 godziny**, plus ewentualna dodatkowa runda wyboru grafik/logo. To szacunek pracy z przeglądem, nie obietnica czasu działania modelu. Pełna identyfikacja wizualna, nowe treści i wdrożenie są osobne.

## 9. Macierz kontroli

- Publiczne strony: Home, O klubie, Zacznij, Aktualności, Kontakt, Prywatność, 404 — co najmniej 390 i 1440 px; dodatkowo sprawdzenie przepełnień 320, 768, 1024 i 1920 px.
- Home/header/footer: PL, EN, UK na telefonie i desktopie. Pozostałe strony: przegląd każdego języka pod kątem przepełnień i brakujących znaków.
- Menu: klawiatura, otwarcie/zamknięcie, Escape i zarządzanie focusem zgodnie z istniejącą implementacją, poprawne działanie po zmianie trasy.
- Zoom 200%; reflow przy efektywnej szerokości 320 px; brak poziomego scrolla i zakrywania treści przez fixed/sticky.
- CTA i linki: lokalizowane trasy, kotwica spotkań, linki map i kontaktu, prywatność, przełączanie języków i `/admin`.
- FAQ, diagramy zasad, news z długim tytułem, news bez obrazka, 1/2/3 wpisy, loading/empty/error/unconfigured.
- Admin: login/logout, brak uprawnień, lista pusta i pełna, formularz z błędem i poprawny, stan zapisu, upload/progress/error, obraz istniejący i nowy. Wszelkie testowe mutacje na danych testowych, nie na produkcyjnych wpisach.
- Obejrzeć focus i kontrast ręcznie; automatyczny audyt dostępności jest wsparciem, nie pełnym dowodem.
- Sprawdzić brak błędów konsoli i niedostępnych zasobów; rozmiar hero, ładowanie fontów i brak zauważalnego przesuwania layoutu.
- Porównać wydajność przed/po przy tych samych warunkach. Orientacyjne cele: LCP ≤2,5 s i CLS ≤0,1; lokalny pomiar laboratoryjny nie zastępuje danych rzeczywistych użytkowników.
- `npm run check`: lint, format, typecheck, testy, build zgodnie z aktualnym package.json. Nowe testy tylko dla zmienionego zachowania; nie pisać testów sprawdzających dosłowne klasy CSS.

### Wizualne kryteria odbioru

1. Header, treść i footer mają zgodne linie wyrównania.
2. Na desktopie hero łączy tekst i obraz, bez dużego pustego pasa pod nawigacją.
3. Nagłówki nie są wszędzie extrabold; hierarchia wynika z kroju, wielkości i odstępów.
4. Widać przemyślane przejście paper → sand → paper → ciemna stopka.
5. Nie ma losowych ramek, odcieni szarości i rozmiarów przycisków spoza systemu.
6. Makieta nie wymusza cięcia tekstów, danych ani funkcji.
7. Wszystkie podstrony są dopracowane także bez dodatkowej treści właściciela.

## 10. Przekazanie i wycofanie

Pracować na osobnej gałęzi, np. `design/paper-goban`, po potwierdzeniu aktualnego stanu repozytorium. Nie zmieniać Supabase ani konfiguracji produkcji. Małe commity odpowiadają etapom. Wycofanie przez revert commitów warstwy wizualnej; bez resetowania cudzych zmian i bez operacji na bazie.

Raport końcowy agenta: lista zmian i nowych assets/licencji, wykonane komendy, wyniki kontroli, screenshoty desktop/mobile, znane odstępstwa od makiety, brakujące materiały właściciela. Przy błędzie testów podać, czy był obecny przed zmianami. Nie ogłaszać gotowości do wdrożenia na podstawie samego buildu.

## 11. Zrzuty przydatne w kolejnej rundzie

Pierwsza makieta nie wymaga kolejnych screenshotów. Do dopracowania wdrożenia przydadzą się pełne strony Home, O klubie, Zacznij, Aktualności, Kontakt oraz panel: lista wpisów i formularz z otwartym wyborem obrazu. Najbardziej użyteczne pary to 1440 px desktop i 390 px mobile przy zoomie 100%. Dołączyć rozmiar viewportu i stan danych. Usunąć prywatne informacje administratora.

Opcjonalne miejsce w repo: `docs/design/reference/`, nazwy np. `before-home-pl-1440.png`, `before-start-pl-390.png`, `before-admin-editor-1440.png`. Nie wkładać screenshotów dokumentacyjnych do `public/`. Obrazy makiet oznaczyć `concept`, a prawdziwe screenshoty `before`/`after`.

## 12. Polecenie startowe dla agenta

> Przeczytaj AGENTS.md, ten plan oraz aktualne dokumenty architektury. Potwierdź w kontekście zadania, która wersja kierunku wizualnego została zaakceptowana. Rozpocznij od V0, zapisz punkt odniesienia i istniejące błędy. Wykonuj małe etapy V2–V5 zgodnie z zatwierdzoną makietą i specyfikacją; V1 dokończ, jeśli decyzje wizualne pozostają otwarte. Zachowaj routing, dane, tłumaczenia, uprawnienia i funkcje. Traktuj obraz makiety jako referencję kompozycji, a ten dokument i istniejące źródła jako specyfikację treści oraz zachowania. Przy sprzeczności nie pomijaj funkcji tylko dlatego, że nie widać jej na obrazie. Po każdym etapie zweryfikuj wynik i odnotuj odstępstwa. Nie publikuj strony bez odrębnego zadania wdrożeniowego.
