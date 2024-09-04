import WhatsappService from "@/whatsapp/service";
import type { Request, Response, NextFunction } from "express";

export default function sessionValidator(req: Request, res: Response, next: NextFunction) {
	if (!WhatsappService.sessionExists(req.params.sessionId))
		return res.status(404).json({ error: "Session not found" });
	next();
}
