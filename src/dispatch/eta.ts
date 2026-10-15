/** Estimated minutes until the driver reaches the pickup point. */
export function pickupEtaMinutes(distanceKm: number, avgSpeedKmh: number): number {
  if (avgSpeedKmh <= 0) throw new Error("avgSpeedKmh must be positive");
  return Math.ceil((distanceKm / avgSpeedKmh) * 60);
}
