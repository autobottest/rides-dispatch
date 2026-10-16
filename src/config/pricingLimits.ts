export type PricingLimitName =
  | "airport_surge_cap"
  | "surge_multiplier_min"
  | "surge_multiplier_max"
  | "booking_fee"
  | "min_fare";

export interface PricingLimitContext {
  zoneId?: string;
}

// In production this is backed by the pricing-config service, so Pricing Ops can change a
// limit (globally or per zone) without a deploy. Locally it reads PRICING_LIMITS (JSON) and
// falls back to the last config-service snapshot below.
const SNAPSHOT: Record<PricingLimitName, number> = {
  airport_surge_cap: 2.0,
  surge_multiplier_min: 1.0,
  surge_multiplier_max: 4.0,
  booking_fee: 2.5,
  min_fare: 5.0,
};

const overrides: Partial<Record<PricingLimitName, number>> = JSON.parse(
  process.env.PRICING_LIMITS ?? "{}",
);

export function getPricingLimit(name: PricingLimitName, _ctx: PricingLimitContext = {}): number {
  return overrides[name] ?? SNAPSHOT[name];
}
