# V0 — punkt odniesienia

Data: 30.09.2026. Kierunek: zatwierdzony **Papier i goban**.
Flagi pozostają obok widocznych etykiet PL/EN/UKR na desktopie i telefonie;
mobilny przełącznik pozostaje poza hamburgerem. Makieta nie zastępuje danych,
tłumaczeń, nawigacji ani stanów aplikacji.

## Repozytorium i środowisko

- SHA przed kontrolą: `977d68a18f292e5409fad367ca5b8575983349f1`.
- Stan roboczy przed kontrolą: czysty.
- Git odczytany z jednorazowym `-c safe.directory=C:/1/Repos/LublinGoClubWebPage`;
  bez zmiany globalnej konfiguracji (różni właściciele repozytorium i procesu).
- Serwer: `npm run dev -- --host 127.0.0.1`, adres z terminala
  `http://127.0.0.1:5173/`.
- Istniejący Playwright MCP działa. Kontrole wykonywał główny agent kolejno,
  bez osobnych recenzentów i bez zmian kodu aplikacji.
- Publiczny feed zwrócił dwa archiwalne wpisy z 2023 roku. Nie zmieniano danych,
  nie logowano administratora i nie publikowano wpisów.

## Walidacja

| Kontrola                   | Wynik                                 |
| -------------------------- | ------------------------------------- |
| `npm run check`            | FAIL: zatrzymanie na `format:check`   |
| lint w ramach gate         | PASS                                  |
| `npm run typecheck` osobno | PASS                                  |
| `npm run test` osobno      | PASS: 19 plików, 101 testów           |
| `npm run build` osobno     | PASS, ostrzeżenie o chunku JS >500 kB |

Prettier zgłosił 12 istniejących plików: osiem `.agents/skills/*/SKILL.md`,
`.codex/README.md`, `AGENTS.md`, `docs/design/LKG-plan-wizualny-v1.md` oraz
`docs/ULTIMATE_IMPLEMENTATION_PLAN.md`. Nie wykonano szerokiego formatowania.
Testy wypisują ostrzeżenia jsdom o niezaimplementowanym `scrollTo`.
Pełny gate pozostaje czerwony; wcześniejszy zapis „green” w statusie wdrożenia
nie opisuje tego SHA.

## Ekrany i dowody

Screenshoty zapisano w ignorowanym `.playwright-mcp/v0/`:

- `before-home-pl-390.png` (390×844), `before-home-pl-1440.png` (1440×900).
- `before-{about,start,news,contact,privacy,404,admin}-pl-{390,1440}.png`
  (wysokość viewportu 900 px; pełne strony).
- `before-header-pl-768.png` (768×900, viewport).
- `before-news-{empty,error}-pl-390.png` (390×844; symulowane odpowiedzi).

Zrzuty są rzeczywistymi kontrolami przeglądarki, przy domyślnym zoomie;
zmiana viewportu nie jest emulacją urządzenia dotykowego. Zrzuty zasad odświeżono
po przewinięciu i załadowaniu obrazów lazy. Obejrzano obrazy Home na obu
szerokościach, Start mobile, Admin mobile, Contact desktop, nagłówka 768 px
oraz pustego i błędnego feedu. Pozostałe zrzuty zebrano jako bazę porównania;
nie stanowią pełnego audytu wizualnego.

## Sprawdzone zachowanie

- Home PL/EN/UK: 320, 390, 768, 1024, 1440 px; trzy widoczne, załadowane flagi
  w nagłówku; poprawne `html lang`.
- Brak przepełnienia Home przy 320, 390, 1024 i 1440 px.
- Publiczne polskie podstrony i 404 renderują się przy 390 i 1440 px;
  w tych kontrolach brak poziomego przepełnienia.
- Menu: Enter otwiera, Tab przechodzi do pierwszego linku, Escape zamyka;
  wybór Kontakt zamyka menu i prowadzi do `/kontakt`.
