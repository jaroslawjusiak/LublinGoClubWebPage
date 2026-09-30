# Local Noto fonts

Downloaded 2026-09-30 from the Google Fonts CSS API and its official
`fonts.gstatic.com` files. Exact file URLs and SHA-256 digests are in
`sources.json`; original SIL Open Font License 1.1 texts are included separately
for Noto Sans and Noto Serif.

Normal variable Noto Sans covers weights 400–800 used by body, navigation and
admin. Normal variable Noto Serif covers 500–800 used by public headings during
the migration. Each family includes Latin, Latin extended (Polish), and Cyrillic
(Ukrainian, including U+0490/U+0491). No italic or unrelated script files are
loaded. `fonts.css` uses local URLs, `font-display: swap` and Unicode ranges so
the browser downloads only the subsets it needs. There are no font preloads.

Source request:
<https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400..800&family=Noto+Serif:wght@500..800&display=swap>

License sources:

- <https://github.com/google/fonts/blob/main/ofl/notosans/OFL.txt>
- <https://github.com/google/fonts/blob/main/ofl/notoserif/OFL.txt>
