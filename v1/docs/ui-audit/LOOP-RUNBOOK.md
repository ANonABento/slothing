# UI Audit Loop — Runbook

**Audience:** Claude session executing one iteration of the iterative UI audit loop (loop-002 onward). Each iteration is a fresh session with no in-conversation memory of prior loops. The state lives on disk: `docs/ui-audit/loop-NNN/` per iteration, plus git history.

This runbook is the single source of truth. Follow it top to bottom. **Do not improvise the high-level structure** — it's intentional so iterations are comparable and reviewable.

## Hard rules

1. Only ever work in the worktree branch `worktree-ui-audit-loop`. Verify with `git branch --show-current` before doing anything destructive.
2. Never `--no-verify` or skip pre-commit hooks. If type-check fails, **fix the underlying cause**.
3. Audit screenshots and findings get one commit. Implementation fixes get a separate commit.
4. Stop the loop the moment one full audit pass surfaces **0 high + 0 medium** findings. Hard cap at loop-008 regardless.
5. Don't touch `apps/web/src/messages/*.json` for translation drift unless reconciling against the canonical enum (e.g., `SESSION_QUESTION_CATEGORIES`). Translation work is a different workstream.
6. Don't chase dev-environment 500s in console output (missing API keys / data). They're not UI bugs. The dogfood loop owns them. See `docs/audits/dogfood-2026-05-13/`.

## Step-by-step

### 1. Verify environment

```bash
cd /home/anonabento/slothing/.claude/worktrees/ui-audit-loop
git branch --show-current  # must be worktree-ui-audit-loop
git status --short          # must be clean
```

If the worktree has uncommitted changes from a previous iteration, **stop**. Manual review needed.

