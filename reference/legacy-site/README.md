# reference/legacy-site — archived copy of the old live site

> **Reference only. Do not serve this directory.** It lives outside `src/` and
> `public/`, so it is excluded from the Vite build and will not be deployed.
> It exists purely for editorial migration (rules content, photos, events).

**Source:** <https://lubelski-klub-go.vercel.app/> (also reachable via
`lubelski-klub-go.pl`), fetched **2026-09-27**.

## Contents

- `index.html`, `kontakt.html`, `zasady.html`, `wydarzenia.html`, `galeria.html`
- `style.css` — original stylesheet
- `assets/` — logo, go-board, poster, social logos, rules diagrams (`assets/zasady/`)
- `photo/` — event photography (`photo/akira/`, `photo/china-town/`)

## Asset provenance

- `assets/logo.png` and `assets/Plakat.jpg` — attributed in the old page markup to
  **Amelia Jusiak** ("Autor logo: Amelia Jusiak", "Autor rysunku: Amelia Jusiak").
- Rules diagrams in `assets/zasady/` — authored as part of the original `zasady.html`.
- Event photos in `photo/` — taken at club events (Akira Hello World 2023,
  3rd China Town Weiqi Cup 2023).

## Photo-consent status (BLOCKING for publication)

The following files show **identifiable people** and their publication consent has
**not** been verified:

- `photo/china-town/amelia.png`
- `photo/china-town/piotrek.jpg`
- `photo/china-town/tomek.jpg`
- `photo/china-town/jarek.jpg`
- `photo/china-town/participants.jpg`

Do **not** publish any of the above until written consent (including parental
consent for minors) is recorded. When in doubt, default to non-identifying
board/hands photos.

## Known discrepancies to re-verify before launch

- The old site contained **two different Discord invite codes**: `discord.gg/xeaQ8uMy`
  (kontakt/zasady/wydarzenia/galeria pages) and `discord.gg/cZNpEtfj5J` (index.html).
- Personal contact details on the old `kontakt.html` (Piotr Dyszczyk /
  Jarosław Jusiak) are historical evidence only and must not be published as the
  primary public contact channel (see `src/data/club.ts`).
