import env from "@/config/env";
import pino, { type Logger } from "pino";

export const logger: Logger = pino({
	timestamp: () => `,"time":"${new Date().toJSON()}"`,
	transport: {
		targets: [
			{
				level: env.LOG_LEVEL || "debug",
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			},
		],
	},
	mixin(mergeObject, level) {
		return {
			...mergeObject,
			level: level,
		};
	},
});
