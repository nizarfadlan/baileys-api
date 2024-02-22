import type { Request, Response, NextFunction } from "express";
import { sessionExists } from "@/whatsapp";

export default function sessionValidator(req: Request, res: Response, next: NextFunction) {
	if (!sessionExists(req.params.sessionId))
		return res.status(404).json({ error: "Session not found" });
	next();
}
