-- seed_posts.sql
-- Historical posts (mirrors src/lib/news/seed.ts). ARCHIVE items, not recent
-- activity — they keep their 2023 dates. Idempotent via fixed ids + on conflict.

insert into public.posts (id, title, body, tag, image_urls, external_url, published_at, published)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'AKIRA Hello World! — Festiwal Spotkań Kultur',
    'W dniach 18–19 listopada 2023 braliśmy udział w Akira Hello World — lubelskim festiwalu kultur Wschodu, gdzie promowaliśmy grę Go wśród mieszkańców Lublina.',
    'wydarzenie',
    '{}',
    'https://akiracon.pl/',
    '2023-11-18T00:00:00+00:00',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'III edycja turnieju „China Town” Weiqi Cup',
    'W dniach 14–15 października 2023 nasi klubowicze wzięli udział w największym turnieju Go w Polsce. Blisko 200 graczy z Europy i Azji rywalizowało w Bibliotece Uniwersytetu Warszawskiego.',
    'turniej',
    '{}',
    'https://board.szalenisamuraje.org/tournaments/3rd-china-town-weiqi-cup',
    '2023-10-14T00:00:00+00:00',
    true
  )
on conflict (id) do nothing;
