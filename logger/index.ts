import pino from "pino";

// TODO: remove the `|| "info"` once I will know how to pass env to vitest
const level = process.env.LOG_LEVEL || "info";

export const logger = pino({ browser: { asObject: true }, level });