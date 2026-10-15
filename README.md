# rides-dispatch

Pricing and dispatch services for the RideScale demo platform (fictional).

- `src/pricing/`: surge multiplier and fare calculation
- `src/dispatch/`: pickup ETA estimation
- `src/lib/`: shared logger (PII-safe) and feature flags
- `generated/`: **generated code, do not edit by hand** (produced by the zone-sync job)

Engineering standards: see [`docs/STANDARDS.md`](docs/STANDARDS.md).
