# Engineering standards (apply to every repo)

These are defined once and enforced on every pull request, whether a human or a coding agent wrote it.

## STD-01: No PII in logs
Never write rider or driver personal data (phone numbers, email addresses, names, home addresses, payment details) to logs at any level, including `debug`. Log the opaque `riderId` / `driverId` only. If a field may contain PII, pass it through `redact()` from `src/lib/logger.ts`.

## STD-02: Pricing changes must be feature-flagged
Any change that alters what a rider pays (surge, caps, fees, rounding) must be gated behind a feature flag via `isEnabled()` from `src/lib/flags.ts`, so it can be rolled back without a deploy.

## STD-03: Pricing overrides must be auditable
Whenever business logic overrides a computed price (caps, floors, manual adjustments), emit a `pricing.override` log event with the zone, the original value and the applied value.

## STD-04: Pricing limits come from config, not code
Caps, floors, fees and multiplier limits (any number that decides what a rider pays) must be read at runtime with `getPricingLimit()` from `src/config/pricingLimits.ts`, so Pricing Ops can change them per zone without a deploy. Never introduce a new hardcoded pricing limit, even temporarily. Input validation bounds are not pricing limits. Existing constants such as `MAX_MULTIPLIER` and `BASE_FARE` are legacy and are being migrated.
