import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export default function apiKeyValidator(req: Request, res: Response, next: NextFunction) {
  const apiKey = process.env.API_KEY;

  if (apiKey !== "") {
    const headerApiKey = req.headers["api-key"];
    if (!headerApiKey) return res.status(403).json({ error: "API Key not found" });
    if (headerApiKey !== apiKey) return res.status(403).json({ error: "Invalid API Key" });
    next();
  }
  next();
}
