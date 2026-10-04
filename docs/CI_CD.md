# CI/CD — GitHub Actions i Vercel

Workflow: `.github/workflows/ci-cd.yml`.

| Zdarzenie                        | Kontrola                  | Wdrożenie                       |
| -------------------------------- | ------------------------- | ------------------------------- |
| Pull request do `main`           | `npm ci`, `npm run check` | Brak                            |
| Push lub merge do `main`         | `npm ci`, `npm run check` | Production po sukcesie kontroli |
| Actions → CI / CD → Run workflow | `npm ci`, `npm run check` | Preview wybranej gałęzi         |

Kontrola obejmuje ESLint, Prettier, TypeScript, testy z coverage i build.
PR (także z forka) nie ma dostępu do sekretów wdrożeniowych.
Ręczne uruchomienie zawsze tworzy Preview, również dla `main`.
Workflow nie wykonuje migracji ani zmian danych Supabase.

## Jednorazowe przygotowanie

1. Wybierz projekt Vercel przeznaczony dla nowej aplikacji. Nie zakładaj, że projekt
   starej strony jest właściwy. Root Directory: katalog główny repozytorium;
   Framework: Vite; Node.js: **22.x**; Build Command: `npm run build`;
   Install Command: `npm ci`; Output Directory: `dist`.
2. W Vercel ustaw `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY` dla **Production**
   i **Preview**. Wartości są wbudowywane w publiczny bundle. Nigdy nie używaj
   klucza `service_role`. Preview z produkcyjnym Supabase korzysta z tych samych
   danych; do izolowanych prób użyj osobnego projektu Supabase.
3. Lokalnie, w repozytorium, uruchom `npx vercel@62.2.0 link` i wybierz właściwy
   zespół oraz projekt. Z `.vercel/project.json` odczytaj `orgId` i `projectId`.
   Nie commituj katalogu `.vercel`.
4. Utwórz token na <https://vercel.com/account/tokens> z dostępem do wybranego
   zespołu. GitHub → repozytorium → Settings → Secrets and variables → Actions →
   New repository secret:

   | Secret              | Wartość                              |
   | ------------------- | ------------------------------------ |
   | `VERCEL_TOKEN`      | Token Vercel                         |
   | `VERCEL_ORG_ID`     | `orgId` z `.vercel/project.json`     |
   | `VERCEL_PROJECT_ID` | `projectId` z `.vercel/project.json` |

5. W GitHub → Settings → Environments utwórz `production` oraz `preview`.
   Dla `production` ogranicz deployment branches do `main`. Sekrety można także
   przechowywać osobno w tych environments. Nie dodawaj wymaganej ręcznej zgody,
   jeśli wdrożenia mają być automatyczne.
6. Najpierw uruchom Preview z gałęzi zawierającej ten workflow. Przed scaleniem
   do `main` upewnij się, że sekrety wskazują właściwy projekt. **Scalenie do
   `main` uruchomi wdrożenie produkcyjne.** Ostatnie zmiany funkcjonalne mogą
   nadal być na innych gałęziach: pipeline wdraża zawartość `main`.
7. Ustaw ruleset/branch protection dla `main`: wymagaj pull requestu i sukcesu
   checka `Quality checks`, najlepiej także aktualizacji gałęzi względem `main`.
   Nazwa checka pojawi się po pierwszym uruchomieniu. Sam workflow blokuje deploy
   po błędzie kontroli; ochrona gałęzi dodatkowo blokuje scalenie takiego PR.

## Jeden mechanizm wdrażania

`vercel.json` ustawia `git.deploymentEnabled: false`: natywne wdrażanie z Git
jest wyłączone, a publikacją zarządza GitHub Actions. Zapobiega to drugiemu,
niezależnemu wdrożeniu omijającemu testy. Gałęzie, które nie zawierają tej
konfiguracji, mogą nadal uruchamiać natywne deploymenty; przed przejściem na
pipeline zaktualizuj aktywne gałęzie lub odłącz integrację Git w ustawieniach
docelowego projektu Vercel. Po odłączeniu CLI nadal może wdrażać przez ID projektu.

Kontrola PR działa bez konfiguracji Supabase. Job wdrożeniowy pobiera właściwe
zmienne i ustawienia przez `vercel pull`, buduje artefakt przez `vercel build`
i wysyła go przez `vercel deploy --prebuilt`. Build w `npm run check` sprawdza
kod; build wdrożeniowy używa zmiennych docelowego środowiska. Vercel nie buduje
ponownie przesłanego artefaktu. CLI jest przypięte do wersji 62.2.0.

## Sprawdzenie pierwszego wdrożenia

- W Actions oba joby kończą się sukcesem. URL znajduje się w podsumowaniu runa
  i w GitHub Environment. Preview nie jest automatycznie komentowane w PR.
- Pod URL Preview sprawdź stronę główną, bezpośrednie wejście na `/kontakt`,
  `/en/aktualnosci`, `/admin`, aktualności oraz przekierowanie `/kontakt.html`.
- Po scaleniu sprawdź te same ścieżki pod domeną produkcyjną, logowanie admina
  i odczyt danych Supabase. Sukces builda nie potwierdza działania danych ani logowania.

## Błędy i rollback

- `Missing GitHub secret`: dodaj brakujące sekrety w repozytorium lub environment.
- `403` z Vercel: token nie ma dostępu do zespołu wskazanego przez `VERCEL_ORG_ID`.
- Błąd Node.js: sprawdź 22.x w Vercel; README ze starszym minimum Node 18 nie
  odpowiada obecnemu Vite w lockfile.
- Błąd kontroli: popraw wskazany lint, format, typ lub test. Nie pomijaj bramki.
- W razie problemu produkcyjnego przywróć poprzednie wdrożenie w panelu Vercel,
  a następnie zrób revert wadliwej zmiany w GitHub. Kolejny push do `main`
  ponownie wdraża kod. Rollback frontendu nie cofa zmian bazy danych.

Dokumentacja: [GitHub Actions z Vercel](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel),
[konfiguracja Git](https://vercel.com/docs/project-configuration/git-configuration).
