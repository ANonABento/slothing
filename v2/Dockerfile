# Slothing v2: one container, your data in a volume, your own AI keys from the environment.
#   docker compose up --build        → http://localhost:3000
# Typst and the resume fonts are baked in, so PDFs lay out the same as on any other machine.

FROM node:22-bookworm-slim AS build
WORKDIR /app
# curl + xz for `npm run engines`; python3/make/g++ in case better-sqlite3 has no prebuilt binary.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl xz-utils python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY scripts ./scripts
RUN npm run engines
COPY . .
# Building imports the database module; keep that throwaway database out of the image.
RUN SLOTHING_DATA_DIR=/tmp/build-data npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    SLOTHING_DATA_DIR=/data \
    PORT=3000
COPY --from=build /app/package.json /app/next.config.mjs ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/.engines ./.engines
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
