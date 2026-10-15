import { AIRPORT_ZONES } from "../../generated/pricingZones.gen";

/** Extra time for drivers to reach airport curbside pickup lanes (RIDE-2). */
export const AIRPORT_CURBSIDE_BUFFER_SECONDS = 90;

/** Estimated minutes until the driver reaches the pickup point. */
export function pickupEtaMinutes(distanceKm: number, avgSpeedKmh: number, zoneId?: string): number {
  if (avgSpeedKmh <= 0) throw new Error("avgSpeedKmh must be positive");
  const baseMinutes = Math.ceil((distanceKm / avgSpeedKmh) * 60);

  if (zoneId && AIRPORT_ZONES.has(zoneId)) {
    return baseMinutes + AIRPORT_CURBSIDE_BUFFER_SECONDS;
  }
  return baseMinutes;
}
