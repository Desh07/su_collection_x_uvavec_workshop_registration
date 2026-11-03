# Workshop template → registration mapping

Source: `Su_Collection_Workshop_Registration_Template.xlsm`, `Registrations!A1:AM1`, Field Guide and Setup and Rules. The supplied workbook was read only and has not been changed.

## Current status

The four question code sets and video routing already match the template. The existing site is still a frontend preview: saves are simulated in memory. No live writer/database/export exists. The old `apps-script.js` has a different nine-column format and cannot be used for this template as-is.

The template is a data schema, not 39 questions. Visitor inputs belong in the form; server metadata and admin follow-up fields must not be asked as registration questions. One row per attempt, updated by immutable registration_id. No invented participants or completion timestamps.

## Required inputs

Full name, normalized WhatsApp number, workshop contact consent and Q1–Q4. CUSTOM also requires the attendance choice. Marketing and product requests stay separate and optional. Existing optional email input has no corresponding template column; decide whether to keep it in a separate backend field before production, rather than silently losing it or adding an unapproved workbook column.

## Exact field mapping

| Excel header | Current form/event or responsible writer | Workbook owner |
|---|---|---|
| `registration_id` | Server | Server |
| `workshop_id` | Server constant SU-FW-02-2026-11-14 | Server |
| `created_at` | Server | Server |
| `updated_at` | Server | Server |
| `registration_status` | Server | Server |
| `full_name` | details.name | Visitor |
| `whatsapp_number` | normalPhone() / details.phone | Visitor + server |
| `workshop_contact_consent` | details.workshop_contact_acknowledgement → YES/NO | Visitor |
| `marketing_opt_in` | details.marketing_opt_in → YES/NO | Visitor |
| `consent_version` | Server | Server |
| `consent_recorded_at` | Server | Server |
| `marketing_opt_in_updated_at` | Server | Server |
| `q1_purpose` | answers.Q1 | Visitor |
| `custom_attend_workshop` | custom_attending → YES/NO; blank unless CUSTOM | Visitor |
| `q2_stage` | answers.Q2 | Visitor |
| `q3_challenge` | answers.Q3 | Visitor |
| `q4_learning_preference` | answers.Q4 | Visitor |
| `quiz_version` | Server constant quiz-v1 | Server |
| `completed_at` | Server | Server |
| `video_id` | Server recomputes selectVideo with workbook routing order | Server |
| `contact_verification_status` | Server or admin | Server or admin |
| `existing_community_member` | Optional visitor self-report; UNKNOWN until asked | Visitor |
| `group_link_clicked_at` | First acknowledged invitation_click on server | Server |
| `group_join_status` | Admin or visitor | Admin or visitor |
| `group_join_confirmed_at` | Admin | Admin |
| `attendance_status` | Admin | Admin |
| `attendance_minutes` | Admin | Admin |
| `ebook_details_requested` | Explicit requests.includes(ebook) → YES/NO | Visitor |
| `mentorship_details_requested` | Explicit requests.includes(mentorship) → YES/NO | Visitor |
| `product_request_updated_at` | Server | Server |
| `utm_source` | Server | Server |
| `utm_medium` | Server | Server |
| `utm_campaign` | Server | Server |
| `utm_content` | Server | Server |
| `record_flag` | Server or admin | Server or admin |
| `duplicate_of_registration_id` | Admin | Admin |
| `follow_up_owner` | Admin | Admin |
| `follow_up_status` | Admin | Admin |
| `admin_notes` | Admin | Admin |

## Backend contract and defaults

- Reconcile current config event_id `su-2026-11-14` with workbook workshop_id `SU-FW-02-2026-11-14`, and current quiz version `2026-11-v1` with workbook `quiz-v1`, when connecting the agreed backend. They are not currently a live connection.
- Start: create UUID, stable created_at, updated_at, STARTED, UNVERIFIED contact, UNKNOWN membership/group/attendance, NORMAL flag, NO optional requests, NOT_REQUIRED follow-up. Unasked answers remain blank.
- Answer: update this same row by registration_id. Keep original attribution and created_at.
- Complete: validate name/phone/consent and all four answer codes server-side, recompute V1–V5, then acknowledge COMPLETE and completed_at only after durable save.
- CUSTOM + NO: ENQUIRY_ONLY; completed_at and video_id remain blank, no group invite; enquiry message/consent belong in a separate enquiry record.
- Invitation click is not confirmed membership. A typed plausible phone number is not verified ownership.
- Optional preferences require explicit save. Q4 SELF/GUIDED alone never sets e-book/mentorship requests.
- Export all 39 columns in exact header order; preserve phone numbers and identifiers as text, Sinhala as Unicode and timestamps in Asia/Colombo. Keep template rules and validation intact.

## Selected storage: Google Sheets

User selected Google Sheets, superseding the earlier Excel Online choice. Target owner is hansakamadhuwantha163@gmail.com. Browser → Hostinger PHP proxy → signed Apps Script → private Google Sheet. Preserve all 39 main headers. No Microsoft 365 or database export is required.

Implementation: apps-script.js maps inputs to these exact columns, validates all codes/consent, derives server timestamps/status/video ID, and updates by registration_id. Optional email is preserved in Contact Extras, custom enquiries in Enquiries.

Connection status: code and mocked tests are prepared; live Google account selection, workbook creation, owner authorization, Apps Script deployment, hosting destination and private proxy configuration remain to be verified. config.js stays preview mode.