### 2. Ensure dev server is up

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3010/en
# Expect 200. If not, restart:
PORT=3010 nohup pnpm --filter @slothing/web dev > /tmp/ui-audit-dev.log 2>&1 &
# Then poll until ready:
until grep -qE "Ready in|Error|EADDRINUSE" /tmp/ui-audit-dev.log; do sleep 1; done
```

### 3. Run capture (auto-detects next loop number)

```bash
node /home/anonabento/slothing/.claude/worktrees/ui-audit-loop/apps/web/scripts/ui-audit/capture.mjs --next
```

This produces `docs/ui-audit/loop-NNN/screenshots/`, `console-errors.json`, `run-summary.json`. Note the loop number it printed — you'll use it below.

If a route fails to capture (status != "ok" in run-summary.json), do **not** retry the whole script — capture re-screenshots all 75 frames. Either accept the partial run or re-capture only the failed routes with `--only slug1,slug2`.

### 4. Quick triage of console errors

```bash
node -e "
const e = require('./docs/ui-audit/loop-NNN/console-errors.json');
const sigs = {};
for (const x of e) sigs[x.text.split('\n')[0].slice(0,120)] = (sigs[x.text.split('\n')[0].slice(0,120)]||0)+1;
Object.entries(sigs).sort((a,b)=>b[1]-a[1]).slice(0,15).forEach(([s,n])=>console.log(n.toString().padStart(4),s));
"
```

Replace `NNN` with the real number. The loop-001 baseline was dominated by dev-env 500s. Anything **new** signature compared to loop-001 is real signal.

### 5. Write findings (parallel agents)

Spawn five parallel `general-purpose` agents covering these route groups:

- **marketing+auth:** home, pricing, ats-scanner, extension-marketing, vs-index, privacy, terms, sign-in
- **app-entry:** dashboard, profile, settings
- **docs+studio:** upload, documents, bank, answer-bank, studio
- **opportunities:** opportunities, opportunities-review, applications
- **tools:** interview, calendar, emails, analytics, salary, extension-connect

Use the prompt structure from loop-001 (look at the agents-launched in the loop-001 audit conversation; the same shape works). Each agent:

- Reads screenshots from `docs/ui-audit/loop-NNN/screenshots/<slug>-<width>.png` (multimodal Read).
- Inspects source files for the route.
- Writes per-route findings to `docs/ui-audit/loop-NNN/findings/<slug>.md` using `docs/ui-audit/templates/findings-template.md`.
- Uses **High / Medium / Low** classification per `docs/ui-audit/README.md` § Severity classification.
- **Compares against loop-(NNN-1) findings if they exist** — confirms which previously-flagged findings are now resolved (mark `[FIXED]`), still present (mark `[STILL]`), or regressed (`[REGRESSION]`).

Run the 5 agents in parallel — single message, multiple Agent tool calls.

### 6. Write `_global.md`

Yourself, write `docs/ui-audit/loop-NNN/findings/_global.md` for cross-cutting framework / shared-component issues that don't belong to any single route. Skim previous loops' `_global.md` to know which globals were already fixed.

### 7. Aggregate and prioritize

Write `docs/ui-audit/loop-NNN/summary.md` following the loop-001 shape:

- Headline H/M/L counts (totals + per group)
- Top 3-5 highest-leverage findings (cross-cutting wins)
- **Tier A** — globals + one-touch fixes you'll ship this iteration
- **Tier B** — targeted fixes you'll ship this iteration
- **Tier C** — large refactors deferred to next loop
- Exit-criteria check: "Loop NNN surfaced X H / Y M — {continue | terminate}"

If totals are 0 H + 0 M: **terminate**. Update `docs/ui-audit/README.md` status table to mark this loop "terminated — clean".

### 8. Commit the audit

```bash
git add apps/web/scripts/ui-audit/ docs/ui-audit/
git commit -m "docs(ui-audit): loop NNN audit pass"
```

Use a single-line subject like `docs(ui-audit): loop NNN audit pass`. Body: counts + top findings.

### 9. Implement Tier A + B fixes

Implementation rules:

- Don't add new abstractions for hypothetical future needs. The Tier A list is the scope.
- Don't add comments explaining "what" — only "why" when non-obvious. Past tense / change-log comments are forbidden (CLAUDE.md).
- Don't bg `bg-white`, `bg-black`, raw hex, etc. The `forbidden-color-lint` will fail CI. Use semantic tokens.
- Destructive actions need confirm-dialog or undo-snackbar (`docs/destructive-actions-pattern.md`).
- Profile and Studio are large files — change with care. Search for usage before renaming.
- After all fixes are written, run `pnpm type-check` to verify before committing.

### 10. Commit the fixes

```bash
git add -u
git commit -m "fix(ui-audit): loop NNN cross-cutting fixes"
```

Subject + body listing fixes. Body should reference the IDs from `loop-NNN/summary.md` (`G-H1`, `A1`, `B3`, etc.).

### 11. Decide next iteration

- If you wrote `terminated — clean` in summary.md: **end loop**. Don't schedule next iteration.
- Otherwise: **continue**. Schedule the next wakeup via ScheduleWakeup with delaySeconds tuned to "I just finished work, no need to check back fast" — pick **1800s** (30 min) so you don't burn cache for nothing. Pass the same loop prompt.

## Per-iteration time budget (rough)

| Phase | Target |
| --- | --- |
| Capture (75 frames) | 5–10 min |
| Agent finding writes (5 in parallel) | 5–10 min |
| Aggregate + plan | 5 min |
| Implement Tier A + B fixes | 20–60 min |
| Type-check + commit | 2–5 min |
| **Total** | **~40–90 min** |

## Troubleshooting

- **Dev server crashes mid-capture:** restart it (step 2) and re-run `--next` — but the loop dir already exists, so re-run with `--loop NNN` to overwrite.
- **Capture script fails at script start:** `node` ESM resolution can be sensitive. Always run via the absolute path printed in step 3.
- **Pre-commit hook fails on type-check:** `git fsck --lost-found` will list dangling commits. Per `feedback_precommit_hook_can_wipe_working_tree.md` memory, do not blindly `--no-verify`. Fix the type error.
- **Pre-commit hook reformats files via prettier:** that's expected; the working tree will re-stage them. Just commit again.
- **`forbidden-color-lint` fails:** find the offending file and switch to a semantic token. Don't disable the lint.
- **Out of context mid-iteration:** commit the audit + summary so far, leave fixes for next iteration. Note in `summary.md`: "Fixes deferred — context exhaustion in this iteration."

## Stop conditions (in priority order)

1. Audit pass shows 0 high + 0 medium findings. → terminate cleanly.
2. Loop-008 reached. → terminate; write `loop-008/summary.md` with "Hard cap reached, manual review needed for remaining lows."
3. Two consecutive iterations have not reduced the H+M count. → terminate; write a "no-progress" note in the latest summary.
4. Pre-commit hook fails three times in a row in one iteration. → terminate; ask the user.
