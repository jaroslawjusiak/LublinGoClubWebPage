# V2 — zasoby i fundament Papier i goban

Wykonano 30.09.2026 na gałęzi `design/paper-goban`, od SHA
`977d68a18f292e5409fad367ca5b8575983349f1`.
Implementację kodu wykonywał wyłącznie `frontend_implementer`; główny agent
przygotował hero, sprawdził fonty, prowadził przeglądarkę i dokumentację.
Osobne recenzje visual/regression zaplanowane są po V3, zgodnie z AGENTS.

## Wprowadzone zmiany

- `public/fonts/`: lokalne variable Noto Sans i Noto Serif, Latin/Latin-ext/Cyrillic,
  WOFF2, `font-display: swap`, bez preloadów i zapytań do fontowego CDN z aplikacji.
  Dwie licencje OFL, źródła i SHA256. FontTools potwierdził komplet 26 polskich
  i ukraińskich znaków, w tym `ҐґЄєІіЇї`, w rzeczywistych tablicach cmap obu rodzin.
- `public/assets/brand/`: oryginalny SVG regularnej siatki z dwoma kamieniami na
  przecięciach. Kandydat do wspólnego znaku w V3, z manifestem pochodzenia.
- `public/assets/hero/`: samodzielny obraz wygenerowany wbudowanym `image_gen`,
  640/960/1440 px, AVIF/WebP/JPEG. Źródło, pełny prompt i kontrola kadru
  w lokalnym README. Przegląd agenta, nie osobny odbiór człowieka znającego Go.
  Zalecany pełny kadr 4:3; pliki 1440 px: AVIF 89 842 B, WebP 139 482 B,
  JPEG 260 500 B. Wszystkie dziewięć wariantów dekoduje się w przeglądarce.
- `tailwind.config.js`, `src/styles/global.css`: papier, piasek, grafit, zieleń,
  osobny czerwony akcent, mocniejszy obrys pól; źródło wartości w Tailwind,
  zmienne CSS z `theme`. Serif w publicznych H1/H2, sans w treści i adminie;
  płynna skala i globalny dwukolorowy focus, zachowany reduced motion.
- `primitives.tsx`: Container max1200 i jawny wariant reading, padding 16/20/32 px;
  Section z jawnym spacingiem; Button własny padding, min44 px, primary/secondary/
  destructive i disabled; płaskie Card/Chip, opcjonalne srcSet/sizes SmartImage.
- Minimalne klasy konsumentów: Header/Footer/LanguageSwitcher/MobileMenu/
  MobileCta/MeetingSection/NewsPostCard/RulesSection, admin ImagePicker/PostForm/
  PostList oraz publiczne strony i AdminPage. Usunięto użycia `kaya`, rozdzielając
  marka/focus od akcentów. Container reading zastępuje konkurujące `max-w`;
  Button nie konkuruje już z paddingiem rodzica. Nie zmieniano treści ani danych.
- Header i MobileMenu mają wspólny próg 1100 px. Po nowych fontach kontrola
  wykazała przepełnienie starego nagłówka przy 768 px także w EN. Przesunięcie
  progu usunęło problem w całej sprawdzonej macierzy. Flagi PL/EN/UKR pozostają
  widoczne, na mniejszych ekranach poza menu. Home używa `text-display`.
- `primitives.test.tsx`: test, że native disabled Button nie wywołuje kliknięcia.

Nowy hero i znak są przygotowane do V3; nie podłączono ich do starego układu.
Publiczne układy, ciemna stopka i pozostałe rozmiary nagłówków należą do V3/V4.

## Walidacja i kontrast

`frontend_implementer` wykonał pełny `npm run check` po końcowych poprawkach:
lint → format → typecheck → **102 testy w 19 plikach** → build: PASS.
`git diff --check`: PASS. Dodatkowe narzędzia Pillow/fontTools były używane
poza zależnościami aplikacji; package.json i lockfile nie zmieniono.

Żeby przywrócić pełny gate, sformatowano 12 plików blokujących go w V0:
osiem repository SKILL.md, `.codex/README.md`, `AGENTS.md`, plan wizualny
i ULTIMATE_IMPLEMENTATION_PLAN. Wyłącznie formatowanie, bez zmiany instrukcji.

