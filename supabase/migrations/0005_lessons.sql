-- 0005_lessons.sql — run after migrations 0001–0004 in the Supabase SQL editor.
-- Initial files are served by the website deployment; new files use Storage.
begin;
create table public.lessons (
 id uuid primary key default gen_random_uuid(),
 title text not null check (length(trim(title)) between 1 and 200),
 description text not null check (length(trim(description)) between 1 and 4000),
 pdf_url text not null check (pdf_url ~ '^(/assets/lekcje/|https?://)'),
 thumbnail_url text not null check (thumbnail_url ~ '^(/assets/lekcje/|https?://)'),
 language text not null default 'pl' check (language in ('pl','en','uk')),
 page_count integer check (page_count > 0),
 created_at timestamptz not null default now()
);
alter table public.lessons enable row level security;
grant select on public.lessons to anon, authenticated;
grant insert, update, delete on public.lessons to authenticated;
create policy "Lessons are publicly readable" on public.lessons for select using (true);
create policy "Admins can insert lessons" on public.lessons for insert to authenticated with check (public.is_admin());
create policy "Admins can update lessons" on public.lessons for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete lessons" on public.lessons for delete to authenticated using (public.is_admin());
insert into storage.buckets (id, name, public, allowed_mime_types, file_size_limit) values
 ('lesson-pdfs', 'lesson-pdfs', true, array['application/pdf'], 20971520),
 ('lesson-thumbnails', 'lesson-thumbnails', true, array['image/jpeg','image/png','image/webp'], 5242880);
create policy "Lesson files are publicly readable" on storage.objects for select using (bucket_id in ('lesson-pdfs','lesson-thumbnails'));
create policy "Admins can upload lesson files" on storage.objects for insert to authenticated with check (bucket_id in ('lesson-pdfs','lesson-thumbnails') and public.is_admin());
create policy "Admins can delete lesson files" on storage.objects for delete to authenticated using (bucket_id in ('lesson-pdfs','lesson-thumbnails') and public.is_admin());
insert into public.lessons (id,title,description,pdf_url,thumbnail_url,language,page_count,created_at) values
 ('00000000-0000-4000-8000-000000000001','Kształty (2026)','Poznaj podstawowe kształty kamieni i ich zastosowania w ataku, obronie oraz budowaniu połączeń. Materiał porównuje m.in. nobi, kosumi, hane, skoki i paszczę tygrysa, zwracając uwagę na oddechy, oczność, wydajność i słabe punkty.','/assets/lekcje/ksztalty-2026.pdf','/assets/lekcje/thumbnails/ksztalty-2026.webp','pl',18,'2026-10-04T00:00:59Z'),
 ('00000000-0000-4000-8000-000000000002','Jak atakować (2026)','Atak w Go służy uzyskiwaniu korzyści ze słabości przeciwnika: zdobywaniu terenu, wzmacnianiu własnych grup i budowaniu wpływów. Diagramy pokazują, jak wybrać kierunek ataku i dlaczego próba zabicia grupy za wszelką cenę może obrócić się przeciwko atakującemu.','/assets/lekcje/jak-atakowac-2026.pdf','/assets/lekcje/thumbnails/jak-atakowac-2026.webp','pl',9,'2026-10-04T00:00:58Z'),
 ('00000000-0000-4000-8000-000000000003','Fuseki — jak grać otwarcia (2026)','Materiał wyjaśnia kolejność zajmowania rogów i brzegów oraz znaczenie hoshi, komoku, shimari i kakari. Pokazuje też, jak dobierać kierunek gry i spokojnie odpowiadać na nietypowe otwarcia, duże moyo oraz agresywną grę przeciwnika.','/assets/lekcje/fuseki-2026.pdf','/assets/lekcje/thumbnails/fuseki-2026.webp','pl',23,'2026-10-04T00:00:57Z'),
 ('00000000-0000-4000-8000-000000000004','Yose — wartość ruchów w końcówce (2025)','Dowiedz się, kiedy zaczyna się yose i jak oceniać ruchy domykające granice terytorium. Przykłady rozróżniają sente, gote i odwrócone sente oraz pokazują, jak kolejność zagrań wpływa na końcowy bilans punktów.','/assets/lekcje/yose-2025.pdf','/assets/lekcje/thumbnails/yose-2025.webp','pl',12,'2026-10-04T00:00:56Z'),
 ('00000000-0000-4000-8000-000000000005','Walka ko (2025)','Lekcja wyjaśnia regułę ko i rolę gróźb, które pozwalają odciągnąć przeciwnika od lokalnej walki. Uczy szukania i oceny wielkości gróźb, a na końcu proponuje ćwiczenie z rozpoznawania ich na planszy.','/assets/lekcje/walka-ko-2025.pdf','/assets/lekcje/thumbnails/walka-ko-2025.webp','pl',7,'2026-10-04T00:00:55Z'),
 ('00000000-0000-4000-8000-000000000006','Równowaga — terytorium i wpływy (2025)','Poznaj różnicę między pewnym terenem a strefą wpływów i zobacz, dlaczego oba zasoby są potrzebne. Diagramy pokazują wydajne otaczanie terytorium, wykorzystanie siły w ataku i transfer wpływów, a przykład partii ilustruje zachowanie równowagi na całej planszy.','/assets/lekcje/rownowaga-2025.pdf','/assets/lekcje/thumbnails/rownowaga-2025.webp','pl',16,'2026-10-04T00:00:54Z'),
 ('00000000-0000-4000-8000-000000000007','Inwazja, redukcja, budowanie (2025)','Materiał pomaga zdecydować, kiedy wejść w obszar przeciwnika, kiedy go tylko zmniejszyć, a kiedy rozbudować własną pozycję. Omawia przygotowanie inwazji, bezpieczeństwo grup oraz redukcję ruchem shoulder hit, zestawiając niszczenie cudzego potencjału z budowaniem własnego.','/assets/lekcje/inwazja-redukcja-budowanie-2025.pdf','/assets/lekcje/thumbnails/inwazja-redukcja-budowanie-2025.webp','pl',17,'2026-10-04T00:00:53Z'),
 ('00000000-0000-4000-8000-000000000008','Fuseki — ćwiczenia praktyczne (2025)','Krótki, dwustronicowy materiał przypomina, by w otwarciu nie ograniczać się do jednej części planszy. Pusta plansza stanowi punkt wyjścia do ćwiczenia rozmieszczania kamieni i szukania możliwości budowania terenu w różnych obszarach.','/assets/lekcje/fuseki-cwiczenia-2025.pdf','/assets/lekcje/thumbnails/fuseki-cwiczenia-2025.webp','pl',2,'2026-10-04T00:00:52Z'),
 ('00000000-0000-4000-8000-000000000009','Filozofia Dalekiego Wschodu w Go','Prezentacja przedstawia związki Go z konfucjanizmem, taoizmem i buddyzmem oraz kulturowe opowieści o pochodzeniu gry. Omawia także mentalność rozwojową, poczucie własnej wartości i kontrolę emocji jako elementy uczenia się i samodoskonalenia.','/assets/lekcje/filozofia-dalekiego-wschodu.pdf','/assets/lekcje/thumbnails/filozofia-dalekiego-wschodu.webp','pl',18,'2026-10-04T00:00:51Z');
commit;
