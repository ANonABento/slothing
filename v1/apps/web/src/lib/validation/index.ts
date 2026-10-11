// Note: the legacy `./jobs` re-export was deleted as part of F2.1 — there are
// no remaining consumers of `validateCreateJob` / `validateUpdateJob` etc. If
// you need job/opportunity validation, import from `@slothing/shared/schemas`
// (`createOpportunitySchema`, `updateOpportunitySchema`, …).
export * from "./profile";
