# PDF-based frontend preview

Current runtime: frontend preview. A Google Sheets backend is now prepared separately; it is not yet authorized, deployed or connected. `config.js` uses `mode: 'preview'`. All save operations are simulated in memory. No registration, enquiry, membership, or preference data is sent to a backend or stored persistently. Refreshing clears the demo.

## Preview journey

1. Basic details: name, WhatsApp number/country code, optional email, workshop contact permission and separate optional updates preference.
2. Four single-choice questions from the PDF: purpose, current situation, priority topic and learning preference. Selection never auto-advances. Back preserves responses.
3. CUSTOM asks whether the visitor also wants to attend; enquiry-only has a separate consented demo form and no workshop invitation.
4. Completion shows the selected V1–V5 text, chosen focus, video placeholder and community invitation. Viewing a video is optional. Separate optional e-book/mentorship requests do not follow automatically from quiz answers.

Event: 14 November 2026. Time is pending the WhatsApp community poll. No assumed time or automatic monthly date rollover.

## Replace later

Edit `config.js` for approved video URLs, posters, Sinhala captions, community/help/privacy links and event time after confirmation. Empty resources remain clickable placeholders displaying “පසුව එක් කෙරේ”. Transcripts are included in `app.js`. No placeholder navigates to a fake external destination.

Keep preview mode for this frontend review. The supplied apps-script.js now implements the template’s 39-column Google Sheets writer. The same-origin PHP proxy is in api/. See deploy/HOSTINGER-GOOGLE-SHEETS.md for owner authorization and deployment; this demo remains disconnected until live checks pass.

## Checked

- 600 purpose/stage/focus/preference route combinations (including V1–V5 priorities).
- Desktop/mobile details → four explicit steps → result; Back retains selections.
- Required-field/consent validation; updates unticked by default.
- FREE/SELF/GUIDED do not create product requests; “none” clears both optional requests.
- Simulated failure preserves entries and does not display completion.
- Separate enquiry-only route; resource placeholders; zero registration POST requests.
