import { LogLevel } from "@/types";
import { config } from "dotenv";
import { z } from "zod";

config();

interface CustomProcessEnv {
	PORT?: number;
	NODE_ENV?: "development" | "production" | "test";
	URL_WEBHOOK?: string;
	ENABLE_WEBHOOK?: boolean;
	ENABLE_WEBSOCKET?: boolean;
	BOT_NAME?: string;
	DATABASE_URL?: string;
	LOG_LEVEL?: LogLevel;
	RECONNECT_INTERVAL?: number;
	MAX_RECONNECT_RETRIES?: number;
	SSE_MAX_QR_GENERATION?: number;
	SESSION_CONFIG_ID?: string;
	API_KEY?: string;
}

const envSchema = z
	.object({
		PORT: z.number(),
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
		URL_WEBHOOK: z.string().optional(),
		ENABLE_WEBHOOK: z.boolean(),
		ENABLE_WEBSOCKET: z.boolean(),
		BOT_NAME: z.string().optional().default("Baileys Bot"),
		DATABASE_URL: z.string(),
		LOG_LEVEL: z.nativeEnum(LogLevel).default(LogLevel.INFO),
		RECONNECT_INTERVAL: z.number().default(0),
		MAX_RECONNECT_RETRIES: z.number().default(5),
		SSE_MAX_QR_GENERATION: z.number().default(5),
		SESSION_CONFIG_ID: z.string().optional().default("session-config"),
		API_KEY: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.ENABLE_WEBHOOK && !data.URL_WEBHOOK) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "URL_WEBHOOK is required when ENABLE_WEBHOOK is true",
				path: ["URL_WEBHOOK"],
			});
		}
	});

const processEnv: Partial<CustomProcessEnv> = {
	PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
	NODE_ENV: process.env.NODE_ENV as "development" | "production" | "test",
	URL_WEBHOOK: process.env.URL_WEBHOOK,
	ENABLE_WEBHOOK: process.env.ENABLE_WEBHOOK === "true",
	ENABLE_WEBSOCKET: process.env.ENABLE_WEBSOCKET === "true",
	BOT_NAME: process.env.BOT_NAME,
	DATABASE_URL: process.env.DATABASE_URL,
	LOG_LEVEL: process.env.LOG_LEVEL as LogLevel,
	RECONNECT_INTERVAL: process.env.RECONNECT_INTERVAL
		? Number(process.env.RECONNECT_INTERVAL)
		: undefined,
	MAX_RECONNECT_RETRIES: process.env.MAX_RECONNECT_RETRIES
		? Number(process.env.MAX_RECONNECT_RETRIES)
		: undefined,
	SSE_MAX_QR_GENERATION: process.env.SSE_MAX_QR_GENERATION
		? Number(process.env.SSE_MAX_QR_GENERATION)
		: undefined,
	SESSION_CONFIG_ID: process.env.SESSION_CONFIG_ID,
	API_KEY: process.env.API_KEY,
};

type EnvInput = z.input<typeof envSchema>;
type EnvOutput = z.output<typeof envSchema>;
type SafeParseReturn = z.SafeParseReturnType<EnvInput, EnvOutput>;

let env = process.env as CustomProcessEnv;
if (!process.env.SKIP_ENV_VALIDATION) {
	const formatErrors = (errors: z.ZodFormattedError<Map<string, string>, string>) =>
		Object.entries(errors)
			.map(([name, value]) => {
				if (value && "_errors" in value) return `${name}: ${value._errors.join(", ")}\n`;
				return null;
			})
			.filter(Boolean);

	const parsedEnv = envSchema.safeParse(processEnv) as SafeParseReturn;

	if (!parsedEnv.success) {
		const error = formatErrors(parsedEnv.error.format());
		console.error("❌ Invalid environment variables:\n", ...error);
		throw new Error("Invalid environment variables\n" + error.join(""));
	}

	env = parsedEnv.data as CustomProcessEnv;
} else {
	env = processEnv as CustomProcessEnv;
}

export default env;
