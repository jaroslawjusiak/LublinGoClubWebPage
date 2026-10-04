# Hero z kamieniami muszlowymi — wariant 2

Wygenerowano 2026-09-30 wbudowanym `image_gen`, w dwóch przebiegach edycji.
Plik: `hero-shell-v2.png`. **Wariant odrzucony przez właściciela 2026-09-30**
z powodu nadal złego układu kamieni. Obecny asset aplikacji pozostaje bez zmian.
Punkt wznowienia i oczekiwane zdjęcia: [WZNOWIENIE.md](../WZNOWIENIE.md).

Zachowano kompozycję wcześniejszego hero: dwa drewniane goke, fragment gobanu,
zielone rozmyte tło i światło. Rozrzucone kamienie zastąpiono zwartą grupą
trzech czarnych i trzech białych; białe mają delikatne prążki muszli.
Generator nie odtworzył zadanych ośmiu kamieni. Drugi przebieg skupił się na
osadzeniu sześciu kamieni na istniejącej siatce. Sama generacja nie jest
potwierdzeniem idealnej zgodności każdego środka kamienia z przecięciem;
geometria pozostaje do oceny właściciela znającego Go przed podmianą zasobu.

Referencje: wcześniejszy `public/assets/hero/goban-goke-1440.jpg`,
`concept-a-paper-goban.png` (układ kamieni) i
[zdjęcie kamieni muszlowych wskazane przez właściciela](https://preview.redd.it/more-slate-shell-go-stones-from-kurokigoishiten-v0-re7wzsi3hhuf1.jpg?width=1600&format=pjpg&auto=webp&s=5dca057baee2b90dec3c96fb6594b283dfd791b5)
(materiał kamieni). Nie kopiowano zdjęcia referencyjnego do publikowanych zasobów.

## Prompt pierwszej edycji

```text
Use case: precise-object-edit. Asset type: standalone photorealistic website hero photograph, landscape 4:3.
Input image 1 is the EDIT TARGET: preserve its exact approved camera angle, framing, honey-colored wooden goban corner, two wooden goke bowls completely visible at the back (black stones left, white stones right), soft side daylight and beautiful green foliage bokeh. Keep the bowls, board boundaries, background and overall composition unchanged.
Input image 2 is ONLY a reference for the compact, deliberate arrangement of played stones on the goban in its hero photograph. Do not reproduce any website UI, lettering or mockup.
Input image 3 is ONLY a material reference: genuine Japanese white clamshell Go stones with delicate parallel beige/ivory growth striations, gently polished pearly surfaces; black stones are dark slate, gently polished.
Primary edit: remove ALL five scattered played stones from image 1 and replace them with one compact, purposeful local Go position of EIGHT stones (four black and four white) together on a small patch near the center/lower-center of the visible board, like the close grouping in reference 2. They must look like moves in a real game, not scattered props or a pile.
CRITICAL geometric constraint: every stone's CENTER OF CONTACT with the board must be precisely centered on an actual intersection of two EXISTING grid lines. Do not center stones in squares or between lines; do not shift or bend grid lines to accommodate stones. The grid has two regular straight line families in one consistent perspective. Stone diameter should be just under the local distance between adjacent intersections, as real Go equipment; adjacent stones are near each other without overlapping.
Suggested purposeful local position on a 5-by-5 patch of existing intersections: black at local (1,2), (2,2), (2,3), (3,3); white at (1,1), (3,2), (4,2), (3,4). Coordinates describe neighboring grid intersections in board plane, not image pixels. No coordinate markings. Form a connected bent black chain with white stones approaching its edges, all stones having liberties. A compact natural game position rather than checkerboard or symmetrical ornament.
White stones on the board and visible top-layer stones inside the white goke have fine natural beige shell striations matching image 3. Striations are subtle material texture, never deep grooves, wood grain or stripes printed onto plastic. Keep lens-shaped stones and realistic contact shadows consistent with the target lighting and perspective.
Output ONLY the photograph. No people, hands, text, logos, watermarks, border or webpage. Preserve the approved environment and crop; change only played stone placement and shell/slate stone material.
```

## Prompt korekty osadzenia

```text
Use case: precise-object-edit. Input image is an almost finished 4:3 hero photograph. Make one tiny surgical correction: accurately position the six played Go stones on the grid. Keep this EXACT photograph, identical camera, bowls, green background, lighting, board wood, crop, and beautiful white clamshell beige striations. Keep six stones, three black and three white, in this same compact local group.
Each individual stone must sit perfectly centered on the nearest REAL grid intersection of the existing board. The stone's central vertical axis, projected down onto its base touching the board, must coincide EXACTLY with the crossing of both grid lines. Allow for the perspective: the visible top center is above its board contact point, not the same pixel. Both crossing lines should converge under the central footprint and extend cleanly on either side of it. Move each stone slightly as needed, keeping group compact and plausible, with neighboring stones exactly one grid interval apart where applicable. Do not simply leave the current positions unchanged. Do not redraw, warp or reroute the grid to create fake intersections. Preserve the original regular straight grid. Stone size should remain slightly smaller than a grid interval and stones may not overlap. All six stones have liberties. No new stones or props, no text, no UI. Output the edited photograph only.
```
