import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export default function apiKeyValidator(req: Request, res: Response, next: NextFunction) {
	const apiKey = process.env.API_KEY;

  if (apiKey === undefined) return next();

  const headerApiKey = req.headers["x-api-key"] || req.headers["X-API-Key"];
  if (!headerApiKey) {
    return res.status(403).json({ error: "X-API-Key Header doesn't exist" });
  }
  if (headerApiKey !== apiKey) {
    return res.status(403).json({ error: "Your API key is invalid" });
  }
  next();
}