| Para                   | Kontrast                               |
| ---------------------- | -------------------------------------- |
| ink / paper            | 13,25:1                                |
| muted-text / paper     | 5,70:1                                 |
| muted-text / surface   | 6,26:1                                 |
| muted-text / sand      | 4,78:1                                 |
| on-brand / brand       | 9,58:1                                 |
| on-brand / brand-hover | 11,71:1                                |
| accent / paper         | 4,65:1                                 |
| accent / sand          | 3,91:1 — nie używać jako małego tekstu |
| border / surface       | 1,64:1 — tylko dekoracja               |

Pola admina używają `border-control` (jak muted-text), a nie dekoracyjnego border.
Usuwanie pozostaje osobnym czerwonym wariantem, nie kolorem marki.

## Przegląd w przeglądarce

Główny agent, istniejący Playwright MCP, jeden kontekst, kontrole kolejno.
Adres z terminala: `http://127.0.0.1:5173/`.
Po zmianie Tailwind konieczny był restart długo działającego dev-servera;
stary proces raportował brak nowego tokena. Świeży proces działa poprawnie.

- Home PL/EN/UK: **320, 390, 768, 1024, 1099, 1100, 1440, 1920 px**.
  Brak poziomego przepełnienia; trzy widoczne flagi, poprawne html lang.
  Hamburger do 1099 px, pełna nawigacja od 1100 px.
- Fonty rzeczywiście loaded; zasoby WOFF2 pobierane z lokalnego `/fonts/`,
  cyrylica ładowana w UK. H1 publiczne Noto Serif 500, body Noto Sans.
  Hero H1: 36 px przy 320/390, 47,04 przy 768, 54,72 przy 1024, 64 przy 1440/1920.
- Kontakt/Prywatność/Zacznij/Admin: 320, 390, 1440 px, brak przepełnienia;
  nagłówek admina Noto Sans. Wysokość sprawdzonych wspólnych przycisków
  co najmniej 47,7 px; Home ok. 49,3 px.
- Primary: normal RGB41/72/63, hover32/58/50. Disabled ma normalne tło,
  opacity 0,5 i cursor not-allowed. Blokowanie kliknięć sprawdzone testem.
- Focus obejrzany na rzeczywistym przycisku Home i na tymczasowej, usuniętej
  próbce jego DOM na ciemnozielonym tle. Zielony outline2 px i papierowa
  otoczka3 px zapewniają rozpoznawalność na obu tłach. Próbka nie jest stroną
  produkcyjną ani zatwierdzonym układem V3.
- Enter/Tab/Escape w menu działają; przełączenie Kontakt zachowuje podstronę
  `/en/kontakt` → `/uk/kontakt`. Znany brak przywracania fokusu po Escape
  pozostaje do naprawy w V3.
- Home nadal pokazuje dwa rzeczywiste archiwalne wpisy po zakończeniu loading.
- Konsola końcowych kontroli: brak błędów/ostrzeżeń.

Dowody w ignorowanym `.playwright-mcp/v2/`:
`home-{pl,en,uk}-{390,1440}.png`,
`{kontakt,prywatnosc,zacznij,admin}-pl-{390,1440}.png`,
`focus-home-light-390.png`, `focus-probe-dark-390.png`.
Zrzuty Home PL/EN/UK odświeżono po załadowaniu wpisów i końcowej korekcie.
Końcową macierz potwierdzono również pomiarem DOM.
Obejrzano obrazy Home PL mobile/desktop, EN mobile, UK mobile/desktop,
focus jasny/ciemny i Admin mobile. Pozostałe screenshoty zebrano jako dowody
pomocnicze; nie deklarujemy osobnego audytu każdego obrazu.

## Pozostałe ograniczenia

- V3 naprawi kotwicę spotkań zasłanianą przez sticky header i przywracanie
  fokusu menu; oba problemy zapisano przed V2. Docelowy layout i hero nie są
  jeszcze wdrożone.
- Zalogowanego panelu, formularzy/uploadu i mutacji nie sprawdzano live.
  Istniejące testy admina przeszły; wygląd całego panelu należy odebrać w V4.
- Nie wykonano pełnego zoom 200%, pomiarów LCP/CLS ani kompletnego audytu WCAG.
  Weryfikacja viewportów nie oznacza emulacji urządzenia dotykowego.
- Pozostają znane ostrzeżenia jsdom o scrollTo i buildu o chunku JS >500 kB.
- Odbiór źródeł treści, harmonogramu, tłumaczeń i grafiki przez właściciela
  przed publikacją pozostaje zgodny z planem; niczego nie opublikowano.

V2 zakończone w opisanym zakresie. Następny etap: V3 — Home i wspólna otoczka,
następnie oddzielne, sekwencyjne recenzje visual/regression.
