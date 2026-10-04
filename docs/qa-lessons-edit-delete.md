# QA — edycja i usuwanie lekcji

Zakres: panel administratora, repozytorium metadanych, opcjonalne zastępowanie
plików i bezpieczne sprzątanie Storage. Bez nowej migracji i zmian produkcyjnych.

## Automatyczne kontrole

`npm run check` zakończył się powodzeniem: ESLint, Prettier, TypeScript,
178 testów w 26 plikach i produkcyjny build Vite.

Nowe testy obejmują zachowanie istniejących adresów, języka i liczby stron;
niezależne zastępowanie PDF lub miniatury; ograniczenia plików; anulowanie bez
zapisu/uploadu; potwierdzenie i anulowanie usunięcia; blokadę podwójnego kliknięcia;
komunikat i aktualizację listy po usunięciu; błędy zapisu i utratę odpowiedzi;
sprawdzenie wyniku bez ponownej mutacji; ponawianie sprzątania; ochronę plików
statycznych/zewnętrznych oraz współdzielonych (także z parametrem w adresie);
zachowanie aktywnych plików, gdy odczyt referencji nie powiedzie się;
blokadę innych operacji podczas nierozstrzygniętej próby.

Sekcja lekcji pozostaje zamontowana podczas edycji aktualności. Stan oczekującej
weryfikacji/sprzątania nie jest tracony wskutek zmiany widoku edytora wpisów.

## Ręczna kontrola

Kontrola w prawdziwej przeglądarce w tym środowisku jest zablokowana: brak
udostępnionego Playwright MCP oraz lokalnego pliku wykonywalnego przeglądarki.
Testy DOM nie potwierdzają responsywnego wyglądu.

Po wdrożeniu testowym sprawdź formularz na 390 i 1440 px, przepełnienia przy
320 px i PL/EN/UK; fokus po otwarciu/anulowaniu; czytelność komunikatów i
blokowanych przycisków; pozostawienie pustych pól plików; każdą wymianę oddzielnie;
potwierdzenie usunięcia; przerwę sieciową oraz ponowienie weryfikacji i sprzątania.
Skontroluj RLS przez konto administratora i konto spoza allowlisty. Nie testuj
usuwania na materiałach produkcyjnych.

Zamknięcie karty traci stan niepotwierdzonej operacji. W takim przypadku przed
powtórzeniem operacji sprawdź rekord oraz Storage według instrukcji w
[LESSONS_SETUP.md](LESSONS_SETUP.md).
