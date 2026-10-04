# Korekta tekstów — 4 października 2026

Zakres: wszystkie wartości tekstowe zasobów PL/EN/UK, metadane SEO, komunikaty panelu administratora, etykiety dostępności, teksty w danych klubu, dziewięć opisów lekcji i siedem wpisów widocznych na stronie Aktualności. Przeczytano również dwa archiwalne wpisy w `src/lib/news/seed.ts`. Materiały PDF nie są objęte tym przeglądem tekstów interfejsu. Przegląd agentowy, bez weryfikacji native speakera.

## Wprowadzone poprawki: 7 wystąpień

| Język / klucz               | Oryginał                                          | Poprawka                                          | Powód                                                |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| PL `rules.step_5_body`      | zbił kamień grając w A                            | zbił kamień, grając w A                           | Oddzielenie imiesłowowego równoważnika zdania.       |
| EN `start.faq_a_5`          | find a partner to play                            | find a partner to play with                       | Brak przyimka wskazującego partnera do wspólnej gry. |
| UK `start.faq_a_5`          | Більшість людей приходить самі й одразу знаходять | Більшість людей приходять самі й одразу знаходять | Uzgodnienie liczby z dalszą częścią zdania.          |
| UK `privacy.intro`          | Любельському                                      | Люблінському                                      | Spójna ukraińska nazwa klubu w Lublinie.             |
| UK `meta.about_description` | Любельському                                      | Люблінському                                      | Jak wyżej.                                           |
| UK `meta.news_description`  | Любельського                                      | Люблінського                                      | Jak wyżej.                                           |
| UK `meta.admin_description` | Любельського                                      | Люблінського                                      | Jak wyżej.                                           |

Pisownię przymiotnika Люблінський potwierdza ukraińska strona miasta: https://lublin.eu/ua/science-and-education/higher-education-institutions-in-lublin/-ii%2C8288%2Cw.html.

## Aktualności z Supabase: 10 dodatkowych poprawek przygotowanych do zapisu

Nie zmieniono wpisów w bazie: dostępna przeglądarka nie ma sesji administratora, a panel `/admin` wyświetla przycisk logowania przez Google. Poprawki odnoszą się do treści odczytanej przez działającą stronę; przed zapisem trzeba ponownie odczytać rekordy i zachować wszystkie inne pola.

| Wpis                                        | Oryginał                                                   | Poprawka                                                  | Powód                                                           |
| ------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| Nowy rok, nowi gracze                       | now koncepcje                                              | nowe koncepcje                                            | Brak litery.                                                    |
| Nowy rok, nowi gracze                       | na OGSie                                                   | na OGS-ie                                                 | Końcówka fleksyjna skrótowca wymaga łącznika.                   |
| Nowy rok, nowi gracze                       | https://online-go.com/) na końcu tekstu                    | https://online-go.com/).                                  | Brak kropki kończącej zdanie.                                   |
| Nasi klubowicze na Europejskim Kongresie Go | koczulkach                                                 | koszulkach                                                | Literówka.                                                      |
| Nasi klubowicze na Europejskim Kongresie Go | Konkresie                                                  | Kongresie                                                 | Literówka.                                                      |
| Penerowe spotkanie na Placu Litewskim       | Penerowe                                                   | Plenerowe                                                 | Brak litery.                                                    |
| Penerowe spotkanie na Placu Litewskim       | naszym mieszańcom                                          | naszym mieszkańcom                                        | Brak litery zmieniający sens słowa.                             |
| Penerowe spotkanie na Placu Litewskim       | na codzień                                                 | na co dzień                                               | Błędna pisownia wyrażenia.                                      |
| Klubowy turniej                             | 4 rundowy                                                  | 4-rundowy                                                 | Brak łącznika w przymiotniku z cyfrą.                           |
| Klubowy turniej                             | (słabsi gracze dostają dodatkowe kamienie na starcie), gry | (słabsi gracze dostają dodatkowe kamienie na starcie) gry | Przecinek niepotrzebnie oddziela okolicznik od zdania głównego. |

Łącznie: 17 wystąpień błędów językowych, w tym 7 poprawionych w repozytorium i 10 przygotowanych poprawek wpisów z bazy. Powtórzoną błędną nazwę liczymy osobno w każdym z czterech kluczy. Sugestie stylistyczne i uwagi o lokalizacji nie wchodzą do tej liczby.

## Sugestie stylistyczne — zatwierdzone i wprowadzone

Właściciel zatwierdził wszystkie trzy propozycje 4 października 2026. Wprowadzono je w zasobach PL i EN.

| Miejsce                 | Oryginał                      | Propozycja                              | Powód                                                                                                               |
| ----------------------- | ----------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| PL `start.story_step_1` | Przyjdź pod adres {{address}} | Przyjdź pod wskazany adres: {{address}} | Naturalniejsze sformułowanie instrukcji. Pozostała część tekstu bez zmian.                                          |
| EN `start.faq_q_4`      | What age can I start?         | At what age can I start?                | Pełniejsza, mniej potoczna forma pytania.                                                                           |
| PL `rules.step_3_body`  | Można ją uratować             | Można uratować kamień lub grupę         | Zaimek żeński jest niejasny po wzmiance o kamieniu lub grupie. Wymaga zatwierdzenia, ponieważ doprecyzowuje zdanie. |

## Spójność tłumaczeń

- Sprawdzono znaczenie zasobów PL/EN/UK, warianty liczby mnogiej i interpolacje. Pozostawiono naturalne różnice językowe i poprawne wyrazy.
- W EN i UK dane interpolowane z `club.ts` zawierają polskie `sala 14` i `Galeria na górze`. To brak lokalizacji wspólnych danych, a nie literówka. Ich przetłumaczenie wymaga zmiany sposobu przechowywania lub prezentowania danych; nie wykonano tego podczas korekty wartości tekstowych.
- Polskie opisy lekcji na EN/UK są zapowiedziane komunikatem o języku materiałów; nie potraktowano ich jako błędu tłumaczenia.
- Wpisy aktualności pozostają po polsku w wersjach EN/UK; nie przygotowano nowych tłumaczeń wpisów bez osobnego zlecenia.

## Kontrole

`npm run check`: lint, formatowanie, TypeScript, 178 testów oraz build zakończone pomyślnie. Treści wpisów i opisów lekcji odczytano z działającej strony. Korekta nie jest publikacją zmian aplikacji ani zapisaniem poprawek aktualności do Supabase.
