# Punkt wznowienia — Papier i goban

## Aktualizacja 2026-10-01 — V4 zakończone

Wdrożono wygląd sześciu publicznych podstron oraz kompaktowego panelu admina.
Zachowano treści, oryginalne diagramy, routing, tłumaczenia i operacje danych.
Poprawiono dostępność błędów formularza, przycisków zdjęć i siatkę daty/kategorii
przy 320 px oraz tekście 200%. Przeglądy wizualny/statyczny delegowano;
główny Codex sprawdził poprawki i wykonał mockowane próby formularza w przeglądarce.
`npm run check` PASS: **116 testów**, lint, format, typecheck i build.
Raport z listą plików, dowodami i granicami: [V4](V4-podstrony-admin.md).
Kolejny zakres po poleceniu właściciela: **V5 — pełny odbiór techniczny i wizualny**.
Nie publikowano strony ani nie mutowano produkcyjnego Supabase.
Poniższe notatki o V3.2, oczekiwaniu na zdjęcia i dawnym stanie kodu są historią.

## Następna sesja — V5

Właściciel zapowiedział kontynuację wieczorem. Zacząć od **V5 — odbioru
technicznego i wizualnego**, zgodnie z sekcją 9
[planu wizualnego](LKG-plan-wizualny-v1.md). V2–V4 są zakończone; nie wracać
do generowania hero ani implementacji podstron bez nowego zgłoszenia.

Na początku sprawdzić `git status`, bieżący SHA/gałąź i to, czy lokalny Vite
działa; zachować wszystkie istniejące zmiany i nie resetować roboczego drzewa.
Przeczytać `AGENTS.md`, ten plik, plan wizualny i raporty V2–V4. Użyć istniejącej
przeglądarki/kroku sprawdzania zgodnie z lokalną konfiguracją; kontrolować
nawigację wspólnej przeglądarki kolejno. V4 ma dowody w ignorowanym
`.playwright-mcp/v4/`, a zakres administracyjny można odtworzyć przez
mockowany skrypt `.playwright-mcp/v4/admin-regression.txt`.

Kolejność odbioru V5:

1. Przejść Home, O klubie, Zacznij, Aktualności, Kontakt, Prywatność i 404 przy
   390/1440 px; sprawdzić przepełnienia przy 320/768/1024/1920 px.
2. Sprawdzić Home/header/footer w PL/EN/UK na mobile i desktop; pozostałe strony
   we wszystkich językach pod kątem przepełnienia i brakujących znaków.
3. Zweryfikować menu klawiaturą, Escape/focus i zmianę trasy; linki, CTA,
   kotwicę spotkań, mapę, kontakt, prywatność, przełączanie języka i `/admin`.
4. Sprawdzić tekst 200% przy efektywnym 320 px, FAQ, diagramy, newsy z długim
   tytułem i bez zdjęć oraz stany loading/empty/error/unconfigured.
5. Odebrać widoki admina i upload przez istniejące mocki. RLS lub inne mutacje
   wolno wykonywać tylko na jawnie testowych danych/środowisku; nie na produkcji.
6. Obejrzeć focus, kontrast, konsolę i brakujące zasoby. Zmierzyć hero, fonty,
   przesunięcia layoutu oraz porównywalną wydajność (orientacyjnie LCP ≤2,5 s,
   CLS ≤0,1; pomiar lokalny nie jest danymi produkcyjnymi).
7. Uruchomić `npm run check`, zebrać komplet zrzutów i raport: zmiany, kontrole,
   wyniki, znane odstępstwa i instrukcja wycofania. V5 nie obejmuje publikacji.

Nie wszystkie punkty są jeszcze odebrane ręcznie przez klub: produkcyjne
środowisko, potwierdzenie faktów/tłumaczeń i ludzki sign-off pozostają osobnymi
granicami. Ostrzeżenia znane z ostatniego buildu to jsdom `scrollTo` oraz chunk
ponad 500 kB; sprawdzić, czy nadal występują, i opisać bez nieuzasadnionego
refaktoru. Pełna specyfikacja V5 jest w sekcjach 9–10 planu.

## Historia: aktualizacja 2026-10-01 — V3.2 zakończone

