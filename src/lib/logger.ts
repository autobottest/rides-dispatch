type Fields = Record<string, unknown>;

/** Replace a potentially sensitive value with a stable, non-reversible marker. */
export function redact(value: unknown): string {
  if (value === undefined || value === null) return "";
  return "[REDACTED]";
}

function emit(level: "debug" | "info" | "warn" | "error", event: string, fields: Fields = {}) {
  const line = { ts: new Date().toISOString(), level, event, ...fields };
  // Structured JSON logs are shipped to the central log pipeline.
  console.log(JSON.stringify(line));
}

export const logger = {
  debug: (event: string, fields?: Fields) => emit("debug", event, fields),
  info: (event: string, fields?: Fields) => emit("info", event, fields),
  warn: (event: string, fields?: Fields) => emit("warn", event, fields),
  error: (event: string, fields?: Fields) => emit("error", event, fields),
};