- Przełączenie na Kontakt prowadzi do `/en/kontakt`, następnie `/uk/kontakt`;
  język dokumentu zmienia się odpowiednio.
- Pierwszy element FAQ otwiera się i zamyka klawiszem Enter.
- CTA hero i dolny CTA przewijają do istniejącej sekcji spotkań, lecz występuje
  opisane niżej zasłanianie nagłówka.
- Linki map mają parametry lokalizacji; nie sprawdzano działania zewnętrznych
  serwisów ani aktualności faktów klubowych.
- Przy końcu strony link prywatności znajduje się nad dolnym CTA
  (390×844: dolna krawędź linku ok. 732 px, początek paska 768 px).
- `/admin` pokazuje ekran logowania; brak przełącznika języka i dolnego CTA.
- Feed: obserwowano loading i dwa rzeczywiste wpisy. Pustą odpowiedź oraz błąd
  odczytu zasymulowano przez przechwycenie GET w Playwright, bez mutacji bazy.
  Są odrębnymi stanami, błąd ma `role=alert`.
- Konsola zwykłych przeglądów: brak błędów i ostrzeżeń. Symulowany błąd GET
  powoduje oczekiwany błąd zasobu; nie jest awarią rzeczywistego feedu.

## Problemy istniejące przed redesignem

| Priorytet | Problem i reprodukcja                                                                                                                                 | Obszar                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Wysoki    | Home PL i UK przy 768 px: nagłówek wychodzi poza viewport (ok. 39/29 px); CTA jest obcięte.                                                           | Header, próg desktopowej nawigacji |
| Średni    | Home PL 390 px: CTA przewija sekcję do ok. 0 px, nagłówek sekcji zaczyna się ok. 64 px, sticky header kończy się ok. 97 px. Brak `scroll-margin-top`. | MeetingSection, oba CTA            |
| Średni    | Menu PL 390 px: otworzyć Enter, Tab do linku, Escape. Fokus trafia do body zamiast przycisku Menu.                                                    | MobileMenu                         |
| Średni    | Wymuszony błąd feedu PL ujawnia tekst `Failed to load news posts` i szczegół techniczny zamiast w pełni lokalizowanego komunikatu.                    | NewsFeed, repository               |
| Gate      | Formatowanie 12 plików blokuje `npm run check`.                                                                                                       | Dokumentacja i instrukcje          |

Wizualna baza odpowiada dostarczonym zrzutom: ciężkie nagłówki sans,
wyśrodkowany hero z obrazem poniżej tekstu, brązowy baner, obszerne odstępy,
czerwone CTA i jasna stopka. Konflikt `Section py-16` / `Home py-0` pozostaje
do uporządkowania w fundamencie. W konfiguracji Tailwind pozostał stary komentarz
„Locked tokens”; nadrzędny AGENTS i plan jednoznacznie dopuszczają nową paletę.

## Granice kontroli i następny etap

Nie sprawdzono w przeglądarce: braku konfiguracji Supabase, 1/3 wpisów, wpisów
z obrazami i długimi tytułami, zalogowanego panelu/formularzy, pełnej macierzy
języków podstron, zoomu 200%, pomiarów LCP/CLS i kontrastu. To kontrole do
wykonania w odpowiednich etapach; brak dostępu do zalogowanego panelu nie jest
dowodem jego poprawności. Fakty, tłumaczenia i prawa do materiałów wymagają
odrębnej akceptacji właściciela zgodnie z planem.

V0 zakończone jako zapis punktu odniesienia i jawnych problemów. Kolejny etap:
V2 w małych zadaniach — zasoby/fonty, tokeny i primitives; dopracowanie decyzji
V1 w rzeczywistym prototypie. Przy implementacji naprawić wskazane problemy
otoczki, zachować flagi i wykonać pełny gate przed odbiorem zmienianego etapu.