Właściciel zaakceptował nowy hero i zlecił V3.2. Home/wspólna otoczka V3 są
zakończone: lekki piaskowy pas informacji, opis spotkań i panel szczegółów,
układ aktualności z lokalizowanym błędem i mobilny CTA z mierzoną rezerwacją
miejsca oraz przejściem do przepływu przy dużym powiększeniu tekstu.
Poprawiono zawijanie nagłówków news/hero przy 320 px i tekście 200%.
`npm run check` PASS: **110 testów**, lint, format, typecheck i build.
Niezależne przeglądy `visual_reviewer` i `regression_reviewer` PASS po poprawkach.
Raport i granice: [V3.2](V3.2-home-spotkania-aktualnosci.md).
Kolejny zakres po poleceniu właściciela: **V4 — podstrony i admin**;
następnie V5 — pełny odbiór. Nie publikowano strony ani nie zmieniano Supabase.
Poniższe notatki z 30.09 i sprzed V3.2 pozostają zapisem historycznym.

## Historia: aktualizacja 2026-10-01 — zaakceptowana korekta hero

Właściciel dostarczył `reference/board.jpg`: oryginalną grafikę z kamieniami
wyretuszowanymi przez Opusa 5.5 (według informacji właściciela). Zaakceptował
ten obraz do strony głównej zamiast planowanych zdjęć fizycznej planszy.
Aplikacja używa teraz `public/assets/hero/board-retouched-{640,960,1440}.{avif,webp,jpg}`,
z pełnym kadrem 3:2. Źródło 1536×1024 px nie wymaga powiększenia.
Pochodzenie i warianty opisuje `public/assets/hero/README.md`.
Weryfikacja: `npm run check` PASS (103 testy, lint, format, typecheck, build).
Playwright: 320, 390, 430, 768, 1024 i 1440 px przy standardowym tekście;
nowy AVIF ładuje się, proporcje 3:2 i pełny kadr zachowane, bez poziomego
przewijania i błędów konsoli. Obejrzano zrzuty 390×844 i 1440×1000 px:
`.playwright-mcp/hero-retouched-{mobile,desktop}.png` (ignorowane przez Git).
Pozostają wcześniejsze ostrzeżenia jsdom `scrollTo` i bundla ponad 500 kB.
Poniższe oczekiwanie na zdjęcia i wcześniejsze ścieżki hero są zapisem
historycznym sesji 30.09; w chwili samej podmiany hero V3.2 nie było rozpoczęte.

Zapis sesji: **2026-09-30**. Na prośbę właściciela kończymy na dziś.
Właściciel planuje dostarczyć zdjęcia fizycznej planszy następnego dnia.
Nie rozpoczynać kolejnego etapu bez jego polecenia.

## Historia: stan kodu i odbioru przed etapami V3.2–V4

- Gałąź: `design/paper-goban`; ostatni commit aplikacji: **`f6b760b`**
  (`design: implement V3.1 header, footer and home hero`).
- V0, V2 i V3.1 zakończone. V3 jako całość nie jest jeszcze ukończone.
- V3.1: współdzielony BrandMark, papierowy Header, aktywna nawigacja,
  flagi + PL/EN/UKR poza hamburgerem, zielona Footer i hero tekst–zdjęcie.
  Mobilny Header przewija się; sticky od 1100 px. Escape przywraca fokus;
  CTA odsłania sekcję spotkań.
- Ostatni gate kodu: `npm run check` PASS, **103 testy**, lint, format,
  typecheck i build. Playwright: PL/EN/UK, 320–1440 px, bez poziomego
  przewijania przy zwykłym tekście. Szczegóły:
  [raport V3.1](V3.1-naglowek-stopka-hero.md).
- Nie było publikacji, push ani zmian danych Supabase.

## Historia: hero przed dostarczeniem zaakceptowanej grafiki

Właściciel zaakceptował **kompozycję kadru**, zielone rozmyte tło, róg gobanu
i dwa goke. Zachować te elementy. Odrzucił rozstawienie kamieni: część nie
leży na przecięciach, a rozrzucona pozycja nie wygląda jak przemyślana gra.
Układ w `reference/concept-a-paper-goban.png` jest lepszym odniesieniem.
Białe kamienie mają wyglądać jak muszlowe, z subtelnymi beżowymi prążkami.

