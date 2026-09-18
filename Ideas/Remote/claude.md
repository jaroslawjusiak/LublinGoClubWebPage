I went through all four pages. Here's my honest read, then the ideas.

## What the site does well (keep this)

- The core message is clear: **Wednesdays 17:00–20:00, MDK nr 2, free, everyone welcome**. That's the whole point of a club site and it's on the homepage.
- The rules page is genuinely well written — someone who understands Go wrote it, and the ko explanation ("wstrzymuje oddech") is better than most Polish-language intros online. Don't throw the text away.
- The hand-drawn logo and poster by Amelia give the club a real identity. Most club sites have generic stock kifu images.

---

## What I'd cut

**1. Stale events written in the present tense.**
The events page says *"W dniach 18-19.11.2023 bierzemy udział w Akira Hello World"* — present tense, three years old. This is the single most damaging thing on the site. A visitor in 2026 concludes the club may not exist anymore. Anything dated must either move to an archive or carry a visible year.

**2. The duplicate/divergent Discord invites.**
The homepage links `cZNpEtfj5J`, the other three pages link `xeaQ8uMy`. At least one is probably dead. Any link that appears on every page needs one source of truth.

**3. Raw contact details.**
A personal mobile number and two Gmail addresses sitting in plain text are scraped within days. Replace with a form, or a single club address, or at minimum obfuscated/click-to-reveal.

**4. The repeated image-based social footer.**
Facebook and Discord logos as raw `<img>` with a bare URL printed next to them. Icons + labels, one component, every page.

**5. Meeting details duplicated on two pages.**
Homepage and Kontakt both hardcode the address and hours. The day you move rooms, one of them will be wrong. One data source, rendered in both places.

**6. "Galeria" as a separate destination.**
A gallery with no context is a dead end. Photos belong attached to the event they came from.

**7. The rules page as one unbroken wall.**
Not the content — the format. Four figures and ~900 words of dense paragraphs is where a curious 12-year-old bounces.

---

## New features — the ones I'd actually build

### Tier 1: fixes the real problem (people don't show up)

**The "can I just come?" answer block.**
Above the fold, answering what an anxious first-timer actually wonders — and nothing else:
> Next meeting: **Wednesday, 23 September, 17:00**. Just turn up. Nothing to bring. No experience needed. Free. Children welcome with a parent.

Auto-compute the next Wednesday date in JS. A site that knows today's date feels alive; a static "środy 17-20" doesn't.

**A proper "Pierwsza wizyta" page.**
Photo of the building entrance from the street. Photo of the corridor and the door to Sala 14 ("Galeria na górze" is a local's instruction, not a stranger's). Embedded map. Parking, bus stops. What happens in the first 30 minutes — someone will sit down with you and teach you on a 9×9 board, you'll play your first game that evening.

**English version.**
Lublin has thousands of international students — UMCS, KUL, the medical university. Go's player base skews heavily toward that exact demographic, and right now the site is invisible to all of them. A `/en` mirror is probably the highest ratio of new members to effort of anything on this list.

**Decent link previews.**
Every page currently has the same `<title>` and no meta description or OG image. When someone pastes the link into a Facebook group or Discord, it renders as a grey nothing. Proper per-page titles and an OG card with the logo is an hour of work.

### Tier 2: the stuff only a Go club can do

**An interactive board instead of static JPEGs.**
This is the big one. The rules page should let you *play*, not just read:
- click through the four existing figures move by move
- an "atari go" mini-game (first capture wins) against a trivial bot on 9×9 — the standard way Go is taught to beginners
- 10–15 capture puzzles with instant right/wrong feedback

Keep the existing prose as the explanation beside each interactive figure.

**Tsumego of the week.**
One problem on the homepage, solvable in the browser, rotating weekly. Gives people a reason to return to the site between Wednesdays, and it's free SEO content forever.

**SGF viewer + commented games.**
Members upload their games from club evenings or tournaments, with a short commentary. An embedded SGF player is a solved problem. This is the content that makes a club site worth visiting rather than a flyer, and it costs the club nothing but a few minutes after each game.

**Club ladder / ranking table.**
Current members with their rank (kyu/dan), OGS or KGS handles, EGF rating links where applicable. Turns an anonymous "klub" into named people you can look up and challenge online between meetings. Also quietly signals the club is competitive enough to be worth joining.

### Tier 3: growth and legitimacy

**Events split into Nadchodzące / Archiwum, with dates that never lie.**
Past events auto-drop into the archive based on their date. The archive is an asset — twelve years of Akira festivals and tournament trips is proof of a living club — as long as it's labelled as history.

**Subscribe-to-calendar (.ics) and a Google Calendar link.**
"Add club meetings to my calendar" removes the main reason people forget to come back after their first visit.

**An offer page for schools, libraries and festivals.**
Go workshops for a class, a stand at a festival, an activity for a youth centre. A one-page offer with photos and a contact route is how clubs get invited, get venues, and get small grants. Right now there's no way for an institution to find out this is even possible.

**People, not just contacts.**
Replace the bare contact list with short profiles — photo, rank, how long they've played, what they like teaching. Someone deciding whether to walk into a room full of strangers is reassured by faces.

**Learning resources page.**
Where to play online (OGS), phone apps, Polish-language books, Sensei's Library, AI review tools, and yes — *Hikaru no Go*, which is how roughly half of all European players got started. Also: where to buy a board, and whether the club lends sets.

**Live Discord presence.**
A widget showing online member count makes the community look populated instead of hypothetical.

### Small things with good returns

- **Dark mode.** A Go site in black-and-white with a wood-tone accent basically designs itself, and it'll look deliberate rather than themed.
- **Photos with people in them.** Currently the site shows a board and a poster. Show a table with five people leaning over a game. That single image sells the club better than every paragraph on it.
- **A one-line "why Go" pitch.** 2,500 years old, five rules, a lifetime to learn — plus the honest local angle: unlike chess, you can go from zero to a real game in one evening.

---

## Suggested sitemap

```
/            Hero + next meeting + what Go is + tsumego of the week + photos
/pierwsza-wizyta   How to find us, what to expect, FAQ
/nauka       Interactive rules → atari go → puzzles → resources
/wydarzenia  Upcoming | Archive (by year)
/gry         Commented games (SGF viewer)   [optional, phase 2]
/klub        People, ladder, contact form
/oferta      Workshops for schools & festivals
/en/...      Full English mirror
```

Galeria disappears as a nav item and its photos are redistributed into the events and first-visit pages.

---

Ready for your list whenever you want to compare — I'm curious how much overlaps.