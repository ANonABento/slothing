#!/usr/bin/env bash
# Runs the archived v1 app next to v2 for side-by-side comparison: http://localhost:3100
# Local single-user mode (no login). Its database is v1/apps/web/.local.db.
# Never edits tracked v1 files: node_modules, .env.local and the database are all gitignored.
set -euo pipefail
cd "$(dirname "$0")/../../v1"
PORT="${V1_PORT:-3100}"
PNPM=(npx -y pnpm@9.0.0)

if [ ! -d node_modules ]; then
  echo "→ installing v1 dependencies (first run only)"
  HUSKY=0 "${PNPM[@]}" install --frozen-lockfile
fi

ENV_FILE=apps/web/.env.local
if [ ! -f "$ENV_FILE" ]; then
  echo "→ writing $ENV_FILE (local mode, AI key copied from v2/.env.local)"
  # Reuse v2's AI provider so v1's AI features work. Nebius is OpenAI-compatible.
  set -a; [ -f ../v2/.env.local ] && . ../v2/.env.local; set +a
  {
    echo "NEXTAUTH_URL=http://localhost:$PORT"
    echo "NEXTAUTH_SECRET=$(openssl rand -hex 32)"
    echo "NEXT_PUBLIC_NEXTAUTH_ENABLED=false"
    echo "SLOTHING_ALLOW_UNAUTHED_DEV=1"
    echo "TURSO_DATABASE_URL=file:./.local.db"
    if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
      echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY"
    elif [ -n "${NEBIUS_API_KEY:-}" ]; then
      echo "OPENAI_API_KEY=$NEBIUS_API_KEY"
      echo "OPENAI_BASE_URL=${NEBIUS_BASE_URL:-https://api.studio.nebius.com/v1}"
      echo "OPENAI_MODEL=${NEBIUS_MODEL:-moonshotai/Kimi-K3}"
    elif [ -n "${OPENAI_API_KEY:-}" ]; then
      echo "OPENAI_API_KEY=$OPENAI_API_KEY"
      [ -n "${OPENAI_BASE_URL:-}" ] && echo "OPENAI_BASE_URL=$OPENAI_BASE_URL"
      [ -n "${OPENAI_MODEL:-}" ] && echo "OPENAI_MODEL=$OPENAI_MODEL"
    fi
  } > "$ENV_FILE"
fi

echo "→ v1 on http://localhost:$PORT (v2 stays on its own port)"
cd apps/web
exec "${PNPM[@]}" exec next dev -p "$PORT"