Przeprowadzono dwie edycje przez wbudowany `image_gen`, zachowując kadr.
Uzyskano zwartą grupę sześciu kamieni i prążki muszli, lecz **właściciel
odrzucił także ten wariant**: układ nadal wygląda bardzo źle.
Nie traktować go jako zaakceptowanego ani jako poprawnej geometrii Go.

- Odrzucony kandydat: [hero-shell-v2.png](reference/hero-shell-v2.png).
- Pochodzenie i dokładne prompty: [notatka generacji](reference/hero-shell-v2.md).
- Referencja materiału: zdjęcie z Reddit wskazane przez właściciela,
  podlinkowane w notatce generacji; lokalna kopia pomocnicza w ignorowanym
  `.playwright-mcp/v3-1/shell-stones-reference.jpg` może nie przetrwać sesji.
- **Aplikacja nadal używa wcześniejszych**
  `public/assets/hero/goban-goke-{640,960,1440}.{avif,webp,jpg}`.
  Nie podmieniono zasobów ani `HomePage.tsx` na odrzucony wariant.

### Historia: zdjęcia, które właściciel planował przygotować

Najbardziej użyteczne są jednoznaczne odniesienia do **tej samej rzeczywistej
pozycji**, a nie wiele różnych układów:

1. Kadr fizycznej planszy z kamieniami pod kątem zbliżonym do obecnego hero.
2. Widok tej samej pozycji z góry, pokazujący przecięcia i relacje kamieni.
3. Opcjonalnie zbliżenie kamieni muszlowych; referencja materiału już istnieje.

Po otrzymaniu zdjęć: obejrzeć je, wybrać jedno jako wzorzec konkretnej pozycji,
a pozostałe jako odniesienie perspektywy/materiału. Spróbować edycji
z zachowaniem zaakceptowanego tła i goke. Sprawdzić środki kamieni względem
przecięć, skalę, perspektywę i naturalność pozycji; nie deklarować poprawności
tylko dlatego, że prompt ją wymagał. Jeżeli generacja ponownie zawiedzie,
rozważyć kontrolowany montaż jako osobną uzgodnioną metodę.
Zachować nowe warianty osobno, aż właściciel oceni wynik.

## Historia: następny zakres implementacji — V3.2

Po poleceniu właściciela kontynuować
[plan wizualny](LKG-plan-wizualny-v1.md), sekcje C–F strony głównej:

- Piaskowy, lekki pas informacji dla nowych osób zamiast ciężkich kart;
  zachować cztery istniejące treści.
- Wspólny MeetingSection: opis i panel szczegółów; zachować wszystkie fakty,
  dzień tygodnia, salę, wejście, bezpłatność i oba lokalizowane linki mapy.
- Aktualności: nagłówek/link, istniejący NewsFeed limit 3, pełne stany feedu,
  obrazy i wariant bez obrazu.
- Mobile CTA: widoczność, bezpieczny odstęp dolny, brak zasłaniania treści
  i fokusu także przy powiększeniu tekstu.

Znane kwestie do odbioru V3.2: przy 320 px i tekście 200% stare karty
reassurance/aktualności powodują około 104 px poziomego przepełnienia;
stałe mobile CTA zajmuje zbyt dużo ekranu. Nowe Header/hero/Footer mieszczą
się przy takim powiększeniu. Z V0 pozostaje też techniczny angielski tekst
błędu feedu, do sprawdzenia w kontekście tłumaczeń i stanów aktualności.

Główny Codex jest orkiestratorem: delegować implementację do
`frontend_implementer`, tylko jeden agent edytuje kod aplikacji.
Po ukończeniu Home/wspólnej otoczki zlecić `visual_reviewer` i
`regression_reviewer` przeglądy, poprawić wyniki przed V4. Wspólna przeglądarka
jest używana kolejno. Zachować odziedziczone modele i konfigurację.

## Historia: jak rozpoczynać poprzednią sesję

Przeczytać ten plik, AGENTS.md i plan wizualny; sprawdzić `git status` oraz
aktualny SHA, nie nadpisywać zmian właściciela. Wcześniejszy devserver działał
pod `http://127.0.0.1:5173/`, lecz nie zakładać, że proces przetrwał.
Dowody przeglądarkowe są w ignorowanym `.playwright-mcp/v3-1/`.
Użytkownik pod koniec sesji sygnalizował około 33% pozostałego limitu
pięciogodzinnego; to informacja historyczna, nie stan limitu następnego dnia.
