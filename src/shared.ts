import pino, { type Logger } from "pino";

export const logger: Logger = pino({
	level: process.env.LOG_LEVEL || "debug",
	timestamp: () => `,"time":"${new Date().toJSON()}"`,
});
