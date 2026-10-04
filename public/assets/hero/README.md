# Hero — goban i goke

## Aktualny obraz — retusz zaakceptowany 01.10.2026

Strona główna korzysta z `board-retouched-{640,960,1440}.{avif,webp,jpg}`.
Źródło: dostarczony przez właściciela `docs/design/reference/board.jpg`,
1536×1024 px (RGB). Według właściciela retusz kamieni wykonał Opus 5.5;
właściciel zaakceptował ten obraz do użycia na stronie głównej 01.10.2026.
To ilustracja sprzętu, nie dokumentacja spotkania klubu. Pochodzenie retuszu
jest zapisane na podstawie deklaracji właściciela; nie przypisano licencji stockowej.

Zachowano pełny kadr **3:2 na desktopie i mobile** oraz
`object-position: 50% 50%`. Rozdzielczość źródła wystarcza dla największego
wariantu 1440 px; obrazu nie powiększano. Wykonano wyłącznie resampling Lanczos
i kodowanie Pillow 12.3.0, bez generacji ani kolejnego retuszu.
Quality: AVIF 65, WebP 85, JPEG 88 (optimized, progressive).
Wariant 640 px ma wysokość 427 px po zaokrągleniu do pełnego piksela.

| Szerokość | Wysokość | AVIF     | WebP      | JPEG fallback |
| --------- | -------- | -------- | --------- | ------------- |
| 640       | 427      | 34 346 B | 52 888 B  | 75 798 B      |
| 960       | 640      | 53 403 B | 82 802 B  | 133 194 B     |
| 1440      | 960      | 84 935 B | 127 666 B | 230 627 B     |

`picture` używa AVIF → WebP → JPEG, istniejącego responsywnego `sizes`
oraz eager loading. Nowe nazwy rozróżniają zasób od poprzedniej wersji w cache.
Starsze warianty pozostają poniżej opisane i zachowane w repozytorium.

## Poprzedni obraz V2 — archiwum

Osobny zasób przygotowany dla V2 kierunku Papier i goban, 30.09.2026.
Wygenerowany przez wbudowane narzędzie OpenAI `image_gen`; nie jest zdjęciem
spotkania ani dowodem posiadania tego sprzętu przez klub. Bez osób, napisów,
znaków marek i fragmentów wyciętych z makiety. Nie jest zasobem stockowym
objętym licencją fotografa; pochodzenie: generacja OpenAI w tej sesji.

Źródło: `exec-dd4221bc-702e-4d05-bc65-b35c26c4648f.png`, 1448×1086 px.
Identyfikator generacji: `01a0f383-5504-7941-9765-7141e844aaa6`.
Oryginał pozostaje w lokalnym katalogu wygenerowanych obrazów Codex;
aplikacja będzie korzystać wyłącznie z plików w tym folderze.

## Warianty

| Szerokość | Wysokość | AVIF     | WebP      | JPEG fallback |
| --------- | -------- | -------- | --------- | ------------- |
| 640       | 480      | 31 354 B | 48 284 B  | 75 863 B      |
| 960       | 720      | 52 849 B | 83 324 B  | 142 436 B     |
| 1440      | 1080     | 89 842 B | 139 482 B | 260 500 B     |

Nazwy: `goban-goke-{640,960,1440}.{avif,webp,jpg}`. Warianty wykonano Pillow
12.3.0 (Lanczos; quality AVIF 65, WebP 85, JPEG 88), bez zależności aplikacji.
AVIF/WebP są poniżej orientacyjnego budżetu 150–300 KB dzięki prostemu kadrowi.

Docelowo `picture`: AVIF → WebP → JPEG, `srcset` z rzeczywistymi szerokościami
i `sizes` dopasowane do kolumny hero; jawne `width`/`height` lub `aspect-ratio`.
Zalecany pełny kadr **4:3 na desktopie i mobile**, `object-position: 50% 50%`.
Nie wymuszać 3:2: górny crop ogranicza przestrzeń przy miskach. Hero eager;
fetch priority dopiero gdy pomiar potwierdzi, że obraz jest LCP.

W V2 pliki są przygotowane do podłączenia w V3. Starego
`public/assets/go-board.png` nie usunięto.

## Kontrola obrazu

Obejrzano pełny obraz i wariant 960 WebP: dwie rodziny regularnych linii,
jedna perspektywa, pięć kamieni na siatce, dwie miski, brak osób/tekstu.
To kontrola agenta, nie osobny przegląd człowieka znającego Go.
Przy odbiorze kadru w V3 właściciel powinien potwierdzić geometrię i wygląd
sprzętu zgodnie z pisemnym planem. Zachować pełny kadr misek.

## Prompt generacji

> Use case: photorealistic-natural. Asset type: standalone production website hero photo for Lubelski Klub Go, approved Paper and Goban design. Generate ONLY the photograph, no website/UI/mockup. Landscape 4:3 composition. Close photographic view of a real Go goban made of light honey wood, two natural wooden goke bowls near the back containing black and white Go stones, with only a few (3 to 5) round black/white lens-shaped stones on the visible board. Critical geometry: board has two straight regularly spaced families of perpendicular grid lines, consistent single perspective; each played stone center is exactly at a grid intersection, no stone in the middle of cells, no wonky/nonparallel lines. Board extends beyond the frame so full 19x19 grid need not be visible. Bowls fully visible with breathing room, crop safe around the center for 4:3 desktop and 3:2 mobile. Soft side daylight, calm warm ivory and honey tones, subtle forest-green out-of-focus background. Natural convincing wood grain, restrained editorial product photography, no excessive orange cast. No humans, hands, text, logos, watermark, frames, ovals, decorations or unrelated props. This represents equipment, not a documented club meeting.
