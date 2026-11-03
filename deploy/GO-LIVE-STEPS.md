# Go live – freeworkshop.sucollection.shop (≈20 min, ඔයාට කරන්න ඕන ටික)

Google Sheet: https://docs.google.com/spreadsheets/d/1E239j1uuEqhdsXLRo7lfOIbKonVXFawxhlUh7xbv1tk/edit
Owner account: hansakamadhuwantha163@gmail.com

## 0. Secret එක හදන්න (එක පාරයි)
Mac Terminal: `openssl rand -hex 32` → ආපු අකුරු 64 notepad එකක තියාගන්න. (chat/Git වලට දාන්න එපා.)

## 1. Apps Script (Google)
"Page not found" ආවේ Brave එකේ Google accounts කිහිපයක් log වෙලා තියෙන නිසා.
→ Brave **Private window** එකක් open කරලා hansakamadhuwantha163 එකෙන් **විතරක්** log වෙන්න.
1. Sheet එක open → **Extensions → Apps Script**.
2. `Code.gs` එකේ තියෙන ඔක්කොම මකලා, project එකේ `apps-script.js` එකේ content එක paste → Save.
3. ⚙ **Project Settings** → "Show appsscript.json" tick → editor එකේ `appsscript.json` එකට `server/appsscript.json` content එක paste → Save.
4. Project Settings → **Script properties → Add**:
   - `SHEET_ID` = `1E239j1uuEqhdsXLRo7lfOIbKonVXFawxhlUh7xbv1tk`
   - `SHARED_SECRET` = step 0 secret එක
5. Editor එකේ function list එකෙන් `setupWorkshopSheets` තෝරලා **Run** → Google permission එක review කරලා Allow.
6. **Deploy → New deployment → ⚙ Web app** → Execute as: **Me**, Who has access: **Anyone** → Deploy → `/exec` URL එක copy කරගන්න.

## 2. Hostinger (freeworkshop.sucollection.shop)
1. hPanel → Websites → freeworkshop.sucollection.shop → **File Manager**.
2. `public_html` ඇතුළට `deploy/workshop-LIVE-upload.zip` upload කරලා **Extract** (index.html කෙලින්ම public_html ඇතුළේ තියෙන්න ඕන). Zip එක පස්සේ delete.
3. `public_html` එකට **පිටින්** (එකම level එකේ) `workshop-private` කියලා folder එකක් හදන්න.
4. ඒක ඇතුළට `deploy/config.php.FILL-ME` upload කරලා නම `config.php` කරන්න → Edit:
   - `apps_script_url` = step 1.6 `/exec` URL
   - `shared_secret` = step 0 secret (Apps Script එකේ දාපු එකමයි)
5. hPanel → **SSL** on කරලා තියෙනවද බලන්න (https).

## 3. Test (විනාඩි 2)
https://freeworkshop.sucollection.shop open → "TEST" නමින් register වෙලා ප්‍රශ්න 4ට උත්තර දෙන්න →
Sheet එකේ Registrations tab එකට row එකක් ආවද බලන්න → ආවොත් ඒ TEST row එක delete. ඉවරයි.
Error එකක් ආවොත් screen එකේ message එක Claude ට එවන්න.
