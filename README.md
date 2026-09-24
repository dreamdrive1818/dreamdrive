# DreamDrive API

## Run locally

```bash
npm install
npm start
```

- `npm start` — **monolith** (default). One Express process, all modules.
- `npm run start:split` — gateway + domain services (local only).

Health check: `GET /health`

Client uses `REACT_APP_API_URL`. Firebase Auth stays in the browser; Firestore goes through this API.

## Deploy on Railway

1. Create a new Railway project → **Deploy from GitHub** → repo `dreamdrive1818/dreamdrive`.
2. Set **Root Directory** to `backend` (or connect the `server` branch if that is the backend-only tree).
3. Set **Start Command** to `npm start` (already in `railway.json`).
4. Add variables (Railway → Variables), at minimum:

| Variable | Notes |
|----------|--------|
| `FIREBASE_CONFIG` | Full Firebase service-account JSON (one line) |
| `USE_REDIS` | `false` unless you attach Redis |
| `GMAIL_*` | Needed for OTP / confirmation emails |
| `REACT_APP_CLOUDINARY_*` | Needed for image webhook uploads |
| `PUPPETEER_SKIP_DOWNLOAD` | `true` (set automatically via nixpacks) |
| `RUN_MODE` | `monolith` |

5. Generate a public domain (Settings → Networking → Generate Domain).
6. Point the frontend at that URL:

```env
REACT_APP_API_URL=https://YOUR-SERVICE.up.railway.app
```

Also set the same value in **Vercel → Environment Variables**, then redeploy the client.

CORS is open via `cors()` in `app.js`, so `https://www.dream-drive.co.in` can call the API.

## Notes

- Do **not** commit `credentials.json` or `.env`. Use `FIREBASE_CONFIG` on Railway.
- Render monolith notes still apply; Railway is the preferred host while Render is suspended.
- Puppeteer Chrome is skipped on Railway (`PUPPETEER_SKIP_DOWNLOAD`). Zoho browser jobs stay local/Electron.
