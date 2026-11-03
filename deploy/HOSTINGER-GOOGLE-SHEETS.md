# Workshop registration → Google Sheets

Target Google owner: hansakamadhuwantha163@gmail.com.
Flow: browser → same-origin `api/register.php` on Hostinger → signed Google Apps Script request → private Google Sheet.

## Prepared, not yet live

`config.js` remains `mode: 'preview'`. Local quiz saves are simulated. Backend tests use fake in-memory Sheets, not a real Google workbook. Do not launch registration traffic until the live end-to-end check below passes.

The native Google Sheet was created in Brave under the confirmed target account (the connected Drive connector uses a different account and was not used for writes). Verified Sheet: https://docs.google.com/spreadsheets/d/1E239j1uuEqhdsXLRo7lfOIbKonVXFawxhlUh7xbv1tk/edit?gid=1011779433#gid=1011779433 . Original workbook remains unchanged. RegistrationsTable, FieldGuideTable and AnswerCodesTable have been restored as native Google Sheets tables.

## Google Sheet

1. Import the prepared workbook into the intended Google account as a **native Google Sheet**, keeping Registrations, Field Guide, Answer Codes, Setup and Rules. Registrations starts empty; keep all 39 headers in order. The original local XLSM stays untouched.
2. In that Google Sheet select **Extensions → Apps Script**. Replace the default code with the project’s `apps-script.js` (Code.gs). Use `server/appsscript.json` as its manifest.
3. In Script properties set `SHEET_ID` to this Sheet’s ID and `SHARED_SECRET` to a freshly generated strong shared secret (at least 32 random bytes; hex is convenient). Keep the secret out of frontend files, chat, Git and public folders.
4. Run `setupWorkshopSheets` as the Sheet owner. Review and authorize its Google Sheets access yourself. This applies validation/formats and checks headers; it does not add fake participants.
5. **Deploy → New deployment → Web app**. Execute as the owner; access must allow the Hostinger server to POST without an interactive Google login. Every actual save still requires the private HMAC signature. Review Google’s permission prompts before approving. Copy the `/exec` deployment URL.
6. After script updates, update the existing deployment to the new version; keep its configured URL consistent.

The script uses the Google Sheets OAuth scope to open the configured workbook by ID. Granting authorization is an explicit owner action. Never make the participant Sheet public.

## Hostinger

Use the PHP/HTML hosting service already available through the intended account/shared access. Do not overwrite the unrelated UVA VEC website or choose a domain without confirmation.

1. In the site’s domain directory, put the application files from `workshop-public-preview.zip` **inside public_html**, so `public_html/index.html` and `public_html/api/register.php` exist directly. Extracting a nested project directory will give the wrong URL.
2. Create a sibling folder `workshop-private`, outside `public_html`. Copy `server/config.example.php` there as `config.php`.
3. Fill its `apps_script_url`, the exact same `shared_secret`, and `allowed_origins` (e.g. `https://workshop.example.com`, no path/trailing slash). No secrets go in browser `config.js`.
4. The PHP endpoint resolves `domain/workshop-private/config.php` by default. For a different directory set the server environment variable `WORKSHOP_PRIVATE_DIR` to the correct absolute private path. That folder must be writable for its short-lived salted rate-limit file.
5. PHP 8.2+ with cURL is used. HTTPS certificate checks stay enabled. The proxy follows Google Content Service redirects and returns only a small JSON acknowledgement.
6. Set the real community/help/privacy/video URLs when available; missing resources remain clearly labelled placeholders. Workshop time stays pending the WhatsApp poll.

## Verify before production

- Authorize and deploy Apps Script; configure the private PHP proxy.
- On a non-public staging copy, temporarily set config mode to `production` and `testFlag: true`. Use a clearly labelled test name and a number you are authorized to use. Confirm one TEST row appears after contact save and gets updated through all four answers.
- Retry the same request: it must keep the same registration_id and row. Required consent and invalid answers must be rejected server-side.
- Check Sinhala text, WhatsApp text format, COMPLETE/completed_at/video ID, separate optional requests, and enquiry-only behavior.
- A link click must not mark group membership confirmed. A valid phone format must not mark ownership verified.
- A backend failure must keep entries and show an error, not a success screen.
- Only after these pass, set `testFlag: false` and production mode on the actual site. Do not put participant data in publicly readable files.

## Data handling

- Exact 39 template columns, one registration attempt per immutable UUID. Server-owned timestamps and statuses; defaults remain unknown/no where appropriate.
- Q1–Q4 codes and all V1–V5 routing priorities match the supplied template. Q4 alone does not create e-book/mentorship requests.
- Retried start requests use a deterministic UUID based on request_id. Updates require a signed per-registration session token. A script lock serializes writes.
- Possible repeated phone numbers are marked DUPLICATE_REVIEW, never silently merged (families can share numbers).
- The existing optional email field has no column in the supplied template, so it is retained in a private `Contact Extras` tab keyed by registration_id. Custom enquiry messages and their separate consent are retained in an `Enquiries` tab. Main headers stay unchanged.
- Text starting with formula characters is written as literal text. Attribution is captured on the first save. No ownership verification or attendance is fabricated.

## Local checks

```
node tests/apps-script.test.cjs
php tests/proxy.test.php
php -l api/register.php
php -l api/lib/proxy.php
node --check app.js
```

Passing mocked tests does not establish that a real Google deployment is connected.

Official setup references:
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/guides/content
- https://www.hostinger.com/support/how-to-upload-a-website-from-backups/
