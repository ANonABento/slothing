FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS builder
ARG SLOTHING_CLOUD=0
ENV SLOTHING_CLOUD=$SLOTHING_CLOUD
COPY . .
RUN pnpm --filter @slothing/web build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "--filter", "@slothing/web", "start"]
