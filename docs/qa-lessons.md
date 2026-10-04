# Odbiór funkcji Lekcje

Zakres: `public/assets/lekcje/prompt.md`, na podstawie gałęzi `design/paper-goban`
z commita `6c6d0744a7e9c5c3c1edc4b0afc52dd62817fce2`.

## Materiały

- Dziewięć plików PPTX przekonwertowano w LibreOffice Impress do PDF. Źródła zachowano.
- Liczba stron każdego PDF-a zgadza się z liczbą slajdów źródła: łącznie 122 strony.
- Obejrzano rasteryzację wszystkich stron oraz wszystkie miniatury tytułowe WebP.
- Miniatury mają 800 × 451 px; pełna strona tytułowa jest zachowana bez kadrowania.
- Opisy są oparte na rzeczywistej treści slajdów. Krótki materiał Fuseki 2025
  opisano zgodnie z dwustronicowym źródłem.

## Baza i uprawnienia

Migrację `0005_lessons.sql` wykonano w jednorazowej lokalnej bazie PostgreSQL
(PGlite), z rzeczywistymi migracjami `0001` i `0002` oraz symulowanymi schematami
Supabase Auth i Storage. Nie wykonano zapisów ani migracji na produkcji.

Potwierdzono:

- Poprawną składnię i dodanie dziewięciu początkowych rekordów; wszystkie ich lokalne
  PDF-y i miniatury istnieją.
- Publiczny odczyt lekcji.
- Odrzucenie zapisu lekcji dla anonimowych użytkowników i zalogowanych osób bez
  wpisu na liście administratorów.
- Brak modyfikacji/usuwania lekcji przez osoby bez uprawnień administratora.
- Odrzucenie dodawania obiektów Storage przez osoby bez uprawnień administratora.
- Dodawanie, aktualizację i usuwanie metadanych przez administratora oraz dodawanie
  i usuwanie obiektów plikowych przez administratora.
- Odrzucenie niepoprawnych metadanych przez ograniczenia tabeli.

Limity MIME i rozmiaru są zapisane w konfiguracji bucketów. Test lokalny sprawdza SQL
oraz RLS, nie emuluje całej usługi Supabase Storage. Integrację z rzeczywistą usługą
należy sprawdzić po uruchomieniu migracji w środowisku testowym.

## Kontrola wizualna

Przegląd statyczny komponentów i zasobów potwierdził zgodność z istniejącymi
kolorami, typografią i wspólnymi komponentami kierunku „Papier i goban”. Układ
katalogu ma dwie kolumny od 960 px i jedną poniżej; miniatura znajduje się nad
rzeczywistym tekstem HTML. Kontakt i osoby z konfiguracji pozostają w stopce.

**Kontrola w przeglądarce jest zablokowana w tym środowisku.** Nie ma dostępnego
Playwright MCP ani CLI agent-browser. Zainstalowana biblioteka Playwright nie ma
binarnego Chromium, a próba pobrania oficjalnej przeglądarki zwróciła pusty,
niepoprawny plik ZIP. Dostępna przeglądarka chmurowa odrzuciła lokalny podgląd
`http://127.0.0.1:5173/` błędem `ERR_BLOCKED_BY_CLIENT`.

Nie potwierdzono zatem renderowania strony przy 320/390/768/1024/1440 px,
focusu, powiększenia 200%, mobilnego menu ani nakładania paska CTA. Sprawdzić te
widoki po uruchomieniu gałęzi w zwykłej przeglądarce. Przegląd plików źródłowych i
obrazów nie zastępuje takiego odbioru.

## Kontrole aplikacji

`npm run check` zakończył się powodzeniem: ESLint, Prettier, TypeScript, 148
testów w 24 plikach oraz produkcyjny build Vite. Testy obejmują przekierowania
i lokalizację, stany listy, uprawnienia formularza, walidację plików, sprzątanie
przerwanych uploadów, blokadę wielokrotnego wysłania oraz odzyskanie niepotwierdzonego
zapisu bez ponownego tworzenia rekordu. Przegląd regresji nie wykazał pozostających
błędów krytycznych ani wysokiego priorytetu.
