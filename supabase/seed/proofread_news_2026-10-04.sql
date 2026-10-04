-- Ręczna korekta 10 błędów w 4 aktualnościach.
-- Uruchom CAŁY plik w Supabase SQL Editor.
-- Zmienia wyłącznie zatwierdzone fragmenty title/body oraz updated_at.
-- Nie zmienia dat publikacji, zdjęć, tagów, linków ani statusu publikacji.
-- Brak wpisu, duplikat lub nieoczekiwany tekst przerywa całą transakcję.
-- Ponowne uruchomienie po udanej korekcie nie zmienia już wpisów.

begin;

do $proofreading$
declare
  results jsonb := '[]'::jsonb;
  task record;
  post record;
  replacement jsonb;
  before_text text;
  after_text text;
  body_text text;
  title_text text;
  matches integer;
  occurrences integer;
begin
  for task in
    select * from (values
      (
        'Nowy rok, nowi gracze',
        'Nowy rok, nowi gracze',
        '[ ["now koncepcje", "nowe koncepcje"], ["na OGSie", "na OGS-ie"] ]'::jsonb,
        true
      ),
      (
        'Nasi klubowicze na Europejskim Kongresie Go',
        'Nasi klubowicze na Europejskim Kongresie Go',
        '[ ["koczulkach", "koszulkach"], ["Konkresie", "Kongresie"] ]'::jsonb,
        false
      ),
      (
        'Penerowe spotkanie na Placu Litewskim',
        'Plenerowe spotkanie na Placu Litewskim',
        '[ ["naszym mieszańcom", "naszym mieszkańcom"], ["na codzień", "na co dzień"] ]'::jsonb,
        false
      ),
      (
        'Klubowy turniej',
        'Klubowy turniej',
        '[ ["4 rundowy", "4-rundowy"], ["(słabsi gracze dostają dodatkowe kamienie na starcie), gry", "(słabsi gracze dostają dodatkowe kamienie na starcie) gry"] ]'::jsonb,
        false
      )
    ) as tasks(old_title, new_title, replacements, add_final_period)
    order by old_title
  loop
    select count(*) into matches
    from public.posts
    where title in (task.old_title, task.new_title) and published = true;

    if matches <> 1 then
      raise exception 'Oczekiwano jednego opublikowanego wpisu "%", znaleziono %. Żadne poprawki nie zostaną zapisane.', task.old_title, matches;
    end if;

    select id, title, body into strict post
    from public.posts
    where title in (task.old_title, task.new_title) and published = true
    for update;

    if post.body is null then
      raise exception 'Wpis "%" ma pustą treść. Żadne poprawki nie zostaną zapisane.', post.title;
    end if;

    body_text := post.body;
    title_text := task.new_title;

    for replacement in select value from jsonb_array_elements(task.replacements)
    loop
      before_text := replacement ->> 0;
      after_text := replacement ->> 1;
      occurrences := (length(body_text) - length(replace(body_text, before_text, ''))) / length(before_text);

      if occurrences = 1 then
        body_text := replace(body_text, before_text, after_text);
      elsif occurrences = 0 and
        (length(body_text) - length(replace(body_text, after_text, ''))) / length(after_text) = 1 then
        -- Ta poprawka została już zapisana.
        null;
      else
        raise exception 'Nieoczekiwana treść wpisu "%": fragment "%" występuje % razy, a poprawiona wersja nie jest jednoznaczna. Żadne poprawki nie zostaną zapisane.', post.title, before_text, occurrences;
      end if;
    end loop;

    if task.add_final_period then
      if body_text ~ 'https://online-go\.com/\)[[:space:]]*$' then
        body_text := regexp_replace(body_text, '\)([[:space:]]*)$', ').\1');
      elsif body_text !~ 'https://online-go\.com/\)\.[[:space:]]*$' then
        raise exception 'Nieoczekiwane zakończenie wpisu "%". Żadne poprawki nie zostaną zapisane.', post.title;
      end if;
    end if;

    results := results || jsonb_build_array(jsonb_build_object(
      'id', post.id,
      'changed', post.title is distinct from title_text or post.body is distinct from body_text,
      'old_title', post.title,
      'new_title', title_text,
      'old_body', post.body,
      'new_body', body_text
    ));

    if post.title is distinct from title_text or post.body is distinct from body_text then
      update public.posts
      set title = title_text, body = body_text, updated_at = now()
      where id = post.id;
    end if;
  end loop;
  -- Wyniki przechowywane tylko do końca bieżącej transakcji, bez tabeli.
  perform set_config('lkg.news_proofreading_results', results::text, true);
end;
$proofreading$;

-- Wynik: cztery wpisy, ich treść przed/po i informacja, czy nastąpiła zmiana.
select *
from jsonb_to_recordset(current_setting('lkg.news_proofreading_results')::jsonb)
  as results(id uuid, changed boolean, old_title text, new_title text, old_body text, new_body text)
order by new_title;

commit;
