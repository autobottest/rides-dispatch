export interface FlagContext {
  zoneId?: string;
  riderId?: string;
}

// In production this is backed by the flag service; locally it reads from env.
const enabledFlags = new Set(
  (process.env.ENABLED_FLAGS ?? "").split(",").map((f) => f.trim()).filter(Boolean),
);

export function isEnabled(flag: string, _ctx: FlagContext = {}): boolean {
  return enabledFlags.has(flag);
}
