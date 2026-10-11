# Slothing Cloud — proprietary

This directory is **not licensed under the AGPL-3.0** that covers the rest of
the repository. See [`LICENSE-CLOUD`](./LICENSE-CLOUD) and
[`LICENSING.md`](../../../../LICENSING.md) at the repo root for terms.

## What lives here

Hosted-only code that powers `slothing.work`:

- Stripe billing integration (checkout, customer portal, webhook handlers)
- Subscription state management
- Credit ledger and deduction middleware
- Any future anti-abuse heuristics or hosted-tier integrations

## Build flag

Builds set `SLOTHING_CLOUD=1` to include this code. The default build
(`SLOTHING_CLOUD` unset, or `=0`) is the **self-host** build and **excludes
everything in this directory**.

The exclusion works two ways:

1. **Next.js routes** — anything named `route.cloud.ts` / `route.cloud.tsx`
   is registered as a Next route ONLY when `SLOTHING_CLOUD=1`. This is
   controlled via `pageExtensions` in `next.config.mjs`. Self-host builds
   never expose Stripe webhooks or billing endpoints, so there's nothing
   to misconfigure.
2. **Library code** — call `isCloudBuild()` from
   `@/lib/cloud-flag` to runtime-gate any other code path. Returns `true`
   only when `SLOTHING_CLOUD=1`.

## Conventions

- File suffix `.cloud.ts(x)` for any file that should only be compiled in
  hosted builds (mostly API route handlers).
- Plain `.ts(x)` files in `cloud/` compile in both builds. Keep these
  side-effect-free; gate behavior with `isCloudBuild()`.
- Tests for cloud code live alongside the source as
  `*.cloud.test.ts(x)` — they're only run when `SLOTHING_CLOUD=1`.

## Contributing

Pull requests touching this directory are accepted but require you to agree
that the contribution is licensed under the proprietary `LICENSE-CLOUD`
terms (not AGPL). See `LICENSING.md` for the contributor story.
