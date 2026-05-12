# Slothing licensing

Slothing uses an **open-core** model: the bulk of the codebase is open source under
the GNU AGPL v3, and a small set of hosted-only features lives in a proprietary
sub-directory. This page explains exactly what's what.

If you just want the short version:

- **Self-hosting Slothing for your own job search, including modifying it?** AGPL.
  Go for it. See [LICENSE](./LICENSE).
- **Running Slothing as a competing hosted service?** You can host the AGPL parts,
  but you must publish your modifications under AGPL too (network copyleft). The
  proprietary `apps/web/src/cloud/` directory is **not** licensed for that use.

---

## The two licenses

### 1. AGPL v3 — everything outside `apps/web/src/cloud/`

The default license for this repository is the
[GNU Affero General Public License version 3](./LICENSE) (AGPL-3.0).

This covers:

- The Next.js web application (`apps/web/`) — UI, API routes, database layer,
  LLM provider abstraction, resume parsing, opportunity tracking, knowledge bank,
  the Document Studio, Interview prep, analytics, salary tools, email templates.
- The Columbus browser extension (`apps/extension/`).
- Shared types, schemas, formatters, and scoring logic in `packages/shared/`.
- All build tooling, scripts, documentation, and tests.

The AGPL means:

- You are free to use, modify, and self-host Slothing.
- If you distribute or **host a modified version**, you must offer the
  modifications back to your users under the same AGPL terms (the "network
  copyleft" clause — this is what distinguishes AGPL from regular GPL).
- You cannot mix AGPL code into a closed-source product and ship it commercially
  without releasing the combined source.

### 2. Proprietary — files inside `apps/web/src/cloud/`

The `apps/web/src/cloud/` directory contains hosted-only features that power
**slothing.work**. These files are governed by a separate proprietary license
([LICENSE-CLOUD](./apps/web/src/cloud/LICENSE-CLOUD), present once Phase 3 ships)
and are **not covered by AGPL**.

This carve-out covers:

- Stripe billing integration (checkout, customer portal, webhook handlers)
- Subscription state management
- Credit ledger and deduction middleware
- Any hosted-only integrations or anti-abuse heuristics that may be added later

You may read this code. You may not host, redistribute, or use it commercially
without an explicit license from Kevin Jiang (the copyright holder).

**Self-hosters are not affected by this.** When you build Slothing for self-hosting
(`SLOTHING_CLOUD=0`, the default), the `cloud/` directory is excluded from the
build. You get a fully functional Slothing with BYOK (bring-your-own-key) LLM
integration. You just don't get the Stripe-backed billing and credit features,
because you don't need them.

---

## Why this split?

Slothing's product moat is the hosted experience, the brand, customer data, and
operational competence — not Stripe webhook plumbing or credit ledger math. Almost
everything that makes Slothing *useful* (parsing, AI tailoring, the Studio, the
opportunity tracker, the extension) is genuinely open.

The proprietary carve-out exists for one reason: to prevent someone from cloning
slothing.work verbatim and competing on price using our own Stripe integration.
The AGPL alone deters this for *most* of the code (network copyleft forces forks
to also be AGPL), but billing and credit logic is operationally sensitive enough
that we've chosen to keep it under a stricter license.

This pattern is well-established. It's what
[PostHog](https://github.com/PostHog/posthog) (`ee/` directory),
[Cal.com](https://github.com/calcom/cal.com) (`ee/` directory),
[Plausible](https://github.com/plausible/analytics),
[Formbricks](https://github.com/formbricks/formbricks), and
[Supabase](https://github.com/supabase/supabase) all do.

---

## What this means for you

### If you want to use Slothing

Use slothing.work, or run it yourself. Either way, your data stays with you;
the AGPL guarantees you can always self-host without losing access to your
own information.

### If you want to self-host Slothing

You can. Clone the repo, run `pnpm install && pnpm dev`. The default build
(`SLOTHING_CLOUD=0`) gives you the full feature set with BYOK LLM keys. There
is no payment required, no telemetry phone-home, no feature gating. See
[`docs/self-hosting.md`](./docs/self-hosting.md) (Phase 7) for a docker-compose
setup and deployment guide.

If you modify the code and run a modified version on a server that others use,
the AGPL requires you to make your modifications available to those users.

### If you want to contribute to Slothing

Contributions are welcome under the AGPL. By submitting a pull request, you
agree that your contribution is licensed under the AGPL-3.0 (the same license
as the rest of the project, unless your PR is explicitly modifying files inside
`apps/web/src/cloud/` — in which case you'd be contributing to proprietary code,
and we'd have a separate conversation about a CLA).

There is no contributor license agreement (CLA) for AGPL contributions today.
We may add one later if the project's licensing model evolves.

### If you want to build a competing hosted service on top of Slothing

The AGPL parts: yes, but you must publish your full source (including any
modifications you make) under AGPL to your users. Your derivative service must
itself be open-source.

The `apps/web/src/cloud/` parts: no, not without a commercial license. Contact
licensing@slothing.work to discuss terms.

### If you want to use parts of Slothing in your own AGPL-compatible project

Yes, with attribution and license preservation, as the AGPL requires. The
proprietary `cloud/` directory is not available for this use.

---

## Source-availability obligation (AGPL §13)

Slothing is a web application. AGPL §13 requires that we offer the corresponding
source code to all users of the hosted version. We satisfy this by making the
canonical repository publicly available at:

`https://github.com/<TBD>/slothing` *(Phase 7 — public open-sourcing)*

The hosted `slothing.work` web app will include a footer link to this repository
so users can always inspect, fork, or self-host the version they're interacting
with.

---

## Trademarks

"Slothing" and "Columbus" (the browser extension sub-brand) are unregistered
trademarks of Kevin Jiang. The AGPL grants you a copyright license but not a
trademark license — please don't ship a fork that calls itself "Slothing" or
use the Slothing logo on a competing service.

---

## Questions

- General licensing questions: licensing@slothing.work
- Commercial / cloud-tier licensing: licensing@slothing.work
- Security disclosures: security@slothing.work
