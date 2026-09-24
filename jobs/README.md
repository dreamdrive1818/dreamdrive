# Offline jobs — not mounted on the public API

These were unused Express routers (`/rs-entries`, `/zoho-image-extraction`). They mutate Firestore or drive Puppeteer with Zoho credentials and must not be public.

- `../controllers/restructureEntries.js`
- `../controllers/extractZohoImages.js`

Run them as one-off scripts from a trusted machine, or keep using `electron-app` for Zoho image download.
