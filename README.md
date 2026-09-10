# Su Collection x UVA VEC Workshop Registration

A beautifully designed, mobile-first registration funnel for the free workshop hosted by **Su Collection** in collaboration with **UVA VEC**. This project features a multi-step interactive questionnaire, custom bilingual (Sinhala & English) dropdowns, and a seamless integration with Google Sheets via Google Apps Script.

## Features

- **Modern & Premium UI:** Glassmorphism, smooth animations, and a responsive mobile-first pop-over layout.
- **Bilingual Interface:** Form elements, questions, and exhaustive dropdown lists (195 countries and 25 districts) are fully translated into both Sinhala and English.
- **Dynamic Routing:** Conditional form progression. If the user lives in Sri Lanka, they are asked for their district; otherwise, they proceed directly to the next question.
- **Custom Dropdown Modals:** Native `<select>` inputs are replaced with custom full-screen overlay modals to provide a native mobile app experience on the web.
- **Google Sheets Integration:** Zero-dependency backend. The form submits directly to a Google Sheet using an Apps Script Webhook.

## Architecture

This project is built using vanilla web technologies to remain lightweight and easily deployable anywhere.

- `index.html`: The main entry point containing the landing page hero section and the modal structure.
- `styles.css`: All the styling, CSS variables, typography, and micro-animations.
- `app.js`: The core logic that handles the multi-step routing, data collection, custom dropdown rendering, and webhook submission.
- `apps-script.js`: The Google Apps Script code to be deployed as a Web App to pipe webhook POST requests into a Google Sheet.

## Deployment Instructions

### 1. Frontend
You can host the frontend on any static file hosting service like GitHub Pages, Vercel, Netlify, or Cloudflare Pages. Simply serve the root directory containing `index.html`, `app.js`, and `styles.css`.

### 2. Backend (Google Sheets)
1. Create a new Google Sheet.
2. Navigate to **Extensions > Apps Script**.
3. Clear the default code and paste the contents of `apps-script.js`.
4. Click **Deploy > New Deployment**.
5. Select type **Web app**.
6. Set "Execute as" to **Me** and "Who has access" to **Anyone**.
7. Click **Deploy** and authorize the script.
8. Copy the generated Web App URL.
9. Open `app.js` and replace the `WEBHOOK_URL` constant at the top of the file with your new URL.

**Note:** If you add or modify fields in the form, ensure you redeploy the Apps Script to a *new version* (Manage Deployments > Edit > New Version) for the changes to take effect.

## License

All rights reserved to Su Collection and UVA VEC.
