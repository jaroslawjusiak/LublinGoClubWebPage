# Admin publishing QA gate (M5-T7)

Manual verification of the protected phone publishing workflow. Requires a configured Supabase
project (`docs/ADMIN_SETUP.md`) with at least one allowlisted admin and one non-admin test account.
Run on a real or emulated phone width (360–430px) **and** desktop. Tick every box.

**Target:** an ordinary approved admin publishes a short post with phone photos in **under two
minutes after login**, without any code deploy.

## 1. Auth & authorization

- [ ] Anonymous user visiting `/admin` sees a "Sign in with Google" prompt (no panel).
- [ ] Sign-in with Google returns to `/admin` and shows the post list.
- [ ] A signed-in **non-admin** sees a clear denial (and is offered sign-out).
- [ ] A signed-in **allowlisted admin** sees the post list + "Nowy wpis".
- [ ] `/admin` is not linked from public navigation.

## 2. Post list

- [ ] List shows title, date, tag and status (**Szkic** / **Opublikowany**) per post.
- [ ] "Nowy wpis" opens the form; "Edytuj" opens the existing post; "Usuń" deletes after confirm.

## 3. Create → publish (the two-minute flow)

- [ ] New post defaults to **draft** (nothing publishes until "Opublikuj").
- [ ] Title, body, date (defaults to today), optional tag and link are editable.
- [ ] Validation blocks an empty title/body/date with concise inline errors.
- [ ] Up to 4 photos can be added; a 5th is rejected with a clear message.
- [ ] A large phone photo is validated, resized/compressed and uploaded without freezing the UI.
- [ ] Previews render; individual photos can be removed.
- [ ] "Opublikuj" makes the post appear publicly (RLS lets anonymous read it).
- [ ] "Zapisz szkic" saves it hidden from the public feed.
- [ ] Whole create→publish flow finishes in under two minutes after login.

## 4. Edit & delete

- [ ] Editing a **published** post offers only "Zapisz" (cannot be turned into a draft).
- [ ] Editing a **draft** offers "Zapisz szkic" and "Opublikuj".
- [ ] A saved edit is reflected publicly.
- [ ] "Usuń" removes the post **and** its stored photos (no orphaned images in the bucket).
- [ ] Cancelling a new post removes any images uploaded during that session.

## 5. Security boundary (RLS, not just hidden buttons)

Run the checks in `docs/ADMIN_SETUP.md` §7 against the database/storage:

- [ ] Anonymous `insert/update/delete` on `posts` fails.
- [ ] Authenticated non-admin `insert/update/delete` fails.
- [ ] Allowlisted admin `insert/update/delete` succeeds.
- [ ] Non-admin upload to the `news-images` bucket is rejected; admin upload reads back publicly.

## Sign-off

| Role                 | Name | Date |
| -------------------- | ---- | ---- |
| Admin (publish flow) |      |      |
| Second access holder |      |      |
