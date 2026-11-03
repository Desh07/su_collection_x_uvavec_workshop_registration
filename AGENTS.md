# Su Collection × UVA VEC workshop site — rules for every AI agent (Claude, Codex)

Live: https://freeworkshop.sucollection.shop (Hostinger `public_html`) → `api/register.php` → Google Apps Script → Google Sheet `Registrations`.

## Before you change anything
1. Read `KNOWN_ISSUES.md`. Breaking any rule there is a failure.
2. Change ONLY what the user asked for. If the request can be read two ways, ask (one short question) before editing.

## Making a change (always this order)
1. Edit the repo files (`index.html`, `styles.css`, `app.js`, `translations.js`, `extras.js`). Never edit `config.js` for a UI change.
2. `node --check app.js extras.js translations.js` and run every `tests/*.test.cjs`.
3. `python3 tools/build-preview.py` (whole page) and, for a section, `python3 tools/build-preview.py --section <id>`.
4. Screenshot the preview and look at the exact thing that changed (zoom if small). Phone width first — most users are on mobile.
5. Hand the change to the **workshop-qa** agent (`agents/workshop-qa.md`). Fix everything it reports, then re-run it.
6. Only after QA passes: `python3 tools/make-update.py --bump` → new `deploy/update-vN`. Tell the user that folder name and the 5 files.

## Never
- Re-use a `?v=` number, upload `config.js`, or rename Sheet columns.
- Say something is fixed without a screenshot that shows it.
- Enter passwords/secrets or click Google "Allow" for the user.
