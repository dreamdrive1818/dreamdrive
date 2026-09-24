# Lean DreamDrive API image for Railway (no Chromium / Electron)
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    ELECTRON_SKIP_BINARY_DOWNLOAD=1 \
    HOST=0.0.0.0 \
    RUN_MODE=monolith

# Native build tools only if canvas needs them later; keep slim for API
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

# Ignore lifecycle scripts so electron/puppeteer don't download browsers
RUN npm ci --omit=dev --ignore-scripts

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
