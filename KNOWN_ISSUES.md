# Known issues — mistakes already made once. Never repeat them.

Every change is checked against this list by the `workshop-qa` agent before it is handed to the user.
Add a new line whenever the user reports a mistake.

| # | What went wrong | Rule that prevents it |
|---|---|---|
| K01 | Phone showed the old, unstyled site after an upload (cached CSS/JS). | Every upload gets a NEW `?v=N`. Use `python3 tools/make-update.py --bump`. Never re-use a version number that may already be on Hostinger. |
| K02 | Two different builds both used `?v=9`, so the user kept seeing the old logo layout. | Same as K01. `deploy/LATEST.txt` names the newest package; tell the user that folder name only. |
| K03 | Partner logos were moved under the CTA when the user only asked to make them smaller. | Change ONLY what the user asked. Position/layout stays unless they say otherwise. If the request is unclear, ask first. |
| K04 | Logos overlapped the date on mobile. | Check the hero at 390 px width: date, logos, photo and CTA must not touch. |
| K05 | Video overlapped the quiz progress bar (negative margin). | No negative margins between the progress bar and the video; check the video step on mobile. |
| K06 | Name/phone inputs overflowed the card on small phones. | Inputs need `min-width:0` and `box-sizing:border-box`; check at 360 px. |
| K07 | Extra `});` broke app.js after editing the submit handler. | Run `node --check app.js` and every test in `tests/` after any JS edit. |
| K08 | Preview handed over with no CSS (the `<link … />` was not inlined) or with a blank page. | Build previews ONLY with `python3 tools/build-preview.py` (it fails if anything is not inlined) and take a screenshot before handing it over. |
| K09 | The round arrow in the register buttons was off-centre (hidden "↗" text was an extra grid item). | Icons inside round buttons are absolutely centred; zoom-check every round arrow (header, hero, fold, topics, final CTA). |
| K10 | Delay after the email step because the UI waited for Apps Script. | Saving stays optimistic/background (`startSave`); the UI never waits for the network to move to the video. |
| K11 | `config.js` in the repo is PREVIEW mode. | Never put `config.js` in an upload package; the live one has the production endpoint. |
| K12 | Sheet column names are read by Apps Script. | Never rename/move columns in the `Registrations` tab; tell people with edit access the same. |
| K13 | The preview panel cannot load Google Fonts, so Sinhala bold looks thin there. | Say so when showing font changes; do not "fix" weight based on the preview alone. |
| K14 | New controls in the phone field were only checked at 584 px; "+1 876" codes could hit the chevron at 360 px. | Check every change to the details form at 360 px and 390 px with a short (+94), long (+971) and longest (+1 876) code. |
| K15 | Flag emoji are not drawn by Windows Chrome/Edge (they show "LK"). | Expected; phones and Mac show flags. Don't report it as a bug fix unless flag images are bundled. |
