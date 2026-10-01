# V4 — Podstrony i panel administratora

Data: 2026-10-01. Gałąź: `design/paper-goban`.
Zakres: sekcja 5 zatwierdzonego planu Papier i goban, po ukończeniu V3.

## Zakres wdrożenia

- Wspólny `PageIntro` dla publicznych podstron, semantyczne nagłówki,
  umiarkowane odstępy i zawijanie długich tekstów.
- O klubie: kompozycja typograficzna z dotychczasową treścią i zaproszeniem;
  bez wymyślonej historii, osób lub niezatwierdzonych zdjęć.
- Zacznij: zasady, oryginalne diagramy bez cropu, sześć kroków pierwszej wizyty,
  FAQ i wspólna sekcja spotkań; zachowana kolejność i cała treść.
- Aktualności: wspólny wstęp oraz komponenty feedu ukończone w V3.
- Kontakt: uporządkowane kanały i osoby z konfiguracji, wspólne spotkania.
- Prywatność: wąska kolumna i hierarchia pełnej dotychczasowej treści.
- 404: niewielki dekoracyjny motyw siatki, poprawny lokalizowany powrót.
- Admin: kompaktowa typografia sans, nagłówek H1 także w stanach danych,
  formularze/listy/pola/statusy/focus i dostępne cele przycisków zdjęć.
  Bez zmian logowania, RLS, repozytorium, publikacji, uploadu lub cleanup.
- Błędy pól powiązano z kontrolkami przez `aria-invalid` i `aria-describedby`.
  Podglądy zdjęć używają `object-contain`, etykiety alt są widoczne,
  usuwanie zdjęcia ma pełnowymiarowy przycisk w przepływie zamiast małego overlay.
  Ukryty input ma lokalizowaną nazwę i nie jest osobnym celem Tab;
  wybór zdjęć klawiaturą odbywa się przez widoczny przycisk.

## Weryfikacja

Zmienione pliki V4: `src/components/PageIntro.tsx`, `RulesSection.tsx`,
`src/pages/{OKlubiePage,ZacznijPage,AktualnosciPage,KontaktPage,PrivacyPage,NotFoundPage,AdminPage}.tsx`,
`src/components/admin/{PostList,PostForm,ImagePicker}.tsx`,
`src/styles/global.css`, `src/pages/AdminPage.test.tsx`
i `src/components/admin/PostForm.test.tsx`. Wcześniejsze zmiany V3 i hero zachowano.

- Implementer: focused ESLint PASS, Prettier, 49 testów w dziewięciu plikach PASS.
- Pełny `npm run check` PASS: lint, format, typecheck, 116 testów w 20 plikach,
  build. Znane ostrzeżenia jsdom `scrollTo` i bundla ponad 500 kB pozostają.
- Nowe testy: H1 w pięciu stanach panelu oraz powiązanie i usuwanie komunikatów
  błędów formularza (`aria-invalid` / `aria-describedby`).
- Publiczny przegląd wizualny PASS: sześć podstron PL 390/1440 px, dodatkowe
  szerokości 320/768/1024, EN/UK i tekst 200% przy 320 px bez przepełnienia.
  Diagramy oryginalne i nieprzycięte, pełne treści zachowane.
- Przegląd statyczny regresji wykrył ukryty, nienazwany przystanek Tab przy
  wyborze zdjęć; poprawiono go. Focused ImagePicker testy (3), ESLint i format PASS.
  Końcowy pełny gate po poprawce także PASS (116 testów).
- Panel: obejrzano stany logowania, braku konfiguracji/uprawnień,
  pustej/błędnej/pełnej listy oraz formularz z czterema zdjęciami przy 390/1440 px.
  Kontrola 320/390/430/1440 px bez poziomego przewijania. Przy 320 px i tekście
  200% poprawiono minimalną szerokość siatki daty/kategorii; ponowny pomiar
  `scrollWidth = clientWidth = 305 px`, zrzut obejrzany przez głównego Codexa.
- Regresje formularza PASS: ponowienie błędu listy klawiaturą, walidacja,
  Enter zapisujący szkic, jawna publikacja, blokady podczas zapisu/uploadu,
  opis/usunięcie zdjęcia klawiaturą, zapis edycji i cleanup odrzuconego zdjęcia,
  anulowanie potwierdzenia usunięcia i formularza. Wszystkie zapisy mockowane;
  mocki usunięto i przywrócono Home po kontroli.
- Przegląd wizualny i statyczny regresji delegowano reviewerom; główny Codex
  zweryfikował poprawkę reflow oraz wykonał przygotowany przez regression_reviewer
  skrypt przeglądarkowy. Wyniki: `.playwright-mcp/v4/admin-regression-result.txt`.
- Końcowy `npm run check` po poprawce siatki PASS (116 testów); V4 zakończone.
- Dowody przeglądarkowe: `.playwright-mcp/v4/` (ignorowane przez Git).

## Granice

Materiały osobowe, potwierdzenie faktów i ludzkie tłumaczenia pozostają pracą
właściciela/klubu. V5 to osobny pełny odbiór; publikacja nie jest zakresem V4.
Próby panelu w przeglądarce wymagają mocków lokalnych modułów zamiast mutacji
produkcyjnego Supabase.
