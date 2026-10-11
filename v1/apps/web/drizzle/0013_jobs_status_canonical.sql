-- F2.1 backfill: rewrite legacy `jobs.status` values onto the canonical
-- `OpportunityStatus` vocabulary from `@slothing/shared/schemas`.
--
--   offered   -> offer       (the user-visible "Offer received" stage)
--   withdrawn -> dismissed   (closest semantic match — user dropped the app)
--
-- All other values (`pending`, `saved`, `applied`, `interviewing`, `rejected`,
-- `dismissed`) already match the canonical set 1:1. `expired` is a new
-- canonical value that has no legacy counterpart so nothing maps onto it
-- here.
--
-- These UPDATEs are idempotent: running them a second time hits zero rows.
UPDATE `jobs` SET `status` = 'offer' WHERE `status` = 'offered';--> statement-breakpoint
UPDATE `jobs` SET `status` = 'dismissed' WHERE `status` = 'withdrawn';
