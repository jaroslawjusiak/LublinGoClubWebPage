---
name: lkg-proofreading
description: 'Precyzyjna korekta tekstów strony Lubelskiego Klubu Go w PL/EN/UK. Używaj do sprawdzania literówek, ortografii, gramatyki, interpunkcji i spójności językowej treści, tłumaczeń, komunikatów formularzy oraz metadanych. Zachowuj znaczenie, fakty, terminologię Go i strukturę i18next.'
---

# Korekta tekstów LKG

## Ustal zakres i źródła

1. Przeczytaj `AGENTS.md` oraz wskazane pliki. Rozróżnij przegląd z propozycjami
   od polecenia wprowadzenia poprawek; przy samym przeglądzie nie edytuj plików.
2. Przy korekcie całej strony zinwentaryzuj teksty przez `rg` i `rg --files`:
   - `src/i18n/locales/{pl,en,uk}/translation.json` i rzeczywiste namespace'y
     z `src/i18n/config.ts`;
   - teksty wyświetlane z `src/data/`, w tym opisy lekcji;
   - `src/pages/` i `src/components/`: nagłówki, przyciski, formularze,
     komunikaty błędów/sukcesu, puste stany, etykiety dostępności i teksty alternatywne;
   - tytuły stron, opisy SEO i teksty prawne, jeśli mieszczą się w zleconym zakresie.
3. Ustal kontekst każdego tekstu: język, ekran, odbiorca, interpolowane dane
   i sposób wyświetlania. Nie oceniaj pojedynczego klucza bez sąsiednich tekstów.
4. Korzystaj z `../i18n-i18next/SKILL.md` dla tłumaczeń i z
   `../club-data-source-of-truth/SKILL.md` dla faktów klubu.
5. Traktuj treści z Supabase i plików PDF jako oddzielne źródła. Nie uznawaj korekty
   repozytorium za korektę wszystkich opublikowanych wpisów lub materiałów.
   Przeglądaj je tylko w dostępnym, zleconym zakresie; zapis do produkcyjnej bazy,
   zmiana materiałów i publikacja wymagają odrębnego polecenia.

## Poprawiaj oszczędnie

- Poprawiaj jednoznaczne literówki, ortografię, fleksję, gramatykę, interpunkcję,
  przypadkowe powtórzenia słów i błędne odstępy. Zachowuj ton oryginału.
- Oddzielaj konieczne poprawki od opcjonalnych sugestii stylistycznych.
  Nie przepisuj poprawnych zdań tylko dlatego, że można je sformułować inaczej.
- Zachowuj sens zdań: przeczenia, warunki, stopień pewności, adresata i kolejność
  instrukcji. Nie upraszczaj zasad Go kosztem poprawności merytorycznej.
- Zachowuj nazwy własne, dane kontaktowe, adresy, terminy spotkań, liczby,
  stopnie kyu/dan i wyniki. Niespójność faktów zgłaszaj ze źródłami;
  nie rozstrzygaj jej jako literówki.
- Rozpoznawaj terminy Go, np. goban, atari, ko, komi, fuseki, joseki, tesuji,
  sente, gote i yose. Nie zastępuj ich podobnymi słowami słownikowymi.
  Ustal pisownię, odmianę i transliterację z kontekstu i istniejących tekstów;
  nie wymyślaj nowego standardu terminologicznego podczas korekty.
- Sprawdzaj PL, EN i UK osobno według zasad danego języka. Nie kopiuj polskiej
  interpunkcji do tłumaczeń ani nie zmieniaj ukraińskich form na rosyjskie.
  Zachowuj poprawne znaki diakrytyczne i ukraińskie litery.
- Porównuj tłumaczenia pod względem znaczenia, zachowując naturalne różnice
  składniowe. Polski fallback nie oznacza, że polski tekst jest zawsze poprawny.
  Zgłaszaj brak tłumaczenia lub rozbieżność sensu; nie tłumacz całych fragmentów
  od nowa bez polecenia.
- Jeśli poprawka jest niepewna lub zmienia interpretację, pozostaw oryginał
  i przedstaw fragment, proponowaną wersję oraz powód wątpliwości.
  W razie potrzeby sprawdź wiarygodne źródło językowe/terminologiczne;
  nie deklaruj pewności na podstawie samej sugestii słownika.

## Chroń strukturę aplikacji

- Zmieniaj tylko wartości tekstowe objęte zleceniem. Zachowuj nazwy kluczy,
  namespace'y, identyfikatory, trasy, URL-e, nazwy plików i logikę aplikacji.
- Zachowuj dokładnie interpolacje, np. `{{count}}`, `{{title}}`, ich nazwy
  i liczbę wystąpień oraz znaczniki używane przez komponenty tłumaczeń.
- Sprawdzaj wszystkie istniejące warianty liczby mnogiej w kontekście liczby;
  zachowuj sufiksy i komplet kluczy dla PL/EN/UK.
- Nie zmieniaj tekstów prawnych w sposób rozszerzający lub ograniczający
  zobowiązania. Zgłaszaj problemy merytoryczne poza zakresem korekty.
- Nie wykonuj masowych zamian bez sprawdzenia każdego kontekstu.
  Zachowuj istniejące formatowanie; nie dodawaj zależności do korekty tekstu.

## Zweryfikuj i zdaj raport

1. Przeczytaj cały poprawiony fragment, a następnie wykonaj drugi przegląd diffu:
   sprawdź sens, fakty, terminologię, interpolacje oraz komplet wariantów i języków.
2. Po zmianie tekstów aplikacji uruchom `npm run check` zgodnie z `AGENTS.md`.
   Nie aktualizuj testów mechanicznie, żeby ukryć zmianę znaczenia;
   nie dodawaj testów, które tylko powielają poprawioną treść.
3. Przy zmienionych etykietach i dłuższych tłumaczeniach sprawdź w dostępnej
   przeglądarce zawijanie, czytelność i powiązania etykiet przy szerokości mobilnej
   i desktopowej. Wyraźnie oznacz kontrolę zablokowaną lub pominiętą.
4. Podaj zakres przejrzanych języków i źródeł, zwięzłe zestawienie istotnych
   poprawek oraz osobno wątpliwości i nieprzejrzane treści. Przy przeglądzie
   przedstaw tabelę: plik/klucz, oryginał, propozycja, powód.
5. Nie deklaruj bezbłędności całej strony ani weryfikacji przez native speakera,
   jeśli wykonano wyłącznie korektę agentową części źródeł.
