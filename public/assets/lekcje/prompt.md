# Nowa podstrona - Lekcje

## Stan obecny

Chciałbym usunąć podstronę "Kontakt". Uważam, że nie wiele ona wsnosi. Dane kontaktowe dostępne są w stopce, a sama strona jest pusta i powiela jedynie dane ze stopki.

## Prace związane z nową podstroną

Po usunięciu kontaktów w ich miejsce chciałbym dodać podstronę "Lekcje". Będzie ona zawierać linki do plików PDF z materiałami do nauki na określone tematy. Pliki z prezetacjami w formaci pptx umieściłem już w folderze public\assets\lekcje. Zamień je na pliki PDF. Utwórz też thumbnaily ze strony tytułowej każdego PDFa tak, by można go było wyświetlić na stronie. Oprócz thumbnaila chciałbym, żebyś do każdej lekcji wygenerował 2-3 zdania podsumowania na temat zawartości lekcji.
Przykładowy thumbnal wykonany przeze mnie znajduje się w folderze public\assets\lekcje\thumbnails.
Rozmiar thumbnaili pozostawiam Tobie do oceny. Zaproponuj układ listy lekcji, który uważasz za sensowny (rozważ listę jednokolumnową odraz dwukolumnową). Zastanówi się jak anjelepiej połącyć thumbnaile z opisami lekcji w jeden kafelek.

## Zmiany w podstronie admin

Chciałbym dodać nową funkcjonalność do podstrony admin, która pozwoli na dodawanie nowych lekcji.
Formularz dodawania lekcji powinien zawierać:

- tytuł lekcji
- opis lekcji
- plik PDF z lekcją
- thumbnail lekcji

Formularz powinien zapisywać dane do bazy supabase. Prawdopodobnie będzie potrzebna dodatkowa migracja. Wygeneruj dla mnie plik migracji, abym mógł go uruchomić na stronie subapase.

Po dodaniu lekcji powinna ona pojawić się na podstronie "Lekcje".
