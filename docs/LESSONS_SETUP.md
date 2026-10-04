# Lekcje — konfiguracja i publikacja

Nowa strona `/lekcje` zastępuje Kontakt. Stare adresy `/kontakt`, `/en/kontakt`,
`/uk/kontakt` i `/kontakt.html` przekierowują do Lekcji. Dane kontaktowe i osoby
kontaktowe pozostają w stopce.

## Jedna nowa migracja

1. W projekcie Supabase, w którym wykonano już migracje 0001–0004, uruchom cały
   plik `supabase/migrations/0005_lessons.sql` w SQL Editor. Migracja tworzy tabelę
   `lessons`, zasady RLS, dwa publiczne buckety i wpisy dziewięciu lekcji. Jest
   wykonywana w transakcji; nie uruchamiaj jej ponownie po udanym wykonaniu.
2. Wdróż tę wersję strony wraz z plikami PDF i WebP z `public/assets/lekcje/`.
   Początkowe rekordy odwołują się do tych plików przez adresy względne.
   Migracja nie przesyła plików do Storage, a wcześniejsze wdrożenie ich nie zawiera.
3. Zachowaj dotychczasowe zmienne `VITE_SUPABASE_URL` i
   `VITE_SUPABASE_ANON_KEY` oraz allowlistę `public.admins`. Nie dodawaj klucza
   service role do aplikacji.
4. Po zalogowaniu uprawnionego administratora na `/admin` dostępna jest sekcja
   „Zarządzanie lekcjami”, niezależna od listy aktualności.

## Dodawanie materiałów

Wprowadź tytuł i opis po polsku oraz wybierz PDF (do 20 MB) i miniaturę JPG,
PNG lub WebP (do 5 MB). Polecana miniatura to pełny slajd tytułowy 800 × 451 px;
strona zachowuje cały obraz i nie przycina tytułu. Formularz sprawdza typy MIME,
rozmiary i nagłówek `%PDF-`. Buckety ograniczają również typy MIME i rozmiary.
Nowe lekcje są od razu publiczne; pliki otrzymują unikalne nazwy w Storage,
a tabela przechowuje ich adresy, opis i język. Nie potrzeba kolejnego wdrożenia.

Po nieudanym przesłaniu lub potwierdzonym nieudanym zapisie aplikacja usuwa
przesłane pliki. Nieudane usunięcie jest zgłaszane z ich ścieżkami; kolejna próba
najpierw ponawia sprzątanie. W razie przerwanego połączenia przy zapisie aplikacja
sprawdza rekord po wygenerowanym identyfikatorze. Jeśli wyniku nie można ustalić,
zachowuje pliki i ponawia weryfikację przyciskiem „Sprawdź zapis”, aby nie usunąć
plików już opublikowanej lekcji ani nie utworzyć duplikatu. Zachowaj otwarty
formularz do wyjaśnienia wyniku; po zamknięciu karty niepotwierdzoną próbę należy
sprawdzić w tabeli `lessons` i Storage przed ponownym dodaniem tych samych materiałów.

## Dane i stany strony

Przy skonfigurowanym Supabase tabela jest źródłem danych. Brak migracji lub błąd
połączenia pokazuje komunikat błędu z ponowieniem, a pusta tabela pokazuje brak
lekcji. Początkowy katalog z `src/data/lessons.ts` służy wyłącznie podglądowi bez
konfiguracji Supabase. Nie maskuje błędów działającej konfiguracji.

Interfejs ma wersje PL/EN/UK. Opisy początkowych lekcji i pliki pozostają polskie,
z oznaczeniem języka treści i widoczną informacją o języku materiałów.

Źródłowe PPTX pozostają w repozytorium. Mapa konwersji i numery stron są w
`public/assets/lekcje/README.md`.

## Odbiór po wdrożeniu

Sprawdź dziewięć lekcji i ich PDF-y, lokalizowane przekierowania oraz dodanie
jednej próbnej lekcji przez uprawnionego administratora w środowisku testowym.
Zweryfikuj odrzucenie zapisu i uploadu przez anonimowego użytkownika i użytkownika
spoza allowlisty. Nie wykonano migracji ani żadnych zmian produkcyjnych w ramach
przygotowania tych plików.
