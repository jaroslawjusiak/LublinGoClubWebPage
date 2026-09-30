# Punkt wznowienia — Papier i goban

Zapis sesji: **2026-09-30**. Na prośbę właściciela kończymy na dziś.
Właściciel planuje dostarczyć zdjęcia fizycznej planszy następnego dnia.
Nie rozpoczynać kolejnego etapu bez jego polecenia.

## Stan kodu i odbioru

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

## Hero — najpierw wrócić do tej kwestii

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

### Zdjęcia, które właściciel przygotuje

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

## Następny zakres implementacji — V3.2

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

## Jak rozpocząć kolejną sesję

Przeczytać ten plik, AGENTS.md i plan wizualny; sprawdzić `git status` oraz
aktualny SHA, nie nadpisywać zmian właściciela. Wcześniejszy devserver działał
pod `http://127.0.0.1:5173/`, lecz nie zakładać, że proces przetrwał.
Dowody przeglądarkowe są w ignorowanym `.playwright-mcp/v3-1/`.
Użytkownik pod koniec sesji sygnalizował około 33% pozostałego limitu
pięciogodzinnego; to informacja historyczna, nie stan limitu następnego dnia.
